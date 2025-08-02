import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useState, useEffect } from 'react';

interface SensorReading {
  ph: number;
  tds: number;
  turbidity: number;
  temperature: number;
  timestamp: string;
}

const DailyReportChart = () => {
  const [dailyData, setDailyData] = useState([
    { day: 'จ', readings: 0, status: 'good' },
    { day: 'อ', readings: 0, status: 'good' },
    { day: 'พ', readings: 0, status: 'good' },
    { day: 'พฤ', readings: 0, status: 'good' },
    { day: 'ศ', readings: 0, status: 'good' },
    { day: 'ส', readings: 0, status: 'good' },
    { day: 'อา', readings: 0, status: 'good' },
  ]);

  const fetchWeeklyData = async () => {
    try {
      // Fetch data from last 7 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 6); // Last 7 days

      const response = await fetch(
        `https://firestore.googleapis.com/v1/projects/arduinosensoralerts/databases/(default)/documents/sensor_readings?orderBy=timestamp%20desc&pageSize=100&key=AIzaSyB88B5BQM3OJPXZFG7L8sWQN4K2VxFyMaE`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.documents) {
          // Group data by day of week
          const dayGroups = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }; // Sunday=0, Monday=1, etc.
          const statusCounts = { 0: { normal: 0, warning: 0, error: 0 }, 1: { normal: 0, warning: 0, error: 0 }, 2: { normal: 0, warning: 0, error: 0 }, 3: { normal: 0, warning: 0, error: 0 }, 4: { normal: 0, warning: 0, error: 0 }, 5: { normal: 0, warning: 0, error: 0 }, 6: { normal: 0, warning: 0, error: 0 } };

          data.documents.forEach((doc: any) => {
            const fields = doc.fields;
            const timestamp = new Date(fields.timestamp?.timestampValue || doc.createTime);
            const dayOfWeek = timestamp.getDay();
            
            dayGroups[dayOfWeek as keyof typeof dayGroups]++;

            // Calculate status based on sensor values
            const ph = parseFloat(fields.ph?.doubleValue || '0');
            const tds = parseFloat(fields.tds?.doubleValue || '0');
            const turbidity = parseFloat(fields.turbidity?.doubleValue || '0');
            const temperature = parseFloat(fields.temperature?.doubleValue || '0');

            let errorCount = 0;
            let warningCount = 0;

            // Check pH
            if (ph < 6.0 || ph > 9.0) errorCount++;
            else if (ph < 6.5 || ph > 8.5) warningCount++;

            // Check TDS
            if (tds > 500) errorCount++;
            else if (tds > 300) warningCount++;

            // Check turbidity
            if (turbidity > 50) errorCount++;
            else if (turbidity > 10) warningCount++;

            // Check temperature
            if (temperature < 15 || temperature > 35) errorCount++;
            else if (temperature < 20 || temperature > 30) warningCount++;

            if (errorCount > 0) {
              statusCounts[dayOfWeek as keyof typeof statusCounts].error++;
            } else if (warningCount > 0) {
              statusCounts[dayOfWeek as keyof typeof statusCounts].warning++;
            } else {
              statusCounts[dayOfWeek as keyof typeof statusCounts].normal++;
            }
          });

          // Map to Thai day names (Monday first)
          const thaiDays = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
          const newDailyData = thaiDays.map((day, index) => {
            const dayIndex = index === 0 ? 0 : index; // Sunday=0, Monday=1, etc.
            const totalReadings = dayGroups[dayIndex as keyof typeof dayGroups];
            const dayStatus = statusCounts[dayIndex as keyof typeof statusCounts];
            
            let status = 'good';
            if (dayStatus.error > dayStatus.normal && dayStatus.error > dayStatus.warning) {
              status = 'error';
            } else if (dayStatus.warning > dayStatus.normal) {
              status = 'warning';
            }

            return {
              day,
              readings: totalReadings,
              status
            };
          });

          setDailyData(newDailyData);
        }
      }
    } catch (error) {
      console.error('Error fetching weekly data:', error);
    }
  };

  useEffect(() => {
    fetchWeeklyData();
    const interval = setInterval(fetchWeeklyData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getBarColor = (status: string) => {
    switch (status) {
      case 'good': return 'hsl(var(--aqua-blue))';
      case 'warning': return 'hsl(var(--warning))';
      case 'error': return 'hsl(var(--error))';
      default: return 'hsl(var(--muted))';
    }
  };

  return (
    <Card className="p-6 shadow-[var(--shadow-card)]">
      <h3 className="text-lg font-semibold mb-6 text-foreground">
        รายงานประจำวัน, การอ่านค่า
      </h3>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dailyData}>
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis hide />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }}
              formatter={(value) => [`${value} ครั้ง`, 'การอ่านค่า']}
            />
            <Bar 
              dataKey="readings" 
              radius={[4, 4, 0, 0]}
              fill="hsl(var(--aqua-blue))"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Values below bars */}
      <div className="grid grid-cols-7 gap-1 mt-2">
        {dailyData.map((item, index) => (
          <div key={index} className="text-center">
            <div className="text-xs font-medium text-foreground">{item.readings}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default DailyReportChart;