// ไฟล์สำหรับส่งข้อมูลทดสอบเข้า Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "arduinosensoralerts.firebaseapp.com",
    projectId: "arduinosensoralerts",
    storageBucket: "arduinosensoralerts.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ฟังก์ชันส่งข้อมูลทดสอบ
async function sendTestData() {
    const testData = {
        ph_value: 8.5, // ค่าผิดปกติ (>8.0)
        tds_value: 600, // ค่าผิดปกติ (>500)
        turbidity_value: 15, // ปกติ
        temperature_value: 24, // ปกติ
        timestamp: new Date(),
        location: "Test_Tank"
    };

    try {
        const docRef = await addDoc(collection(db, 'sensor_readings'), testData);
        console.log("✅ ส่งข้อมูลสำเร็จ! Document ID:", docRef.id);
        console.log("📱 ควรได้รับแจ้งเตือนใน Line แล้ว");
    } catch (error) {
        console.error("❌ ส่งข้อมูลล้มเหลว:", error);
    }
}

// เรียกใช้ฟังก์ชัน
sendTestData();
