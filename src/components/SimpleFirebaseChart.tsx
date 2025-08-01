import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";

const SimpleFirebaseChart = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://firestore.googleapis.com/v1/projects/arduinosensoralerts/databases/(default)/documents/sensor_readings?orderBy=timestamp%20desc&pageSize=1&key=AIzaSyB88B5BQM3OJPXZFG7L8sWQN4K2VxFyMaE'
        );
        
        const result = await response.json();
        
        if (result.documents && result.documents.length > 0) {
          const fields = result.documents[0].fields;
          setData({
            ph: fields.ph?.doubleValue || 0,
            tds: fields.tds?.doubleValue || 0,
            turbidity: fields.turbidity?.doubleValue || 0,
            temperature: fields.temperature?.doubleValue || 0
          });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">ข้อมูลเซนเซอร์ (Live)</h3>
        <div className="text-center py-8">🔄 กำลังโหลด...</div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">ข้อมูลเซนเซอร์ (Live from Firebase)</h3>
      {data ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-100 p-4 rounded">
            <div className="text-2xl font-bold text-blue-800">{data.ph.toFixed(2)}</div>
            <div className="text-sm text-blue-600">pH</div>
          </div>
          <div className="bg-green-100 p-4 rounded">
            <div className="text-2xl font-bold text-green-800">{data.tds.toFixed(0)}</div>
            <div className="text-sm text-green-600">TDS (ppm)</div>
          </div>
          <div className="bg-red-100 p-4 rounded">
            <div className="text-2xl font-bold text-red-800">{data.turbidity.toFixed(1)}</div>
            <div className="text-sm text-red-600">ความขุ่น (NTU)</div>
          </div>
          <div className="bg-orange-100 p-4 rounded">
            <div className="text-2xl font-bold text-orange-800">{data.temperature.toFixed(1)}</div>
            <div className="text-sm text-orange-600">อุณหภูมิ (°C)</div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">❌ ไม่มีข้อมูล</div>
      )}
    </Card>
  );
};

export default SimpleFirebaseChart;
