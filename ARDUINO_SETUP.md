# 🔌 Arduino Setup สำหรับเพื่อน

## 🎯 **เป้าหมาย:**
เซ็ตอัพ Arduino ให้ส่งข้อมูลเซนเซอร์ไปยัง:
- 📱 Blynk App (ดูข้อมูลแบบ Real-time)
- 🌐 Web Dashboard (ดูกราฟและประวัติ)
- 💬 Line แจ้งเตือน (เมื่อน้ำผิดปกติ)

---

## 🛠️ **สิ่งที่ต้องมี:**

### **Hardware:**
- Arduino (ESP32/NodeMCU/Wemos D1)
- TDS Sensor (วัดความสะอาด)
- pH Sensor (วัดความเป็นกรด-ด่าง)
- Temperature Sensor (วัดอุณหภูมิ)
- Turbidity Sensor (วัดความขุ่น)

### **Software:**
- Arduino IDE
- Blynk App (มือถือ)

---

## 📋 **ขั้นตอนการติดตั้ง:**

### **1. ติดตั้ง Arduino IDE:**
- โหลด Arduino IDE จาก: https://www.arduino.cc/
- เปิดและติดตั้ง ESP32 Board Manager

### **2. ติดตั้ง Blynk App:**
- โหลด Blynk IoT จาก Play Store/App Store
- สร้างบัญชีใหม่
- สร้าง Template ใหม่
- คัดลอก Template ID และ Auth Token

### **3. โหลดโค้ด:**
```arduino
// เปิดไฟล์: friend_code_clean.ino
// แก้ไขข้อมูลต่อไปนี้:

#define WIFI_SSID "ชื่อ_WiFi_ของคุณ"
#define WIFI_PASS "รหัสผ่าน_WiFi_ของคุณ"
#define BLYNK_TEMPLATE_ID "TMPL..."     // จาก Blynk App
#define BLYNK_TEMPLATE_NAME "..."       // ชื่อโปรเจกต์
#define BLYNK_AUTH_TOKEN "..."          // Token จาก Blynk
```

### **4. เชื่อมต่อเซนเซอร์:**
```
TDS Sensor     → Pin A0
pH Sensor      → Pin A1
Temp Sensor    → Pin A2
Turbidity      → Pin A3
```

### **5. อัปโหลดโค้ด:**
- เลือก Board: ESP32 Dev Module
- เลือก Port: COM port ของ Arduino
- กด Upload

---

## 📱 **ตั้งค่า Blynk App:**

### **สร้าง Datastream:**
1. **TDS** - Virtual Pin V0 (0-1000)
2. **pH** - Virtual Pin V1 (0-14)
3. **Temperature** - Virtual Pin V2 (0-50°C)
4. **Turbidity** - Virtual Pin V3 (0-1000)

### **เพิ่ม Widget:**
- Gauge สำหรับแต่ละเซนเซอร์
- Graph สำหรับดูประวัติ
- LED สำหรับสถานะ

---

## ✅ **ตรวจสอบการทำงาน:**

### **1. Serial Monitor:**
```
WiFi Connected!
Blynk Connected!
TDS: 245 ppm
pH: 7.2
Temp: 26.5°C
Sending to Firebase...
```

### **2. Blynk App:**
- เซนเซอร์ขึ้นข้อมูลตามเวลาจริง
- LED เปลี่ยนสีตามสถานะ

### **3. Web Dashboard:**
- เปิด: https://aquagreen-ai-dashboard-q7tq0p1hj-worrapat-bots-projects.vercel.app
- ดูกราฟข้อมูลอัปเดตตามเวลาจริง

---

## 🚨 **แก้ปัญหาเบื้องต้น:**

### **WiFi ไม่เชื่อมต่อ:**
```cpp
// ลองเปลี่ยน WiFi หรือ Hotspot มือถือ
// ตรวจสอบ SSID และ Password
```

### **Blynk ไม่เชื่อมต่อ:**
```cpp
// ตรวจสอบ Auth Token
// ดู Serial Monitor หาข้อผิดพลาด
```

### **เซนเซอร์ค่าผิดปกติ:**
```cpp
// ตรวจสอบการเชื่อมต่อสาย
// เช็ค Pin ในโค้ด
```

---

## 📞 **ติดต่อ Support:**
หากมีปัญหา สามารถดูคู่มือเพิ่มเติมใน:
- `ARDUINO_API.md` - รายละเอียด API
- `HOW_TO_RUN.md` - คู่มือครบครัน

**หรือส่งข้อความมาถามได้เลย!** 💬
