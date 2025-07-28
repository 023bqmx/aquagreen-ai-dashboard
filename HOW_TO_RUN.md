# 🌊 วิธีเปิดระบบ Aquagreen AI Dashboard

## 🚀 Quick Start

### 1. เปิด Command Prompt/PowerShell
```
กด Windows + R
พิมพ์: cmd หรือ powershell
กด Enter
```

### 2. ไปยังโฟลเดอร์โปรเจค
```bash
cd C:\Users\OS\Documents\GitHub\aquagreen-ai-dashboard
```

### 3. เริ่มระบบ
```bash
npm run dev
```

### 4. เปิดเว็บไซต์
```
Dashboard: http://localhost:8080
```

## 🔄 **สำหรับการใช้งานจริง (Production):**

### สร้าง Build
```bash
npm run build
npm run preview
```

## 📱 **ระบบจะแสดง:**
- Real-time sensor data charts
- pH, TDS, Turbidity, Temperature readings  
- Alert system สำหรับค่าผิดปกติ
- Live clock และ breadcrumb navigation

## 🔗 **Arduino Integration:**
- ดูคู่มือใน: `ARDUINO_API.md`
- API Key: `AIzaSyB88B5BQM3OJPXZGLFYBZopAOYhOaBQdio`
- Endpoint: Firebase Firestore REST API

## 🧪 **ทดสอบระบบ:**
```bash
node test_arduino_data.js
```

## ⚡ **ขั้นตอนการเปิดแบบย่อ:**
1. เปิด Terminal/CMD
2. `cd` ไปยังโฟลเดอร์โปรเจค
3. `npm run dev`
4. เปิด http://localhost:8080

## 🌐 **เข้าถึงออนไลน์:**
**Production URL:** https://aquagreen-ai-dashboard-q7tq0p1hj-worrapat-bots-projects.vercel.app

✅ **ใช้งานได้แล้ว:** เปิดในเบราว์เซอร์ใดก็ได้ทั่วโลก
✅ **Real-time:** ข้อมูลอัพเดตแบบเรียลไทม์
✅ **Arduino API:** พร้อมใช้งานผ่าน Firebase
✅ **Line Notifications:** ระบบแจ้งเตือนใช้งานได้

## 🔧 **หากมีปัญหา:**
- ลอง `npm install` ก่อน
- ตรวจสอบ Node.js ติดตั้งแล้ว
- ปิด process เก่า: `npm run dev` ใหม่
