# 🔑 วิธีสร้าง Service Account Key สำหรับ Arduino Integration

## ขั้นตอนการสร้าง Service Account Key:

### 1. เข้า Firebase Console
```
https://console.firebase.google.com/project/arduinosensoralerts
```

### 2. ไปที่ Project Settings
- คลิกไอคอนเฟือง ⚙️ ข้างชื่อโปรเจค
- เลือก "Project settings"

### 3. ไปที่ Service accounts tab
- คลิกแท็บ "Service accounts"
- เลือก "Firebase Admin SDK"

### 4. Generate private key
- คลิกปุ่ม "Generate new private key"
- คลิก "Generate key" เพื่อยืนยัน
- ไฟล์ JSON จะถูกดาวน์โหลดอัตโนมัติ

### 5. บันทึกไฟล์
- เปลี่ยนชื่อไฟล์เป็น `service-account-key.json`
- วางไฟล์ใน folder หลักของโปรเจค
- ⚠️ **ห้าม commit ไฟล์นี้เข้า Git!**

### 6. เพิ่มในไฟล์ .gitignore
```
service-account-key.json
```

## 🧪 ทดสอบการเชื่อมต่อ Arduino

### หลังจากตั้งค่า Service Account แล้ว:
```bash
# ตรวจสอบข้อมูลจาก Arduino แบบ Real-time
node monitor_arduino.js
```

### ผลลัพธ์ที่คาดหวัง:
```
🔍 เริ่มตรวจสอบข้อมูลจาก Arduino...
📡 รอข้อมูลจาก Arduino UNO R4 WiFi...

📊 ข้อมูลล่าสุด:
📅 เวลา: 31/7/2025 เวลา 10:30:15
🧪 pH: 7.2
💧 TDS: 150.5 ppm
🌫️ Turbidity: 20.1 NTU
🌡️ Temperature: 25.8 °C
📍 Location: Arduino_UNO_R4
🔧 Device: ARDUINO_001

✅ ข้อมูลใหม่! (ส่งมาเมื่อ 0 นาทีที่แล้ว)

🔄 เริ่มการตรวจสอบแบบ Real-time...
🛑 กด Ctrl+C เพื่อหยุด
```

## 🚨 หากมีปัญหา

### ไม่มีข้อมูล:
1. ตรวจสอบ WiFi ใน Arduino
2. ตรวจสอบ Firebase API Key
3. ตรวจสอบการเชื่อมต่อเซนเซอร์

### ข้อมูลเก่า:
1. รีสตาร์ท Arduino
2. ตรวจสอบ Serial Monitor
3. ตรวจสอบ Firebase Firestore Console
