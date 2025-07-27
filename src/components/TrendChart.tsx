import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const TrendChart = () => {
  // Simulated historical data
  const data = [
    { time: '00:00', ph: 7.1, tds: 820, turbidity: 8, temp: 26 },
    { time: '04:00', ph: 7.0, tds: 830, turbidity: 9, temp: 25 },
    { time: '08:00', ph: 7.2, tds: 840, turbidity: 10, temp: 27 },
    { time: '12:00', ph: 7.3, tds: 860, turbidity: 11, temp: 29 },
    { time: '16:00', ph: 7.1, tds: 850, turbidity: 12, temp: 30 },
    { time: '20:00', ph: 7.2, tds: 845, turbidity: 10, temp: 28 },
    { time: '24:00', ph: 7.2, tds: 850, turbidity: 12, temp: 28 },
  ];

  return (
    <Card className="p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">แนวโน้มค่าเซนเซอร์</h3>
        <div className="text-sm text-error">
          วันนี้ — เวลาปัจจุบัน
        </div>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="ph" 
              stroke="hsl(var(--aqua-blue))" 
              strokeWidth={2}
              name="pH"
              dot={{ fill: 'hsl(var(--aqua-blue))', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="turbidity" 
              stroke="hsl(var(--error))" 
              strokeWidth={2}
              name="ความขุ่น (NTU)"
              dot={{ fill: 'hsl(var(--error))', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-aqua-blue"></div>
          <span className="text-muted-foreground">pH</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-error"></div>
          <span className="text-muted-foreground">ความขุ่น</span>
        </div>
      </div>
    </Card>
  );
};

export default TrendChart;