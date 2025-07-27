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

  // Simulate incoming alerts
  useEffect(() => {
    const checkSensorValues = () => {
      const now = new Date();
      
      // Simulated sensor checks
      const newAlerts: AlertData[] = [];
      
      // pH check
      const ph = 7.2;
      if (ph < 6.5 || ph > 8.5) {
        newAlerts.push({
          id: `ph-${Date.now()}`,
          type: 'error',
          title: 'ค่า pH ผิดปกติ',
          message: `ค่า pH ปัจจุบัน: ${ph} (ปกติ: 6.5-8.5) กรุณาตรวจสอบระบบบำบัด`,
          timestamp: now
        });
      }
      
      // TDS check  
      const tds = 850;
      if (tds > 1000) {
        newAlerts.push({
          id: `tds-${Date.now()}`,
          type: 'warning',
          title: 'ค่า TDS สูง',
          message: `ค่า TDS ปัจจุบัน: ${tds} ppm (ปกติ: <1000 ppm) ควรเฝ้าระวัง`,
          timestamp: now
        });
      }
      
      // Turbidity check
      const turbidity = 12;
      if (turbidity > 10) {
        newAlerts.push({
          id: `turbidity-${Date.now()}`,
          type: 'error',
          title: 'น้ำขุ่นเกินมาตรฐาน',
          message: `ความขุ่น: ${turbidity} NTU (ปกติ: <10 NTU) ต้องตรวจสอบทันที`,
          timestamp: now
        });
      }
      
      if (newAlerts.length > 0) {
        setAlerts(prev => [...newAlerts, ...prev].slice(0, 5)); // Keep only 5 latest
      }
    };

    // Check every 30 seconds
    const interval = setInterval(checkSensorValues, 30000);
    
    // Initial check
    checkSensorValues();
    
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