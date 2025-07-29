/*
 * โค้ดสำหรับเพื่อน: Blynk + Firebase Integration
 * ส่งข้อมูลไปทั้ง Blynk และ Firebase พร้อมกัน
 * บอร์ด: Arduino MKR WiFi 1010
 */

#define BLYNK_PRINT Serial
#include <SPI.h>
#include <WiFiNINA.h>
#include <BlynkSimpleWiFiNINA.h>
#include <ArduinoHttpClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// =================== การตั้งค่า ===================
char auth[] = "WQVVuYELHoKM0fxkXcOpUqj3g_xQtduk"; // ใส่ Auth Token ของ Blynk
char ssid[] = "YOUR_WIFI_SSID";
char pass[] = "YOUR_WIFI_PASSWORD";

// Firebase
const char* firebaseHost = "firestore.googleapis.com";
const int firebasePort = 443;
const char* apiKey = "AIzaSyB88B5BQM3OJPXZGLFYBZopAOYhOaBQdio";
const char* projectId = "arduinosensoralerts";

// พิน
const int PH_PIN = A1;
const int TDS_PIN = A2;
const int TURBIDITY_PIN = A3;
const int ONEWIRE_BUS_PIN = 2;
const int WATER_PUMP_RELAY_PIN = 3;
const int AIR_PUMP_RELAY_PIN = 4;

// ค่าคงที่
const int ADC_RESOLUTION = 4095;
const float VOLTAGE_REFERENCE = 3.3;
const int NUM_SAMPLES = 30;

// =================== Objects ===================
OneWire oneWire(ONEWIRE_BUS_PIN);
DallasTemperature sensors(&oneWire);
BlynkTimer timer;
WiFiSSLClient firebaseWifiClient;
HttpClient firebaseHttpClient = HttpClient(firebaseWifiClient, firebaseHost, firebasePort);

// =================== Setup ===================
void setup() {
  Serial.begin(115200);
  Serial.println("🌊 เริ่มต้นระบบ Blynk + Firebase...");

  analogReadResolution(12);
  sensors.begin();

  pinMode(WATER_PUMP_RELAY_PIN, OUTPUT);
  digitalWrite(WATER_PUMP_RELAY_PIN, LOW);
  pinMode(AIR_PUMP_RELAY_PIN, OUTPUT);
  digitalWrite(AIR_PUMP_RELAY_PIN, LOW);

  Blynk.begin(auth, ssid, pass);
  timer.setInterval(5000L, sendSensorData);
  
  Serial.println("🚀 ระบบพร้อมทำงาน!");
}

// =================== Main Loop ===================
void loop() {
  Blynk.run();
  timer.run();
}

// =================== ส่งข้อมูลเซ็นเซอร์ ===================
void sendSensorData() {
  // อ่านเซ็นเซอร์
  sensors.requestTemperatures();
  float temperatureC = sensors.getTempCByIndex(0);
  if(temperatureC == -127.0) temperatureC = 25.0;

  float phValue = readPh();
  float tdsValue = readTds(temperatureC);
  float turbidityValue = readTurbidity();

  // แสดงข้อมูล
  Serial.println("📊 ข้อมูลเซ็นเซอร์:");
  Serial.println("🌡️ อุณหภูมิ: " + String(temperatureC) + " °C");
  Serial.println("🧪 pH: " + String(phValue));
  Serial.println("💧 TDS: " + String(tdsValue) + " ppm");
  Serial.println("🌫️ ความขุ่น: " + String(turbidityValue) + " NTU");

  // ส่งไป Blynk
  Blynk.virtualWrite(V0, temperatureC);
  Blynk.virtualWrite(V1, phValue);
  Blynk.virtualWrite(V2, tdsValue);
  Blynk.virtualWrite(V3, turbidityValue);

  // ส่งไป Firebase
  sendToFirebase(temperatureC, phValue, tdsValue, turbidityValue);

  // ควบคุมปั๊ม
  if (phValue < 6.5 || turbidityValue > 50.0 || tdsValue > 500) {
    digitalWrite(WATER_PUMP_RELAY_PIN, HIGH);
    Blynk.virtualWrite(V4, 255);
  } else {
    digitalWrite(WATER_PUMP_RELAY_PIN, LOW);
    Blynk.virtualWrite(V4, 0);
  }
}

