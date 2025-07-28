// functions/index.js
const {onDocumentCreated} = require('firebase-functions/v2/firestore');
const {initializeApp} = require('firebase-admin/app');
const {getFirestore} = require('firebase-admin/firestore');
const axios = require('axios');

initializeApp();
const db = getFirestore();

// *** แทนที่ด้วย Channel Access Token ของคุณจาก Line Messaging API ***
const LINE_CHANNEL_ACCESS_TOKEN = 'NlqE6Z+IQZCUdMxf5mUSLkJ/1AcbV2uY50KrtnrN7wJ9UQgrOmAFMXVoRnyNiDeccUvbZesi5sN3qyOKWcEiPCPHRdmJdSJ6oN8A+OfIrBr0c23i4RajjytwTi1c5fULL2zQ2yPZEJNS1OEqDh9L+gdB04t89/1O/w1cDnyilFU=';

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

        let message = '\nสถานะค่าคุณภาพน้ำ:\n';
        let hasAlert = false;

        // ตรวจสอบค่า pH
        if (data.ph_value === undefined) {
            console.warn('pH value is undefined in data.');
            message += `❓ pH: ไม่พบข้อมูล\n`;
        } else if (data.ph_value < 6.0 || data.ph_value > 8.0) {
            message += `⚠️ pH: ${data.ph_value} (ผิดปกติ!)\n`;
            hasAlert = true;
        } else {
            message += `✅ pH: ${data.ph_value} (ปกติ)\n`;
        }

        // ตรวจสอบค่า TDS
        if (data.tds_value === undefined) {
            console.warn('TDS value is undefined in data.');
            message += `❓ TDS: ไม่พบข้อมูล\n`;
        } else if (data.tds_value > 500) { // สมมติว่าเกิน 500 ppm คือผิดปกติ
            message += `⚠️ TDS: ${data.tds_value} ppm (ผิดปกติ!)\n`;
            hasAlert = true;
        } else {
            message += `✅ TDS: ${data.tds_value} ppm (ปกติ)\n`;
        }

        // ตรวจสอบค่า Turbidity
        if (data.turbidity_value === undefined) {
            console.warn('Turbidity value is undefined in data.');
            message += `❓ ความขุ่น: ไม่พบข้อมูล\n`;
        } else if (data.turbidity_value > 50) { // สมมติว่าเกิน 50 NTU คือผิดปกติ
            message += `⚠️ ความขุ่น: ${data.turbidity_value} NTU (ผิดปกติ!)\n`;
            hasAlert = true;
        } else {
            message += `✅ ความขุ่น: ${data.turbidity_value} NTU (ปกติ)\n`;
        }

        // ตรวจสอบค่า Temperature
        if (data.temperature_value === undefined) {
            console.warn('Temperature value is undefined in data.');
            message += `❓ อุณหภูมิ: ไม่พบข้อมูล\n`;
        } else if (data.temperature_value < 20 || data.temperature_value > 30) { // สมมติว่าต่ำกว่า 20 หรือสูงกว่า 30 คือผิดปกติ
            message += `⚠️ อุณหภูมิ: ${data.temperature_value}°C (ผิดปกติ!)\n`;
            hasAlert = true;
        } else {
            message += `✅ อุณหภูมิ: ${data.temperature_value}°C (ปกติ)\n`;
        }


        if (!hasAlert) {
            message += '✨ ค่าคุณภาพน้ำทั้งหมดอยู่ในเกณฑ์ปกติ\n';
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