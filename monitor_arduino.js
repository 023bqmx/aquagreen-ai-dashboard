// สคริปต์ตรวจสอบการรับข้อมูลจาก Arduino จริง
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// อ่าน Service Account Key
const serviceAccountPath = './service-account-key.json';
let serviceAccount;

try {
    serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
} catch (error) {
    console.error('❌ ไม่พบไฟล์ service-account-key.json');
    console.log('📝 สร้างไฟล์ service-account-key.json จาก Firebase Console:');
    console.log('1. ไป Firebase Console > Project Settings > Service Accounts');
    console.log('2. คลิก "Generate new private key"');
    console.log('3. บันทึกไฟล์เป็น service-account-key.json');
    process.exit(1);
}

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://arduinosensoralerts.firebaseio.com'
    });
}

const db = admin.firestore();

async function monitorArduinoData() {
    console.log('🔍 เริ่มตรวจสอบข้อมูลจาก Arduino...');
    console.log('📡 รอข้อมูลจาก Arduino UNO R4 WiFi...\n');

    // ตรวจสอบข้อมูลล่าสุด
    const latestData = await db.collection('sensor_readings')
        .orderBy('timestamp', 'desc')
        .limit(1)
        .get();

    if (!latestData.empty) {
        const lastDoc = latestData.docs[0];
        const data = lastDoc.data();
        const timestamp = data.timestamp?.toDate?.() || new Date(data.timestamp);
        
        console.log('📊 ข้อมูลล่าสุด:');
        console.log(`📅 เวลา: ${timestamp.toLocaleString('th-TH')}`);
        console.log(`🧪 pH: ${data.ph || data.ph_value || 'N/A'}`);
        console.log(`💧 TDS: ${data.tds || data.tds_value || 'N/A'} ppm`);
        console.log(`🌫️ Turbidity: ${data.turbidity || data.turbidity_value || 'N/A'} NTU`);
        console.log(`🌡️ Temperature: ${data.temperature || data.temperature_value || 'N/A'} °C`);
        console.log(`📍 Location: ${data.location || 'N/A'}`);
        console.log(`🔧 Device: ${data.device_id || 'N/A'}\n`);
        
        // ตรวจสอบว่าข้อมูลมาจาก Arduino จริงหรือจาก test script
        const timeDiff = Date.now() - timestamp.getTime();
        const minutesAgo = Math.floor(timeDiff / (1000 * 60));
        
        if (minutesAgo < 2) {
            console.log('✅ ข้อมูลใหม่! (ส่งมาเมื่อ', minutesAgo, 'นาทีที่แล้ว)');
        } else {
            console.log('⚠️ ข้อมูลเก่า (ส่งมาเมื่อ', minutesAgo, 'นาทีที่แล้ว)');
            console.log('📡 ตรวจสอบการเชื่อมต่อ Arduino');
        }
    } else {
        console.log('❌ ไม่พบข้อมูลในฐานข้อมูล');
        console.log('📡 ตรวจสอบ Arduino และการเชื่อมต่อ WiFi');
    }

    // Monitor real-time changes
    console.log('\n🔄 เริ่มการตรวจสอบแบบ Real-time...');
    console.log('🛑 กด Ctrl+C เพื่อหยุด\n');

    const unsubscribe = db.collection('sensor_readings')
        .orderBy('timestamp', 'desc')
        .limit(1)
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const data = change.doc.data();
                    const timestamp = data.timestamp?.toDate?.() || new Date(data.timestamp);
                    
                    console.log('🆕 ข้อมูลใหม่จาก Arduino!');
                    console.log(`📅 ${timestamp.toLocaleString('th-TH')}`);
                    console.log(`🧪 pH: ${data.ph || data.ph_value}`);
                    console.log(`💧 TDS: ${data.tds || data.tds_value} ppm`);
                    console.log(`🌫️ Turbidity: ${data.turbidity || data.turbidity_value} NTU`);
                    console.log(`🌡️ Temperature: ${data.temperature || data.temperature_value} °C`);
                    console.log('─'.repeat(50));
                }
            });
        }, (error) => {
            console.error('❌ Error monitoring data:', error);
        });

    // Handle Ctrl+C
    process.on('SIGINT', () => {
        console.log('\n🛑 หยุดการตรวจสอบ...');
        unsubscribe();
        process.exit(0);
    });
}

// เริ่มการตรวจสอบ
monitorArduinoData().catch(console.error);
