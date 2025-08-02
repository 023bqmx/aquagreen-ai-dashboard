import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Droplets, Thermometer, Activity, Waves } from "lucide-react";

interface SensorData {
  ph: number;
  tds: number;
  turbidity: number;
  temperature: number;
  timestamp: string;
  deviceId: string;
  location: string;
}

const SimpleWaterDashboard = () => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  useEffect(() => {
    if (sensorData) {
      console.log('sensorData updated:', sensorData);
    }
  }, [sensorData]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        'https://firestore.googleapis.com/v1/projects/arduinosensoralerts/databases/(default)/documents/sensorData?orderBy=timestamp%20desc&pageSize=1',
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
          
          const sensorReading: SensorData = {
            ph: parseFloat(fields.ph?.doubleValue || fields.ph?.stringValue || '0'),
            tds: parseFloat(fields.tds?.doubleValue || fields.tds?.stringValue || '0'),
            turbidity: parseFloat(fields.turbidity?.doubleValue || fields.turbidity?.stringValue || '0'),
            temperature: parseFloat(fields.temperature?.doubleValue || fields.temperature?.stringValue || '0'),
            timestamp: fields.timestamp?.stringValue || '',
            deviceId: fields.deviceId?.stringValue || '',
            location: fields.location?.stringValue || ''
          };
          
          setSensorData(sensorReading);
          setLastUpdate(new Date().toLocaleTimeString('th-TH'));
          setConnectionStatus('connected');
        }
      } else {
        setConnectionStatus('error');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setConnectionStatus('error');
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // อัปเดตทุก 5 วินาที
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, type: 'ph' | 'tds' | 'turbidity' | 'temperature') => {
    switch (type) {
      case 'ph':
        if (value >= 6.5 && value <= 8.5) return 'bg-green-500';
        if (value >= 6.0 && value <= 9.0) return 'bg-yellow-500';
        return 'bg-red-500';
      case 'tds':
        if (value <= 300) return 'bg-green-500';
        if (value <= 500) return 'bg-yellow-500';
        return 'bg-red-500';
      case 'turbidity':
        if (value <= 10) return 'bg-green-500';
        if (value <= 25) return 'bg-yellow-500';
        return 'bg-red-500';
      case 'temperature':
        if (value >= 20 && value <= 30) return 'bg-green-500';
        if (value >= 15 && value <= 35) return 'bg-yellow-500';
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (value: number, type: 'ph' | 'tds' | 'turbidity' | 'temperature') => {
    switch (type) {
      case 'ph':
        if (value >= 6.5 && value <= 8.5) return 'ปกติ';
        if (value >= 6.0 && value <= 9.0) return 'เฝ้าระวัง';
        return 'ผิดปกติ';
      case 'tds':
        if (value <= 300) return 'ปกติ';
        if (value <= 500) return 'เฝ้าระวัง';
        return 'ผิดปกติ';
      case 'turbidity':
        if (value <= 10) return 'ปกติ';
        if (value <= 25) return 'เฝ้าระวัง';
        return 'ผิดปกติ';
      case 'temperature':
        if (value >= 20 && value <= 30) return 'ปกติ';
        if (value >= 15 && value <= 35) return 'เฝ้าระวัง';
        return 'ผิดปกติ';
      default:
        return 'ไม่ทราบ';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🌊 ระบบตรวจสอบคุณภาพน้ำ
          </h1>
          <p className="text-gray-600">
            อัปเดตล่าสุด: {lastUpdate || 'กำลังโหลด...'}
          </p>
          <div className="flex justify-center mt-2">
            <Badge 
              variant={connectionStatus === 'connected' ? 'default' : 'destructive'}
              className={`${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'} text-white`}
            >
              {connectionStatus === 'connected' ? '🟢 เชื่อมต่อแล้ว' : 
               connectionStatus === 'error' ? '🔴 การเชื่อมต่อผิดพลาด' : '🟡 กำลังเชื่อมต่อ'}
            </Badge>
          </div>
        </div>

        {/* Sensor Data Cards */}
        {sensorData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* pH Card */}
            <Card className="border-2 border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="font-bold text-green-600">1</span>
                  <Droplets className="w-5 h-5 text-blue-500" />
                  ค่า pH
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-gray-600">6.5</span>
                  <span className="text-gray-600">8.5</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full mb-2">
                  <div
                    className={`h-3 rounded-full ${getStatusColor(sensorData.ph, 'ph')}`}
                    style={{ width: `${((sensorData.ph - 6.5) / (8.5 - 6.5)) * 100}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg text-gray-800">{sensorData.ph.toFixed(2)}</span>
                  <Badge className={`${getStatusColor(sensorData.ph, 'ph')} text-white px-3 py-1`}>
                    {getStatusText(sensorData.ph, 'ph')}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500 mt-2">ปกติ: 6.5-8.5</div>
              </CardContent>
            </Card>

            {/* TDS Card */}
            <Card className="border-2 border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="font-bold text-yellow-600">2</span>
                  <Activity className="w-5 h-5 text-green-500" />
                  TDS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-gray-600">0</span>
                  <span className="text-gray-600">1000</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full mb-2">
                  <div
                    className={`h-3 rounded-full ${getStatusColor(sensorData.tds, 'tds')}`}
                    style={{ width: `${(sensorData.tds / 1000) * 100}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg text-gray-800">{sensorData.tds.toFixed(1)} ppm</span>
                  <Badge className={`${getStatusColor(sensorData.tds, 'tds')} text-white px-3 py-1`}>
                    {getStatusText(sensorData.tds, 'tds')}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500 mt-2">ปกติ: ≤300 ppm</div>
              </CardContent>
            </Card>

            {/* Turbidity Card */}
            <Card className="border-2 border-yellow-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="font-bold text-red-600">3</span>
                  <Waves className="w-5 h-5 text-yellow-500" />
                  ความขุ่น
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-gray-600">0</span>
                  <span className="text-gray-600">25</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full mb-2">
                  <div
                    className={`h-3 rounded-full ${getStatusColor(sensorData.turbidity, 'turbidity')}`}
                    style={{ width: `${(sensorData.turbidity / 25) * 100}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg text-gray-800">{sensorData.turbidity.toFixed(1)} NTU</span>
                  <Badge className={`${getStatusColor(sensorData.turbidity, 'turbidity')} text-white px-3 py-1`}>
                    {getStatusText(sensorData.turbidity, 'turbidity')}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500 mt-2">ปกติ: ≤10 NTU</div>
              </CardContent>
            </Card>

            {/* Temperature Card */}
            <Card className="border-2 border-red-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="font-bold text-green-600">4</span>
                  <Thermometer className="w-5 h-5 text-red-500" />
                  อุณหภูมิ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-gray-600">15</span>
                  <span className="text-gray-600">35</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full mb-2">
                  <div
                    className={`h-3 rounded-full ${getStatusColor(sensorData.temperature, 'temperature')}`}
                    style={{ width: `${((sensorData.temperature - 15) / (35 - 15)) * 100}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg text-gray-800">{sensorData.temperature.toFixed(1)} °C</span>
                  <Badge className={`${getStatusColor(sensorData.temperature, 'temperature')} text-white px-3 py-1`}>
                    {getStatusText(sensorData.temperature, 'temperature')}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500 mt-2">ปกติ: 20-30°C</div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-xl">กำลังโหลดข้อมูล...</div>
          </div>
        )}

        {/* Device Info */}
        {sensorData && (
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-gray-500" />
                ข้อมูลอุปกรณ์
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Device ID:</span> {sensorData.deviceId}
                </div>
                <div>
                  <span className="font-semibold">Location:</span> {sensorData.location}
                </div>
                <div>
                  <span className="font-semibold">Timestamp:</span> {sensorData.timestamp}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Refresh Button */}
        <div className="text-center mt-8">
          <button
            onClick={fetchData}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            🔄 รีเฟรชข้อมูล
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleWaterDashboard;
