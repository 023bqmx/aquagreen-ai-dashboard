import { useState, useEffect } from 'react';

const FirebaseTestComponent = () => {
  const [firebaseData, setFirebaseData] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFirebaseData = async () => {
      try {
        console.log("🔥 Testing Firebase connection...");
        setLoading(true);
        setError('');

        const url = 'https://firestore.googleapis.com/v1/projects/arduinosensoralerts/databases/(default)/documents/sensor_readings?orderBy=timestamp%20desc&pageSize=1&key=AIzaSyB88B5BQM3OJPXZFG7L8sWQN4K2VxFyMaE';
        
        console.log("📡 Fetching:", url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        console.log("📊 Response status:", response.status);
        console.log("📊 Response ok:", response.ok);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("📊 Full response:", data);

        if (data.documents && data.documents.length > 0) {
          const latestDoc = data.documents[0];
          const fields = latestDoc.fields;
          
          const sensorData = {
            ph: fields.ph?.doubleValue || 0,
            tds: fields.tds?.doubleValue || 0,
            turbidity: fields.turbidity?.doubleValue || 0,
            temperature: fields.temperature?.doubleValue || 0,
            timestamp: fields.timestamp?.timestampValue || 'N/A',
            device_id: fields.device_id?.stringValue || 'N/A'
          };

          setFirebaseData(sensorData);
          console.log("✅ Data parsed successfully:", sensorData);
        } else {
          throw new Error("No documents found in response");
        }

      } catch (err: any) {
        console.error("❌ Firebase fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // เรียกทันที
    fetchFirebaseData();

    // เรียกทุก 15 วินาที
    const interval = setInterval(fetchFirebaseData, 15000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-4 border rounded-lg bg-blue-50">
        <h3 className="font-bold text-blue-800">🔄 กำลังเชื่อมต่อ Firebase...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border rounded-lg bg-red-50">
        <h3 className="font-bold text-red-800">❌ เชื่อมต่อ Firebase ไม่ได้</h3>
        <p className="text-red-600 text-sm mt-2">{error}</p>
      </div>
    );
  }

  if (!firebaseData) {
    return (
      <div className="p-4 border rounded-lg bg-yellow-50">
        <h3 className="font-bold text-yellow-800">⚠️ ไม่มีข้อมูลใน Firebase</h3>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-green-50">
      <h3 className="font-bold text-green-800 mb-3">✅ เชื่อมต่อ Firebase สำเร็จ!</h3>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="p-2 bg-white rounded">
          <strong>🧪 pH:</strong> {firebaseData.ph}
        </div>
        <div className="p-2 bg-white rounded">
          <strong>💧 TDS:</strong> {firebaseData.tds} ppm
        </div>
        <div className="p-2 bg-white rounded">
          <strong>🌫️ Turbidity:</strong> {firebaseData.turbidity} NTU
        </div>
        <div className="p-2 bg-white rounded">
          <strong>🌡️ Temp:</strong> {firebaseData.temperature}°C
        </div>
      </div>
      <div className="mt-3 text-xs text-gray-600">
        <div><strong>Device:</strong> {firebaseData.device_id}</div>
        <div><strong>Updated:</strong> {new Date().toLocaleTimeString('th-TH')}</div>
      </div>
    </div>
  );
};

export default FirebaseTestComponent;
