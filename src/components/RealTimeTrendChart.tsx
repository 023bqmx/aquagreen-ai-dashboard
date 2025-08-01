import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const RealTimeTrendChart = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError('');
        console.log("📊 Fetching Firebase data...");
        
        const response = await fetch(
          'https://firestore.googleapis.com/v1/projects/arduinosensoralerts/databases/(default)/documents/sensor_readings?orderBy=timestamp%20desc&pageSize=5&key=AIzaSyB88B5BQM3OJPXZFG7L8sWQN4K2VxFyMaE'
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log("📊 Firebase response:", data);

        if (data.documents && data.documents.length > 0) {
          const processedData = data.documents
            .reverse()
            .map((doc: any, index: number) => {
              const fields = doc.fields;
              return {
                time: `${index + 1}`,
                ph: Number(fields.ph?.doubleValue || 7.0),
                turbidity: Number(fields.turbidity?.doubleValue || 0)
              };
            });

          setChartData(processedData);
          console.log("📊 Chart data:", processedData);
        } else {
          setChartData([]);
        }
      } catch (err: any) {
        console.error("❌ Error:", err);
        setError(err.message);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">แนวโน้มค่าเซนเซอร์ (Real-time)</h3>
        <div className="h-[300px] flex items-center justify-center">
          <div>🔄 กำลังโหลด...</div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">แนวโน้มค่าเซนเซอร์ (Real-time)</h3>
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-red-500">❌ Error: {error}</div>
        </div>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">แนวโน้มค่าเซนเซอร์ (Real-time)</h3>
        <div className="h-[300px] flex items-center justify-center">
          <div>📊 ไม่มีข้อมูล</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">แนวโน้มค่าเซนเซอร์ (Real-time)</h3>
        <div className="text-sm text-green-600">
          🔴 สด — Firebase Data
        </div>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="ph" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="pH"
            />
            <Line 
              type="monotone" 
              dataKey="turbidity" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="ความขุ่น"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-sm">pH</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-sm">ความขุ่น</span>
        </div>
        <div className="text-xs text-gray-500">
          📊 {chartData.length} รายการ
        </div>
      </div>
    </Card>
  );
};

export default RealTimeTrendChart;
