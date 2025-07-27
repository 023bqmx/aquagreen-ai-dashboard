import { Card } from "@/components/ui/card";

interface SystemStatusData {
  label: string;
  value: number;
  color: string;
}

const SystemStatusChart = () => {
  const statusData: SystemStatusData[] = [
    { label: "ปกติ", value: 65, color: "var(--success)" },
    { label: "ต้องระวัง", value: 25, color: "var(--warning)" },
    { label: "ผิดปกติ", value: 10, color: "var(--error)" },
  ];

  const total = statusData.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const createPath = (percentage: number, startAngle: number) => {
    const angle = (percentage / 100) * 360;
    const endAngle = startAngle + angle;
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const largeArcFlag = angle <= 180 ? 0 : 1;
    
    const x1 = 50 + 40 * Math.cos(startAngleRad);
    const y1 = 50 + 40 * Math.sin(startAngleRad);
    const x2 = 50 + 40 * Math.cos(endAngleRad);
    const y2 = 50 + 40 * Math.sin(endAngleRad);
    
    return `M 50,50 L ${x1},${y1} A 40,40 0 ${largeArcFlag},1 ${x2},${y2} z`;
  };

  return (
    <Card className="p-6 shadow-[var(--shadow-card)]">
      <h3 className="text-lg font-semibold mb-4 text-foreground">
        สถานะการทำงานของระบบ
      </h3>
      
      <div className="flex items-center justify-center">
        <div className="relative">
          <svg width="200" height="200" viewBox="0 0 100 100" className="transform -rotate-90">
            {statusData.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const path = createPath(percentage, currentAngle);
              const angle = currentAngle;
              currentAngle += (percentage / 100) * 360;
              
              return (
                <path
                  key={index}
                  d={path}
                  fill={`hsl(${item.color})`}
                  className="transition-all duration-300 hover:opacity-80"
                />
              );
            })}
            
            {/* Center circle */}
            <circle
              cx="50"
              cy="50"
              r="20"
              fill="hsl(var(--background))"
              stroke="hsl(var(--border))"
              strokeWidth="2"
            />
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">65%</div>
              <div className="text-xs text-muted-foreground">ปกติ</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-6 space-y-2">
        {statusData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: `hsl(${item.color})` }}
              />
              <span className="text-sm text-foreground">{item.label}</span>
            </div>
            <span className="text-sm font-medium text-foreground">{item.value}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SystemStatusChart;