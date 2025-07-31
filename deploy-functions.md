# 🚀 วิธี Deploy Firebase Functions

## วิธีที่ 1: ใช้ GitHub Actions (แนะนำ)
1. Push code ไป GitHub Repository
2. GitHub Actions จะ deploy อัตโนมัติ
3. ไม่ต้อง login ในเครื่อง

## วิธีที่ 2: Deploy Manual
```bash
# 1. Login เข้า Firebase
firebase login

# 2. Deploy Functions
firebase deploy --only functions

# 3. ตรวจสอบสถานะ
firebase functions:log
```

## วิธีที่ 3: ใช้ Service Account
1. ดาวน์โหลด Service Account Key จาก Firebase Console
2. ตั้งค่า environment variable
3. Deploy แบบ CI/CD

## วิธีทดสอบว่า Functions ทำงาน:
1. ส่งข้อมูลจาก Arduino
2. ตรวจสอบ LINE ว่าได้รับการแจ้งเตือนหรือไม่
3. ดู Firebase Console > Functions > Logs
