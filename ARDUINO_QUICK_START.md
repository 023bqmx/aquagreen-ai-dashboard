# 🚀 Arduino Quick Start Guide

## ✅ Checklist สำหรับการเชื่อมต่อ Arduino

### 1. **ฮาร์ดแวร์** 
- [ ] Arduino UNO R4 WiFi
- [ ] เซนเซอร์ pH
- [ ] เซนเซอร์ TDS  
- [ ] เซนเซอร์ Turbidity
- [ ] เซนเซอร์อุณหภูมิ DS18B20
- [ ] ตัวต้านทาน 4.7kΩ (สำหรับ DS18B20)
- [ ] Breadboard และสายไฟ

### 2. **ซอฟต์แวร์**
- [ ] Arduino IDE
- [ ] Libraries: WiFiNINA, BlynkSimpleWiFiNINA, ArduinoHttpClient, OneWire, DallasTemperature

### 3. **การตั้งค่า**
- [ ] แก้ไข WiFi SSID และ Password ใน `friend_code_clean.ino`
- [ ] อัปโหลดโค้ดใส่ Arduino
- [ ] ตรวจสอบ Serial Monitor

### 4. **การทดสอบ**
- [ ] รัน `node monitor_arduino.js` เพื่อดูข้อมูล Real-time
- [ ] ตรวจสอบ Dashboard ที่ `http://localhost:8080`
- [ ] ทดสอบการแจ้งเตือน LINE

## 🔧 คำสั่งที่ใช้บ่อย

```bash
# เริ่ม Dashboard
npm run dev

# ตรวจสอบ Arduino
node monitor_arduino.js

# ทดสอบ LINE
node test_abnormal_data.js

# Deploy Functions
firebase deploy --only functions
```

## 📞 หากมีปัญหา

### Arduino ไม่ส่งข้อมูล:
1. ตรวจสอบ Serial Monitor
2. ตรวจสอบการเชื่อมต่อ WiFi
3. ตรวจสอบ Firebase API Key

### Dashboard ไม่แสดงข้อมูล:
1. ตรวจสอบ Firebase config ใน `.env`
2. รีเฟรช Browser
3. ตรวจสอบ Console log

### LINE ไม่แจ้งเตือน:
1. ทดสอบ `curl "https://testlinetoken-2jauweenmq-uc.a.run.app"`
2. ส่งข้อมูลผิดปกติ `node test_abnormal_data.js`
3. ตรวจสอบ Firebase Functions logs