// =================== Firebase ===================
void sendToFirebase(float temp, float ph, float tds, float turbidity) {
  if (WiFi.status() != WL_CONNECTED) return;
  
  String data = "{\"fields\":{";
  data += "\"temperature\":{\"doubleValue\":" + String(temp) + "},";
  data += "\"pH\":{\"doubleValue\":" + String(ph) + "},";
  data += "\"tds\":{\"doubleValue\":" + String(tds) + "},";
  data += "\"turbidity\":{\"doubleValue\":" + String(turbidity) + "},";
  data += "\"location\":{\"stringValue\":\"Blynk_Device\"},";
  data += "\"deviceId\":{\"stringValue\":\"BLYNK_001\"}}}";

  String url = "/v1/projects/" + String(projectId) + "/databases/(default)/documents/sensorData?key=" + String(apiKey);
  
  firebaseHttpClient.beginRequest();
  firebaseHttpClient.post(url);
  firebaseHttpClient.sendHeader("Content-Type", "application/json");
  firebaseHttpClient.sendHeader("Content-Length", data.length());
  firebaseHttpClient.beginBody();
  firebaseHttpClient.print(data);
  firebaseHttpClient.endRequest();

  if (firebaseHttpClient.responseStatusCode() == 200) {
    Serial.println("✅ Firebase สำเร็จ!");
  }
}

// =================== อ่านเซ็นเซอร์ ===================
float readPh() {
  int total = 0;
  for (int i = 0; i < NUM_SAMPLES; i++) {
    total += analogRead(PH_PIN);
    delay(10);
  }
  float voltage = (float)total / NUM_SAMPLES * (VOLTAGE_REFERENCE / ADC_RESOLUTION);
  return 7.0 + (((VOLTAGE_REFERENCE / 2.0) - voltage) / 0.18);
}

float readTds(float temperature) {
  int buffer[NUM_SAMPLES];
  for (int i = 0; i < NUM_SAMPLES; i++) {
    buffer[i] = analogRead(TDS_PIN);
    delay(40);
  }
  
  float voltage = getMedianNum(buffer, NUM_SAMPLES) * (float)VOLTAGE_REFERENCE / ADC_RESOLUTION;
  float compensation = 1.0 + 0.02 * (temperature - 25.0);
  voltage = voltage / compensation;
  
  return (133.42 * voltage * voltage * voltage - 255.86 * voltage * voltage + 857.39 * voltage) * 0.5;
}

float readTurbidity() {
  int total = 0;
  for (int i = 0; i < NUM_SAMPLES; i++) {
    total += analogRead(TURBIDITY_PIN);
    delay(10);
  }
  float voltage = (float)total / NUM_SAMPLES * (VOLTAGE_REFERENCE / ADC_RESOLUTION);
  float ntu = -1120.4 * pow(voltage, 2) + 5742.3 * voltage - 4352.9;
  return (ntu < 0) ? 0 : ntu;
}

int getMedianNum(int arr[], int size) {
  int temp[size];
  for (int i = 0; i < size; i++) temp[i] = arr[i];
  
  for (int i = 0; i < size - 1; i++) {
    for (int j = 0; j < size - i - 1; j++) {
      if (temp[j] > temp[j + 1]) {
        int swap = temp[j];
        temp[j] = temp[j + 1];
        temp[j + 1] = swap;
      }
    }
  }
  
  return (size % 2 == 1) ? temp[size / 2] : (temp[size / 2] + temp[size / 2 - 1]) / 2;
}

// =================== Blynk Controls ===================
BLYNK_WRITE(V5) {
  digitalWrite(WATER_PUMP_RELAY_PIN, param.asInt());
  Blynk.virtualWrite(V4, param.asInt() ? 255 : 0);
}

BLYNK_WRITE(V6) {
  digitalWrite(AIR_PUMP_RELAY_PIN, param.asInt());
  Blynk.virtualWrite(V7, param.asInt() ? 255 : 0);
}
