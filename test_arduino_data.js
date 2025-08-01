// สคริปต์ทดสอบข้อมูล Arduino โดยจำลองการส่งข้อมูลเหมือน Arduino
import https from 'https';

// Firebase Web API Key - ใช้ของคุณจาก Firebase Config
const FIREBASE_WEB_API_KEY = 'AIzaSyB88B5BQM3OJPXZGLFYBZopAOYhOaBQdio'; // 👈 Web API Key ของคุณ
const PROJECT_ID = 'arduinosensoralerts'; // 👈 Project ID ของคุณ

function sendArduinoTestData() {
    console.log('🧪 จำลองการส่งข้อมูลจาก Arduino UNO R4 WiFi...');
    
    // สร้างข้อมูลจำลองเหมือน Arduino - ข้อมูลปกติ
    const testData = {
        ph: 7.2 + (Math.random() - 0.5) * 1,           // pH 6.7-7.7 (ปกติ)
        tds: 150 + Math.random() * 300,                // TDS 150-450 ppm (ปกติ)
        turbidity: 5 + Math.random() * 15,             // ความขุ่น 5-20 NTU (ปกติ)
        temperature: 25 + Math.random() * 10,          // Temperature 25-35°C (ปกติ)
        timestamp: new Date().toISOString(),
        location: "Blynk_Device",
        device_id: "BLYNK_001"
    };

    // สร้าง Firestore document format (เหมือนใน Arduino)
    const firestoreDoc = {
        fields: {
            ph: { doubleValue: Math.round(testData.ph * 100) / 100 },
            tds: { doubleValue: Math.round(testData.tds * 10) / 10 },
            turbidity: { doubleValue: Math.round(testData.turbidity * 10) / 10 },
            temperature: { doubleValue: Math.round(testData.temperature * 10) / 10 },
            timestamp: { timestampValue: testData.timestamp },
            location: { stringValue: testData.location },
            device_id: { stringValue: testData.device_id }
        }
    };

    const postData = JSON.stringify(firestoreDoc);
    
    const options = {
        hostname: 'firestore.googleapis.com',
        port: 443,
        path: `/v1/projects/${PROJECT_ID}/databases/(default)/documents/sensor_readings?key=${FIREBASE_WEB_API_KEY}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    console.log('📊 ข้อมูลที่จะส่ง:');
    console.log(`🧪 pH: ${testData.ph.toFixed(2)}`);
    console.log(`💧 TDS: ${testData.tds.toFixed(1)} ppm`);
    console.log(`🌫️ Turbidity: ${testData.turbidity.toFixed(1)} %`);
    console.log(`🌡️ Temperature: ${testData.temperature.toFixed(1)} °C`);
    console.log(`📍 Location: ${testData.location}`);
    console.log(`🆔 Device ID: ${testData.device_id}`);

    const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            if (res.statusCode === 200 || res.statusCode === 201) {
                console.log('\n✅ ส่งข้อมูลไป Firebase สำเร็จ!');
                console.log('📊 Status Code:', res.statusCode);
                console.log('📱 ตรวจสอบ Dashboard ที่: http://localhost:8081');
                console.log('📲 ดู Firebase Console เพื่อยืนยันข้อมูล');
                
                // แสดง response document ID
                try {
                    const response = JSON.parse(data);
                    if (response.name) {
                        const docId = response.name.split('/').pop();
                        console.log('📄 Document ID:', docId);
                    }
                } catch (e) {
                    console.log('📄 Response received successfully');
                }
                
            } else {
                console.log('\n❌ ส่งข้อมูลไม่สำเร็จ!');
                console.log('📊 Status Code:', res.statusCode);
                console.log('📄 Response:', data);
                
                if (res.statusCode === 401) {
                    console.log('\n🔍 ปัญหา Authentication:');
                    console.log('- ตรวจสอบ Firebase Web API Key');
                    console.log('- ใส่ Web API Key ที่ถูกต้องในโค้ด');
                } else if (res.statusCode === 403) {
                    console.log('\n🔍 ปัญหา Permission:');
                    console.log('- ตรวจสอบ Firestore Rules');
                    console.log('- ตรวจสอบ Project ID');
                }
            }
        });
    });

    req.on('error', (error) => {
        console.log('❌ การเชื่อมต่อล้มเหลว!');
        console.error('Network Error:', error.message);
    });

    req.write(postData);
    req.end();
}

// ทดสอบส่งข้อมูล
console.log('🚀 พร้อมทดสอบการส่งข้อมูลไป Firebase!');
console.log('📋 Project ID:', PROJECT_ID);
console.log('🔑 API Key:', FIREBASE_WEB_API_KEY.substring(0, 20) + '...');
sendArduinoTestData();
