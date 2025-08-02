import { Card } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";

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
  const [realSensorData, setRealSensorData] = useState<SensorData[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // Fetch data from Firebase
  const fetchSensorData = async () => {
    try {
      const response = await fetch(
        'https://firestore.googleapis.com/v1/projects/arduinosensoralerts/databases/(default)/documents/sensor_readings?orderBy=timestamp%20desc&pageSize=1&key=AIzaSyB88B5BQM3OJPXZFG7L8sWQN4K2VxFyMaE',
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.documents && data.documents.length > 0) {
          const doc = data.documents[0];
          const fields = doc.fields;
          
          const sensorReadings: SensorData[] = [
            {
              id: "ph",
              name: "ค่า pH",
              value: parseFloat(fields.ph?.doubleValue || fields.ph?.stringValue || '0'),
              unit: "",
              status: getStatus(parseFloat(fields.ph?.doubleValue || fields.ph?.stringValue || '0'), 'ph'),
              normalRange: [6.5, 8.5],
              listenings: 245
            },
            {
              id: "tds", 
              name: "ค่า TDS",
              value: parseFloat(fields.tds?.doubleValue || fields.tds?.stringValue || '0'),
              unit: "ppm",
              status: getStatus(parseFloat(fields.tds?.doubleValue || fields.tds?.stringValue || '0'), 'tds'),
              normalRange: [0, 300],
              listenings: 189
            },
            {
              id: "turbidity",
              name: "ความขุ่น",
              value: parseFloat(fields.turbidity?.doubleValue || fields.turbidity?.stringValue || '0'),
              unit: "NTU",
              status: getStatus(parseFloat(fields.turbidity?.doubleValue || fields.turbidity?.stringValue || '0'), 'turbidity'),
              normalRange: [0, 10],
              listenings: 156
            },
            {
              id: "temperature",
              name: "อุณหภูมิ",
              value: parseFloat(fields.temperature?.doubleValue || fields.temperature?.stringValue || '0'),
              unit: "°C",
              status: getStatus(parseFloat(fields.temperature?.doubleValue || fields.temperature?.stringValue || '0'), 'temperature'),
              normalRange: [20, 30],
              listenings: 98
            }
          ];
          
          setRealSensorData(sensorReadings);
          setLastUpdate(new Date().toLocaleTimeString('th-TH'));
        }
      }
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    }
  };

  const getStatus = (value: number, type: string): 'normal' | 'warning' | 'error' => {
    switch (type) {
      case 'ph':
        if (value >= 6.5 && value <= 8.5) return 'normal';
        if (value >= 6.0 && value <= 9.0) return 'warning';
        return 'error';
      case 'tds':
        if (value <= 300) return 'normal';
        if (value <= 500) return 'warning';
        return 'error';
      case 'turbidity':
        if (value <= 10) return 'normal';
        if (value <= 25) return 'warning';
        return 'error';
      case 'temperature':
        if (value >= 20 && value <= 30) return 'normal';
        if (value >= 15 && value <= 35) return 'warning';
        return 'error';
      default:
        return 'normal';
    }
  };

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 5000);
    return () => clearInterval(interval);
  }, []);

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
        {realSensorData.map((sensor, index) => (
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