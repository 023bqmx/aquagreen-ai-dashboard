# 🔧 การตั้งค่า Arduino สำหรับ Aquagreen AI Dashboard

## 📋 ข้อมูลที่ต้องแก้ไขใน Arduino Code (`friend_code_clean.ino`)

### 1. **ข้อมูล WiFi**
```cpp
char ssid[] = "ชื่อ_WiFi_ของคุณ";
char pass[] = "รหัสผ่าน_WiFi_ของคุณ";
```

### 2. **ข้อมูล Firebase** (ใช้ค่าเดิม - ถูกต้องแล้ว)
```cpp
const char* apiKey = "AIzaSyB88B5BQM3OJPXZGLFYBZopAOYhOaBQdio";
const char* projectId = "arduinosensoralerts";
```

### 3. **การเชื่อมต่อเซนเซอร์** 
ตรวจสอบให้แน่ใจว่าเซนเซอร์เชื่อมต่อถูกต้อง:
```cpp
const int PH_PIN = A1;        // เซนเซอร์ pH
const int TDS_PIN = A2;       // เซนเซอร์ TDS
const int TURBIDITY_PIN = A3; // เซนเซอร์ความขุ่น
const int ONEWIRE_BUS_PIN = 2; // เซนเซอร์อุณหภูมิ DS18B20
```

### 4. **Blynk Token** (ถ้าต้องการใช้ Blynk)
```cpp
char auth[] = "WQVVuYELHoKM0fxkXcOpUqj3g_xQtduk";
```

## 🔌 การเชื่อมต่อฮาร์ดแวร์

### เซนเซอร์ pH
- VCC → 3.3V
- GND → GND  
- Signal → A1

### เซนเซอร์ TDS
- VCC → 3.3V
- GND → GND
- Signal → A2

### เซนเซอร์ Turbidity
- VCC → 3.3V
- GND → GND
- Signal → A3

### เซนเซอร์อุณหภูมิ DS18B20
- VCC → 3.3V
- GND → GND
- Data → Pin 2
- ใส่ตัวต้านทาน 4.7kΩ ระหว่าง VCC และ Data

## 📡 การส่งข้อมูลไป Firebase

Arduino จะส่งข้อมูลในรูปแบบ JSON ไป Firebase:
```json
{
  "ph": 7.2,
  "tds": 150.5,
  "turbidity": 20.1,
  "temperature": 25.8,
  "timestamp": "2025-07-31T10:30:15Z",
  "location": "Arduino_UNO_R4",
  "device_id": "ARDUINO_001"
}
```

## ⚙️ การตั้งค่าเพิ่มเติม

### Frequency การส่งข้อมูล
ปัจจุบันส่งทุก 30 วินาที - สามารถปรับได้ใน:
```cpp
timer.setInterval(30000L, sendSensorData); // 30 วินาที
```

### การปรับค่าเซนเซอร์
หากค่าเซนเซอร์ไม่ถูกต้อง สามารถปรับใน function:
- `readPHValue()`
- `readTDSValue()`  
- `readTurbidityValue()`
- `readTemperature()`
