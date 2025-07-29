# 🌊 AquaGreen AI Dashboa## 📋 **ไฟล์สำคัญ:**

| ไฟล์ | ใช้สำหรับ |
|------|----------|
| ⭐ `QUICK_START.md` | เริ่มใช้งานแบบเร็ว (อ่านก่อน!) |
| 🔗 `FRIEND_LINK_GUIDE.md` | วิธีลิงค์โค้ดเพื่อนเข้าระบบ |
| ✅ `friend_code_clean.ino` | โค้ด Arduino (เวอร์ชันสะอาด) |
| ✅ `ARDUINO_SETUP.md` | คู่มือติดตั้ง Arduino |
| ✅ `test_arduino_data.js` | ทดสอบระบบ |ตรวจสอบคุณภาพน้ำแบบ Real-time ที่ใช้ Arduino + Web Dashboard + Line แจ้งเตือน

## 🚀 **เปิดใช้งานง่ายๆ:**

### **👨‍💻 สำหรับเพื่อนที่จะใช้ Arduino:**
```bash
ดู: QUICK_START.md
```

### **💻 สำหรับคนที่จะเปิด Web Dashboard:**
```bash
# Windows
start-dashboard.bat

# Manual  
npm install && npm run dev
```

## 🌐 **ลิงก์สำคัญ:**

- **🌐 Dashboard Online**: [aquagreen-ai-dashboard](https://aquagreen-ai-dashboard-q7tq0p1hj-worrapat-bots-projects.vercel.app)
- **📱 Local**: http://localhost:5173

## � **ไฟล์สำคัญ:**

| ไฟล์ | ใช้สำหรับ |
|------|----------|
| ✅ `friend_code_clean.ino` | โค้ด Arduino (เวอร์ชันสะอาด) |
| ✅ `QUICK_START.md` | เริ่มใช้งานแบบเร็ว |
| ✅ `ARDUINO_SETUP.md` | คู่มือติดตั้ง Arduino |
| ✅ `ARDUINO_API.md` | คู่มือ API รายละเอียด |
| ✅ `HOW_TO_RUN.md` | คู่มือเปิดระบบครบครัน |
| ✅ `test_arduino_data.js` | ทดสอบระบบ |

## 🎯 **ความสามารถ:**

- ✅ **Arduino**: ส่งข้อมูลเซนเซอร์ TDS, pH, Temp, Turbidity
- ✅ **Blynk App**: ดูข้อมูลบนมือถือแบบ Real-time  
- ✅ **Web Dashboard**: กราฟและประวัติข้อมูล
- ✅ **Line แจ้งเตือน**: เมื่อน้ำผิดปกติ
- ✅ **Deploy Online**: ใช้งานได้ทุกที่

## � **เทคโนโลยี:**

- **Frontend**: React + TypeScript + Tailwind
- **Backend**: Firebase + Functions
- **Hardware**: Arduino ESP32/NodeMCU
- **Deploy**: Vercel

## 📞 **ติดต่อ:**

มีปัญหาหรือต้องการความช่วยเหลือ สามารถถามได้เลย! �

---

**สร้างด้วย ❤️ เพื่อน้ำที่สะอาดและปลอดภัย** 🌊

```
Arduino Sensors → Firebase Firestore → Dashboard + Line Alerts
```

1. Arduino reads sensor data (pH, TDS, Turbidity, Temperature)
2. Sends data to Firebase via REST API  
3. Dashboard displays real-time charts
4. Line notifications sent if values exceed limits

## 🎯 Sensor Limits

- **pH**: 6.5 - 8.5 (alerts outside range)
- **TDS**: < 1000 ppm (alerts above)
- **Turbidity**: < 50% (alerts above)  
- **Temperature**: 15-35°C (alerts outside range)
