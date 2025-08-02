// functions/index.js
const {onDocumentCreated} = require('firebase-functions/v2/firestore');
const {onSchedule} = require('firebase-functions/v2/scheduler');
const {initializeApp} = require('firebase-admin/app');
const {getFirestore} = require('firebase-admin/firestore');
const axios = require('axios');

initializeApp();
const db = getFirestore();

// *** แทนที่ด้วย Channel Access Token ของคุณจาก Line Messaging API ***
const LINE_CHANNEL_ACCESS_TOKEN = 'I1U9ooH9bbG6vg1Q5dKbZ+36Ytg/zpmlYBwSa7WxGST1Njcmw6v9IBn+iSBzipIBc6cD/3mSptI5TY8atYMW4wqfSBp57gCc70u4tetEkHK5MV4zHnddazJKgYOK27MTgdAmj+lEH/3B2ikjWKxuPAdB04t89/1O/w1cDnyilFU='; // ⚠️ ต้องอัปเดตจาก Line Developers Console

// *** ใส่ User ID ของผู้ที่จะรับการแจ้งเตือน ***
const NOTIFICATION_USER_ID = 'Ufe4ea81fc5c77cd84c1f7a8b61fd51ae'; // ต้องเป็น friend ของ bot

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

// Line Notification System - เรียกใช้งานผ่าน HTTP Function
exports.sendLineNotification = require('firebase-functions').https.onRequest(async (req, res) => {
    try {
        console.log('Line notification function triggered');
        
        // ดึงข้อมูล sensor ล่าสุดจาก Firestore
        const snapshot = await db.collection('sensor_readings')
            .orderBy('timestamp', 'desc')
            .limit(1)
            .get();

        if (snapshot.empty) {
            console.log('No sensor data found');
            return res.status(404).json({
                success: false,
                message: 'No sensor data found'
            });
        }

        const doc = snapshot.docs[0];
        const data = doc.data();
        const docId = doc.id;
        
        console.log('📊 Latest sensor data:', JSON.stringify(data, null, 2));

        // สร้างข้อความแจ้งเตือน
        let message = `🌊 รายงานคุณภาพน้ำ Aquagreen AI\n`;
        message += `📅 ${new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })}\n`;
        message += `🆔 Document ID: ${docId}\n\n`;
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


        // ส่วนสรุปการแจ้งเตือน
        if (!hasAlert) {
            message += '\n🎉 ค่าคุณภาพน้ำทั้งหมดอยู่ในเกณฑ์ปกติ!\n';
            message += '✅ ระบบตรวจสอบจาก Firebase\n';
        } else {
            message += '\n🚨 มีค่าที่ต้องตรวจสอบ โปรดดำเนินการแก้ไขทันที!\n';
            message += '⚡ แจ้งเตือนจาก Firebase\n';
        }
        
        // เพิ่มข้อมูลตำแหน่งและอุปกรณ์
        if (data.location || data.device_id) {
            message += '\n📍 ข้อมูลอุปกรณ์:\n';
            if (data.location) message += `🏠 ตำแหน่ง: ${data.location}\n`;
            if (data.device_id) message += `🔧 อุปกรณ์: ${data.device_id}\n`;
        }

        // Log ข้อความที่จะส่ง
        console.log('📱 Line message content:', message);
        
        // ส่งข้อความไป Line
        const startTime = Date.now();
        
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
                },
                timeout: 10000 // 10 วินาที timeout
            }
        );
        
        const responseTime = Date.now() - startTime;
        console.log(`✅ Line message sent successfully! Response status: ${response.status}, Time: ${responseTime}ms`);
        
        res.json({
            success: true,
            message: 'Line notification sent successfully',
            status: response.status,
            responseTime: responseTime + 'ms',
            data: data
        });
        
    } catch (error) {
        console.error('❌ Error sending Line message:', error.message);
        
        res.status(500).json({
            success: false,
            message: 'Failed to send Line notification',
            error: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
    }
});


// ✅ เปิดใช้งานการแจ้งเตือนอัตโนมัติแล้ว! 
// ระบบจะแจ้งเตือนทุกนาที เมื่อ Arduino เริ่มส่งข้อมูล

