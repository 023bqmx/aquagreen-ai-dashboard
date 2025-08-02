// functions/index.js
const {onDocumentCreated} = require('firebase-functions/v2/firestore');
const {initializeApp} = require('firebase-admin/app');
const {getFirestore} = require('firebase-admin/firestore');
const axios = require('axios');

initializeApp();
const db = getFirestore();

// *** แทนที่ด้วย Channel Access Token ของคุณจาก Line Messaging API ***
const LINE_CHANNEL_ACCESS_TOKEN = 'm+AtG/5cX+6Js/nVPg1j/6XgHM8FFpo91sXFAIUDK4FeT5oFLxgUPRHpryMcrCYxcUvbZesi5sN3qyOKWcEiPCPHRdmJdSJ6oN8A+OfIrBpCOxVslwFT3Ha7Px3HRpFzXtIHjWt8Lb+B0OXnMxyljAdB04t89/1O/w1cDnyilFU=';

// *** ใส่ User ID ของผู้ที่จะรับการแจ้งเตือน ***
const NOTIFICATION_USER_ID = 'U412269167a85d5416b4a25b63b1cd2ce'; // ต้องเป็น friend ของ bot

// Function สำหรับทดสอบ Line Token
exports.testLineToken = require('firebase-functions').https.onRequest(async (req, res) => {
    try {
        console.log('Testing Line Messaging API Token...');
        
        const response = await axios.post(
            'https://api.line.me/v2/bot/message/push',
            {
                to: NOTIFICATION_USER_ID,
                messages: [
                    {
                        type: 'text',
                        text: '🧪 Testing Line Messaging API Token from Firebase Functions\n📅 ' + new Date().toLocaleString('th-TH')
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
                }
            }
        );
        
        res.json({
            success: true,
            message: 'Token is valid!',
            status: response.status,
            data: response.data
        });
        
    } catch (error) {
        console.error('Token test failed:', error.message);
        
        res.status(500).json({
            success: false,
            message: 'Token test failed',
            error: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
    }
});

exports.sendLineNotification = onDocumentCreated(
    'sensor_readings/{docId}',
    async (event) => {
        const snap = event.data;
        if (!snap) {
            console.log('No data associated with the event');
            return;
        }
        
        const data = snap.data();
        console.log('Function triggered: New sensor data received:', data);

        let message = '🌊 รายงานคุณภาพน้ำ Aquagreen AI\n';
        message += `📅 ${new Date().toLocaleString('th-TH')}\n\n`;
        let hasAlert = false;

        // รองรับทั้ง field name แบบเก่าและใหม่
        const ph = data.ph_value || data.ph;
        const tds = data.tds_value || data.tds;
        const turbidity = data.turbidity_value || data.turbidity;
        const temperature = data.temperature_value || data.temperature;

        // ตรวจสอบค่า pH
        if (ph === undefined || ph === null) {
            console.warn('pH value is undefined in data.');
            message += `❓ pH: ไม่พบข้อมูล\n`;
            hasAlert = true;
        } else if (ph < 6.0 || ph > 8.0) {
            message += `⚠️ pH: ${ph.toFixed(2)} (ผิดปกติ! ควรอยู่ระหว่าง 6.0-8.0)\n`;
            hasAlert = true;
        } else {
            message += `✅ pH: ${ph.toFixed(2)} (ปกติ)\n`;
        }

        // ตรวจสอบค่า TDS
        if (tds === undefined || tds === null) {
            console.warn('TDS value is undefined in data.');
            message += `❓ TDS: ไม่พบข้อมูล\n`;
            hasAlert = true;
        } else if (tds > 400) { // เกิน 400 ppm คือผิดปกติ
            message += `⚠️ TDS: ${tds.toFixed(1)} ppm (สูงเกินไป! ควรต่ำกว่า 400 ppm)\n`;
            hasAlert = true;
        } else {
            message += `✅ TDS: ${tds.toFixed(1)} ppm (ปกติ)\n`;
        }

        // ตรวจสอบค่า Turbidity
        if (turbidity === undefined || turbidity === null) {
            console.warn('Turbidity value is undefined in data.');
            message += `❓ ความขุ่น: ไม่พบข้อมูล\n`;
            hasAlert = true;
        } else if (turbidity > 50) { // เกิน 40 NTU คือผิดปกติ
            message += `⚠️ ความขุ่น: ${turbidity.toFixed(1)} NTU (สูงเกินไป! ควรต่ำกว่า 40 NTU)\n`;
            hasAlert = true;
        } else {
            message += `✅ ความขุ่น: ${turbidity.toFixed(1)} NTU (ปกติ)\n`;
        }

        // ตรวจสอบค่า Temperature
        if (temperature === undefined || temperature === null) {
            console.warn('Temperature value is undefined in data.');
            message += `❓ อุณหภูมิ: ไม่พบข้อมูล\n`;
            hasAlert = true;
        } else if (temperature < 20 || temperature > 35) { // นอกช่วง 20-35°C คือผิดปกติ
            message += `⚠️ อุณหภูมิ: ${temperature.toFixed(1)}°C (ผิดปกติ! ควรอยู่ระหว่าง 20-35°C)\n`;
            hasAlert = true;
        } else {
            message += `✅ อุณหภูมิ: ${temperature.toFixed(1)}°C (ปกติ)\n`;
        }


        if (!hasAlert) {
            message += '\n🎉 ค่าคุณภาพน้ำทั้งหมดอยู่ในเกณฑ์ปกติ!\n';
        } else {
            message += '\n⚠️ มีค่าที่ต้องตรวจสอบ โปรดดำเนินการแก้ไข\n';
        }
        
        // เพิ่มข้อมูลตำแหน่งและอุปกรณ์
        if (data.location || data.device_id) {
            message += '\n📍 ข้อมูลอุปกรณ์:\n';
            if (data.location) message += `🏠 ตำแหน่ง: ${data.location}\n`;
            if (data.device_id) message += `🔧 อุปกรณ์: ${data.device_id}\n`;
        }

        console.log('Generated Line message content:', message); // Log ข้อความที่จะส่ง

        // ถ้าไม่มีการแจ้งเตือนและคุณไม่ต้องการส่งข้อความ "ปกติ" ไป Line, สามารถ return ตรงนี้ได้เลย
        // if (!hasAlert) {
        //     console.log('No alerts. Not sending notification.');
        //     return null;
        // }

        try {
            console.log('Attempting to send Line message...'); // Log ก่อนส่ง
            const response = await axios.post(
                'https://api.line.me/v2/bot/message/push',
                {
                    to: NOTIFICATION_USER_ID,
                    messages: [
                        {
                            type: 'text',
                            text: message
                        }
                    ]
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
                    }
                }
            );
            console.log('Line message sent successfully! Response status:', response.status); // Log เมื่อส่งสำเร็จ
            return null;
        } catch (error) {
            console.error('Error sending Line message:', error.message); // Log ข้อผิดพลาด
            if (error.response) {
                console.error('Line API Response Data:', error.response.data); // Log รายละเอียดจาก Line API
                console.error('Line API Response Status:', error.response.status);
            }
            return null;
        }
    });