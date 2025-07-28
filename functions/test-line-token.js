const https = require('https');

// Channel Access Token จาก Line Messaging API
const LINE_CHANNEL_ACCESS_TOKEN = 'NlqE6Z+IQZCUdMxf5mUSLkJ/1AcbV2uY50KrtnrN7wJ9UQgrOmAFMXVoRnyNiDeccUvbZesi5sN3qyOKWcEiPCPHRdmJdSJ6oN8A+OfIrBr0c23i4RajjytwTi1c5fULL2zQ2yPZEJNS1OEqDh9L+gdB04t89/1O/w1cDnyilFU=';

// User ID ที่จะส่งข้อความหา (ต้องเป็น friend ของ bot)
const USER_ID = 'U412269167a85d5416b4a25b63b1cd2ce'; // ใช้ User ID ที่คุณใส่ไว้ใน index.js

function testLineMessaging() {
    return new Promise((resolve, reject) => {
        const message = {
            to: USER_ID,
            messages: [
                {
                    type: 'text',
                    text: '🧪 Testing Line Messaging API from Node.js\n📅 ' + new Date().toLocaleString('th-TH') + '\n✨ Channel Access Token ใช้งานได้!'
                }
            ]
        };

        const postData = JSON.stringify(message);

        const options = {
            hostname: 'api.line.me',
            port: 443,
            path: '/v2/bot/message/push',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
                'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
            }
        };

        console.log('🧪 Testing Line Messaging API...');
        console.log('🔗 Connecting to:', options.hostname);
        console.log('📱 Sending to User ID:', USER_ID);

        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log('✅ Channel Access Token is VALID!');
                    console.log('📱 Message sent successfully to Line!');
                    console.log('Response:', JSON.parse(data));
                    resolve(true);
                } else {
                    console.log('❌ Token test FAILED!');
                    console.log('Status Code:', res.statusCode);
                    console.log('Response:', data);
                    
                    if (res.statusCode === 401) {
                        console.log('\n🔍 Token Issues:');
                        console.log('- Channel Access Token อาจไม่ถูกต้องหรือหมดอายุ');
                        console.log('- Token อาจถูกยกเลิกแล้ว');
                        console.log('- ตรวจสอบใน Line Developers Console');
                    } else if (res.statusCode === 400) {
                        console.log('\n🔍 Request Issues:');
                        console.log('- User ID อาจผิด');
                        console.log('- User ยังไม่เป็น friend ของ bot');
                        console.log('- Message format ผิด');
                    }
                    resolve(false);
                }
            });
        });

        req.on('error', (error) => {
            console.log('❌ Connection FAILED!');
            console.error('Network Error:', error.message);
            console.log('\n🔍 Possible Issues:');
            console.log('- ปัญหาการเชื่อมต่ออินเทอร์เน็ต');
            console.log('- Firewall block การเชื่อมต่อ');
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

// เรียกใช้ function
testLineMessaging()
    .then(() => {
        console.log('\n✨ Test completed!');
        process.exit(0);
    })
    .catch((error) => {
        console.log('\n💥 Test failed with error:', error.message);
        process.exit(1);
    });
