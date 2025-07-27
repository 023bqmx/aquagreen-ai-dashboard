import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const DailyReportChart = () => {
  // Simulated daily data
  const dailyData = [
    { day: 'จ', readings: 421, status: 'good' },
    { day: 'อ', readings: 387, status: 'good' },
    { day: 'พ', readings: 564, status: 'warning' },
    { day: 'พฤ', readings: 305, status: 'good' },
    { day: 'ศ', readings: 612, status: 'error' },
    { day: 'ส', readings: 187, status: 'good' },
    { day: 'อา', readings: 236, status: 'good' },
  ];

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