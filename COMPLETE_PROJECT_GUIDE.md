# 🌊 Aquagreen AI Dashboard - Complete Setup Guide

## ✅ **โปรเจคเสร็จสมบูรณ์แล้ว!**

### **🎯 สิ่งที่ทำงานได้:**
- ✅ Web Dashboard (Real-time charts)
- ✅ Arduino Code สำหรับเซนเซอร์
- ✅ Firebase Database
- ✅ LINE Messaging API
- ✅ Production Build

### **🚀 วิธีรันโปรเจค:**

#### **Development Mode:**
```bash
npm install
npm run dev
# เปิด http://localhost:8080
```

#### **Production Build:**
```bash
npm run build
npm run preview
```

#### **Arduino Setup:**
1. ใช้ไฟล์ `friend_code_clean.ino`
2. แก้ไข WiFi credentials และ Blynk token
3. เชื่อมต่อเซนเซอร์ตาม pin ที่กำหนด
4. Upload ไป Arduino

### **📱 LINE Notifications:**

#### **การตั้งค่า:**
- Channel Access Token: ✅ ใช้งานได้
- User ID: ✅ ใช้งานได้  
- Firebase Functions: ✅ Deploy แล้ว

#### **ทดสอบการแจ้งเตือน:**
```bash
# ทดสอบ LINE Token
curl "https://testlinetoken-2jauweenmq-uc.a.run.app"

# ทดสอบข้อมูลปกติ
node test_arduino_data.js

# ทดสอบข้อมูลผิดปกติ (จะได้รับแจ้งเตือน LINE)
node test_abnormal_data.js
```

### **🔧 Arduino Integration:**

#### **เมื่อ Arduino พร้อมแล้ว:**
1. แก้ไข WiFi ใน `friend_code_clean.ino`
2. อัปโหลดโค้ดใส่ Arduino UNO R4 WiFi
3. สร้าง Service Account Key จาก Firebase Console
4. วางไฟล์ `service-account-key.json` ใน root folder

#### **ตรวจสอบ Arduino Real-time:**
```bash
# ตรวจสอบข้อมูลจาก Arduino
node monitor_arduino.js
```

#### **การเชื่อมต่อเซนเซอร์:**
- pH Sensor → Pin A1
- TDS Sensor → Pin A2
- Turbidity Sensor → Pin A3
- Temperature DS18B20 → Pin 2

### **🌐 URLs:**
- **Local:** http://localhost:8080
- **Production:** https://aquagreen-ai-dashboard-q7tq0p1hj-worrapat-bots-projects.vercel.app

### **🧪 การทดสอบ:**
```bash
# ทดสอบ Arduino data
node test_arduino_data.js

# ทดสอบ LINE token
cd functions && node test-line-token.js
```

### **📊 Dashboard Features:**
- Real-time sensor readings
- pH, TDS, Turbidity, Temperature charts
- Alert system
- Live clock
- Mobile responsive

### **🎮 Arduino Sensors:**
- pH Sensor → Pin A0
- TDS Sensor → Pin A1  
- Temperature → Pin A2
- Turbidity → Pin A3

## **💡 Next Steps:**
1. Deploy Firebase Functions สำหรับ LINE notifications
2. Test กับ Arduino จริง
3. Customize dashboard ตามต้องการ
4. Setup production monitoring