exports.scheduledLineNotification = onSchedule('* * * * *', async (event) => {
    try {
        console.log('⏰ Scheduled Line notification triggered (every minute)');
        
        // ดึงข้อมูล sensor ล่าสุดจาก Firestore
        const scheduledSnapshot = await db.collection('sensor_readings')
            .orderBy('timestamp', 'desc')
            .limit(1)
            .get();

        if (scheduledSnapshot.empty) {
            console.log('📭 No sensor data found - Arduino ยังไม่ได้ส่งข้อมูล');
            return;
        }

        const scheduledDoc = scheduledSnapshot.docs[0];
        const scheduledData = scheduledDoc.data();
        const scheduledDocId = scheduledDoc.id;
        
        // ตรวจสอบว่าข้อมูลใหม่หรือไม่ (ภายใน 2 นาที)
        const timestamp = scheduledData.timestamp;
        let dataTime;
        
        if (timestamp && timestamp.toDate) {
            dataTime = timestamp.toDate();
        } else if (timestamp && typeof timestamp === 'string') {
            dataTime = new Date(timestamp);
        } else {
            dataTime = new Date();
        }
        
        const now = new Date();
        const timeDiff = (now.getTime() - dataTime.getTime()) / (1000 * 60); // ในหน่วยนาที
        
        console.log(`📊 Latest data timestamp: ${dataTime.toLocaleString('th-TH')}`);
        console.log(`⏱️ Time difference: ${timeDiff.toFixed(1)} minutes ago`);
        
        // ถ้าข้อมูลเก่าเกิน 5 นาที แสดงว่า Arduino หยุดส่งข้อมูล
        if (timeDiff > 5) {
            console.log('⚠️ Arduino data is too old, skipping notification');
            return;
        }
        
        console.log('📊 Fresh Arduino data detected, sending notification...');
        console.log('📊 Latest sensor data:', JSON.stringify(scheduledData, null, 2));

        // สร้างข้อความแจ้งเตือนทุกนาที
        let message = `🌊 รายงานคุณภาพน้ำ Aquagreen AI (ทุกนาที)\n`;
        message += `📅 ${new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })}\n`;
        message += `🆔 Document ID: ${scheduledDocId}\n\n`;
        let hasAlert = false;

        // รองรับทั้ง field name แบบเก่าและใหม่
        const ph = scheduledData.ph_value || scheduledData.ph;
        const tds = scheduledData.tds_value || scheduledData.tds;
        const turbidity = scheduledData.turbidity_value || scheduledData.turbidity;
        const temperature = scheduledData.temperature_value || scheduledData.temperature;

        // ตรวจสอบค่าต่างๆ (เหมือนกับ function ปกติ)
        if (ph === undefined || ph === null) {
            message += `❓ pH: ไม่พบข้อมูล\n`;
            hasAlert = true;
        } else if (ph < 6.0 || ph > 8.0) {
            message += `⚠️ pH: ${ph.toFixed(2)} (ผิดปกติ! ควรอยู่ระหว่าง 6.0-8.0)\n`;
            hasAlert = true;
        } else {
            message += `✅ pH: ${ph.toFixed(2)} (ปกติ)\n`;
        }

        if (tds === undefined || tds === null) {
            message += `❓ TDS: ไม่พบข้อมูล\n`;
            hasAlert = true;
        } else if (tds > 400) {
            message += `⚠️ TDS: ${tds.toFixed(1)} ppm (สูงเกินไป! ควรต่ำกว่า 400 ppm)\n`;
            hasAlert = true;
        } else {
            message += `✅ TDS: ${tds.toFixed(1)} ppm (ปกติ)\n`;
        }

        if (turbidity === undefined || turbidity === null) {
            message += `❓ ความขุ่น: ไม่พบข้อมูล\n`;
            hasAlert = true;
        } else if (turbidity > 50) {
            message += `⚠️ ความขุ่น: ${turbidity.toFixed(1)} NTU (สูงเกินไป! ควรต่ำกว่า 40 NTU)\n`;
            hasAlert = true;
        } else {
            message += `✅ ความขุ่น: ${turbidity.toFixed(1)} NTU (ปกติ)\n`;
        }

        if (temperature === undefined || temperature === null) {
            message += `❓ อุณหภูมิ: ไม่พบข้อมูล\n`;
            hasAlert = true;
        } else if (temperature < 20 || temperature > 35) {
            message += `⚠️ อุณหภูมิ: ${temperature.toFixed(1)}°C (ผิดปกติ! ควรอยู่ระหว่าง 20-35°C)\n`;
            hasAlert = true;
        } else {
            message += `✅ อุณหภูมิ: ${temperature.toFixed(1)}°C (ปกติ)\n`;
        }

        // สรุปการแจ้งเตือนทุกนาที
        if (!hasAlert) {
            message += '\n🎉 รายงานทุกนาที: ค่าคุณภาพน้ำทั้งหมดอยู่ในเกณฑ์ปกติ!\n';
            message += '✅ ระบบตรวจสอบอัตโนมัติจาก Firebase\n';
        } else {
            message += '\n🚨 รายงานทุกนาที: มีค่าที่ต้องตรวจสอบ!\n';
            message += '⚡ แจ้งเตือนอัตโนมัติจาก Firebase\n';
        }
        
        // เพิ่มข้อมูลตำแหน่งและอุปกรณ์
        if (scheduledData.location || scheduledData.device_id) {
            message += '\n📍 ข้อมูลอุปกรณ์:\n';
            if (scheduledData.location) message += `🏠 ตำแหน่ง: ${scheduledData.location}\n`;
            if (scheduledData.device_id) message += `🔧 อุปกรณ์: ${scheduledData.device_id}\n`;
        }

        console.log('📱 Scheduled Line message content (every minute):', message);
        
        // ส่งข้อความไป Line
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
                },
                timeout: 10000
            }
        );
        
        console.log(`✅ Scheduled Line message sent successfully (every minute)! Response status: ${response.status}`);
        
    } catch (error) {
        console.error('❌ Error sending scheduled Line message:', error.message);
    }
});
