// สคริปต์ทดสอบข้อมูล Arduino ที่มีค่าผิดปกติ
import https from 'https';

const FIREBASE_WEB_API_KEY = 'AIzaSyB88B5BQM3OJPXZGLFYBZopAOYhOaBQdio';
const PROJECT_ID = 'arduinosensoralerts';

function sendAbnormalTestData() {
    console.log('🚨 ทดสอบข้อมูลผิดปกติจาก Arduino...');
    
    // สร้างข้อมูลที่ผิดปกติ
    const testData = {
        ph: 5.2,                                       // pH ต่ำเกินไป (ควรอยู่ 6.0-8.0)
        tds: 450,                                      // TDS สูงเกินไป (ควรต่ำกว่า 400)
        turbidity: 45,                                 // ความขุ่นสูงเกินไป (ควรต่ำกว่า 40)
        temperature: 38,                               // อุณหภูมิสูงเกินไป (ควรอยู่ 20-35°C)
        timestamp: new Date().toISOString(),
        location: "Blynk_Device",
        device_id: "BLYNK_001"
    };

    // สร้าง Firestore document format
    const firestoreDoc = {
        fields: {
            ph: { doubleValue: testData.ph },
            tds: { doubleValue: testData.tds },
            turbidity: { doubleValue: testData.turbidity },
            temperature: { doubleValue: testData.temperature },
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

    console.log('🚨 ข้อมูลผิดปกติที่จะส่ง:');
    console.log(`🧪 pH: ${testData.ph} (ต่ำเกินไป!)`);
    console.log(`💧 TDS: ${testData.tds} ppm (สูงเกินไป!)`);
    console.log(`🌫️ Turbidity: ${testData.turbidity} % (สูงเกินไป!)`);
    console.log(`🌡️ Temperature: ${testData.temperature} °C (สูงเกินไป!)`);
    console.log(`📍 Location: ${testData.location}`);
    console.log(`🆔 Device ID: ${testData.device_id}`);

    const req = https.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
            responseData += chunk;
        });
        
        res.on('end', () => {
            if (res.statusCode === 200) {
                console.log('\n✅ ส่งข้อมูลผิดปกติไป Firebase สำเร็จ!');
                console.log('📊 Status Code:', res.statusCode);
                console.log('📱 ตรวจสอบ Dashboard ที่: http://localhost:8080');
                console.log('📲 ดู Firebase Console เพื่อยืนยันข้อมูล');
                console.log('⚠️ ควรได้รับการแจ้งเตือน LINE ภายใน 1-2 นาที');
                
                const responseJson = JSON.parse(responseData);
                if (responseJson.name) {
                    const docId = responseJson.name.split('/').pop();
                    console.log('📄 Document ID:', docId);
                }
            } else {
                console.error('❌ Error:', res.statusCode);
                console.error('Response:', responseData);
            }
        });
    });

    req.on('error', (error) => {
        console.error('❌ Request error:', error.message);
    });

    req.write(postData);
    req.end();
}

// เริ่มการทดสอบ
console.log('🚀 พร้อมทดสอบการส่งข้อมูลผิดปกติไป Firebase!');
console.log('📋 Project ID:', PROJECT_ID);
console.log('🔑 API Key:', FIREBASE_WEB_API_KEY.substring(0, 20) + '...');
sendAbnormalTestData();
