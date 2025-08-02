import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, X, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AlertData {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
}

const AlertSystem = () => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);

  // ✅ ตรวจสอบข้อมูลจาก Firebase ทุก 10 วินาที
  useEffect(() => {
    const checkSensorValuesFromFirebase = async () => {
      try {
        console.log("🔄 กำลังดึงข้อมูลจาก Firebase...");
        
        // ดึงข้อมูลล่าสุดจาก Firebase
        const response = await fetch('https://firestore.googleapis.com/v1/projects/arduinosensoralerts/databases/(default)/documents/sensor_readings?orderBy=timestamp%20desc&pageSize=1&key=AIzaSyB88B5BQM3OJPXZFG7L8sWQN4K2VxFyMaE');
        
        console.log("📡 Response Status:", response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.documents || data.documents.length === 0) {
          console.log("📊 ไม่มีข้อมูลใน Firebase");
          return;
        }

        const latestDoc = data.documents[0];
        const fields = latestDoc.fields;
        
        // แปลงข้อมูลจาก Firestore format
        const sensorData = {
          ph: fields.ph?.doubleValue || 7.0,
          tds: fields.tds?.doubleValue || 0,
          turbidity: fields.turbidity?.doubleValue || 0,
          temperature: fields.temperature?.doubleValue || 25
        };

        console.log("📊 ข้อมูลล่าสุด:", sensorData);
        
        // ตรวจสอบการแจ้งเตือน (ใช้ข้อมูลจริงแทนข้อมูลจำลอง)
        const now = new Date();
        const newAlerts: AlertData[] = [];

        // ตรวจสอบค่า pH
        if (sensorData.ph < 6.5 || sensorData.ph > 8.5) {
          newAlerts.push({
            id: `ph-${Date.now()}`,
            type: 'error',
            title: 'ค่า pH ผิดปกติ',
            message: `ค่า pH ปัจจุบัน: ${sensorData.ph.toFixed(2)} (ปกติ: 6.5-8.5)`,
            timestamp: now
          });
        }

        // ตรวจสอบค่า TDS
        if (sensorData.tds > 1000) {
          newAlerts.push({
            id: `tds-${Date.now()}`,
            type: 'warning',
            title: 'ค่า TDS สูง',
            message: `ค่า TDS ปัจจุบัน: ${sensorData.tds.toFixed(0)} ppm (ปกติ: <1000 ppm)`,
            timestamp: now
          });
        }

        // อัพเดท alerts
        if (newAlerts.length > 0) {
          setAlerts(newAlerts);
          console.log(`🚨 พบปัญหา ${newAlerts.length} รายการ`);
        } else {
          setAlerts([]);
          console.log("✅ ข้อมูลปกติทั้งหมด");
        }

      } catch (error) {
        console.error("❌ ไม่สามารถดึงข้อมูลจาก Firebase:", error);
      }
    };

    // ตรวจสอบทุก 10 วินาที
    const interval = setInterval(checkSensorValuesFromFirebase, 10000);
    
    // ตรวจสอบครั้งแรกทันที
    checkSensorValuesFromFirebase();
    
    return () => clearInterval(interval);
  }, []);

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'info': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'error': return 'border-error/50 bg-error/10 text-error';
      case 'warning': return 'border-warning/50 bg-warning/10 text-warning';
      case 'info': return 'border-success/50 bg-success/10 text-success';
      default: return 'border-muted bg-muted/10 text-foreground';
    }
  };

  if (alerts.length === 0) {
    return (
      <Alert className="border-success/50 bg-success/10">
        <CheckCircle className="w-4 h-4 text-success" />
        <AlertDescription className="text-success">
          ระบบทำงานปกติ - ไม่มีการแจ้งเตือน
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <Alert 
          key={alert.id} 
          className={`${getAlertStyles(alert.type)} relative`}
        >
          <div className="flex items-start space-x-3">
            <div className="mt-0.5">
              {getAlertIcon(alert.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">{alert.title}</div>
              <AlertDescription className="mt-1">
                {alert.message}
              </AlertDescription>
              <div className="text-xs opacity-70 mt-2">
                {alert.timestamp.toLocaleTimeString('th-TH')}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dismissAlert(alert.id)}
              className="h-auto p-1 hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Alert>
      ))}
    </div>
  );
};

export default AlertSystem;