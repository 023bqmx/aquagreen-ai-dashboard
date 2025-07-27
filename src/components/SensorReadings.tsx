import { Card } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface SensorData {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'error';
  normalRange: [number, number];
  listenings: number;
}

const SensorReadings = () => {
  // Simulated sensor data
  const sensorData: SensorData[] = [
    {
      id: "ph",
      name: "ค่า pH",
      value: 7.2,
      unit: "",
      status: 'normal',
      normalRange: [6.5, 8.5],
      listenings: 245
    },
    {
      id: "tds", 
      name: "ค่า TDS",
      value: 850,
      unit: "ppm",
      status: 'warning',
      normalRange: [500, 1000],
      listenings: 189
    },
    {
      id: "turbidity",
      name: "ความขุ่น",
      value: 12,
      unit: "NTU",
      status: 'error',
      normalRange: [0, 10],
      listenings: 156
    },
    {
      id: "temperature",
      name: "อุณหภูมิ",
      value: 28,
      unit: "°C",
      status: 'normal',
      normalRange: [20, 35],
      listenings: 98
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'hsl(var(--success))';
      case 'warning': return 'hsl(var(--warning))';
      case 'error': return 'hsl(var(--error))';
      default: return 'hsl(var(--muted))';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getProgressPercentage = (value: number, range: [number, number]) => {
    const [min, max] = range;
    const percentage = ((value - min) / (max - min)) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  };

  return (
    <Card className="p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">ค่าเซนเซอร์ปัจจุบัน</h3>
        <button className="text-error hover:text-error/80 text-sm font-medium">
          ดูทั้งหมด →
        </button>
      </div>
      
      <div className="space-y-4">
        {sensorData.map((sensor, index) => (
          <div key={sensor.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: getStatusColor(sensor.status) }}
                >
                  {index + 1}
                </div>
                <span className="text-sm font-medium text-foreground">
                  {sensor.name}
                </span>
                <div style={{ color: getStatusColor(sensor.status) }}>
                  {getStatusIcon(sensor.status)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-foreground">
                  {sensor.value} {sensor.unit}
                </div>
                <div className="text-xs text-muted-foreground">
                  {sensor.listenings} readings
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${getProgressPercentage(sensor.value, sensor.normalRange)}%`,
                  backgroundColor: getStatusColor(sensor.status)
                }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{sensor.normalRange[0]} {sensor.unit}</span>
              <span>{sensor.normalRange[1]} {sensor.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SensorReadings;