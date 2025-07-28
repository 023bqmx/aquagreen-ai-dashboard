# 🔗 Arduino Integration Guide

## สำหรับนักพัฒนา Arduino ที่ต้องการส่งข้อมูลมาที่ระบบนี้

### 📡 **Endpoint สำหรับส่งข้อมูล:**

```
Firebase Firestore REST API:
POST https://firestore.googleapis.com/v1/projects/arduinosensoralerts/databases/(default)/documents/sensor_readings?key={API_KEY}
```

### 🔑 **API Key:**
```
AIzaSyB88B5BQM3OJPXZGLFYBZopAOYhOaBQdio
```

### 📋 **รูปแบบข้อมูลที่ต้องส่ง (JSON):**

```json
{
  "fields": {
    "ph": {
      "doubleValue": 7.25
    },
    "tds": {
      "doubleValue": 145.3
    },
    "turbidity": {
      "doubleValue": 15.2
    },
    "temperature": {
      "doubleValue": 26.8
    },
    "timestamp": {
      "timestampValue": "2024-07-28T10:15:30.000Z"
    },
    "location": {
      "stringValue": "Arduino_Device_01"
    },
    "device_id": {
      "stringValue": "YOUR_DEVICE_ID"
    }
  }
}
```

### 🛠️ **ตัวอย่างโค้ด Arduino (WiFi):**

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "YOUR_WIFI";
const char* password = "YOUR_PASSWORD";
const char* apiKey = "AIzaSyB88B5BQM3OJPXZGLFYBZopAOYhOaBQdio";

void sendSensorData(float ph, float tds, float turbidity, float temp) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    String url = "https://firestore.googleapis.com/v1/projects/arduinosensoralerts/databases/(default)/documents/sensor_readings?key=" + String(apiKey);
    
    http.begin(url);
    http.addHeader("Content-Type", "application/json");
    
    // สร้าง JSON payload
    StaticJsonDocument<500> doc;
    doc["fields"]["ph"]["doubleValue"] = ph;
    doc["fields"]["tds"]["doubleValue"] = tds;
    doc["fields"]["turbidity"]["doubleValue"] = turbidity;
    doc["fields"]["temperature"]["doubleValue"] = temp;
    doc["fields"]["timestamp"]["timestampValue"] = "2024-07-28T10:15:30.000Z";
    doc["fields"]["location"]["stringValue"] = "Arduino_Device_01";
    doc["fields"]["device_id"]["stringValue"] = "DEVICE_001";
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode == 200) {
      Serial.println("✅ Data sent successfully!");
    } else {
      Serial.println("❌ Error: " + String(httpResponseCode));
    }
    
    http.end();
  }
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected!");
}

void loop() {
  // อ่านค่าเซนเซอร์ของคุณ
  float ph_value = 7.2;      // แทนด้วยการอ่านเซนเซอร์จริง
  float tds_value = 150.0;   // แทนด้วยการอ่านเซนเซอร์จริง
  float turbidity_value = 12.5; // แทนด้วยการอ่านเซนเซอร์จริง
  float temp_value = 25.8;   // แทนด้วยการอ่านเซนเซอร์จริง
  
  sendSensorData(ph_value, tds_value, turbidity_value, temp_value);
  
  delay(30000); // ส่งทุก 30 วินาที
}
```

### 🌐 **ตัวอย่างการส่งด้วย HTTP Request (สำหรับ ESP32/ESP8266):**

```cpp
// Headers ที่ต้องมี
http.addHeader("Content-Type", "application/json");

// URL
String url = "https://firestore.googleapis.com/v1/projects/arduinosensoralerts/databases/(default)/documents/sensor_readings?key=AIzaSyB88B5BQM3OJPXZGLFYBZopAOYhOaBQdio";

// POST Request
int httpCode = http.POST(jsonPayload);
```

### 📊 **ตรวจสอบข้อมูลที่ส่งแล้ว:**

1. **Dashboard**: http://localhost:8080
2. **Firebase Console**: https://console.firebase.google.com/project/arduinosensoralerts/firestore

### ⚙️ **ข้อกำหนดเซนเซอร์:**

- **pH**: 0.00 - 14.00
- **TDS**: 0 - 2000 ppm  
- **Turbidity**: 0 - 100 %
- **Temperature**: 0 - 50 °C

### 🔧 **การแก้ไขปัญหา:**

#### Status Code 401 (Unauthorized):
- ตรวจสอบ API Key ถูกต้อง

#### Status Code 400 (Bad Request):
- ตรวจสอบรูปแบบ JSON ถูกต้อง
- ตรวจสอบ field types

#### Status Code 403 (Forbidden):
- ตรวจสอบ Firestore Rules

### 📱 **การแจ้งเตือน Line:**

เมื่อข้อมูลเข้าระบบแล้ว หากค่าเซนเซอร์เกินขีดจำกัด ระบบจะส่ง Line notification อัตโนมัติ

**ขีดจำกัดปัจจุบัน:**
- pH < 6.5 หรือ pH > 8.5
- TDS > 1000 ppm
- Turbidity > 50%
- Temperature > 35°C หรือ < 15°C

---

### 💡 **สรุป:**

1. ส่งข้อมูลไปที่ Firebase Firestore REST API
2. ใช้ API Key: `AIzaSyB88B5BQM3OJPXZGLFYBZopAOYhOaBQdio`
3. ใส่ข้อมูลในรูปแบบ Firestore Document
4. ข้อมูลจะแสดงใน Dashboard อัตโนมัติ
5. ระบบจะแจ้งเตือนผ่าน Line หากค่าผิดปกติ
