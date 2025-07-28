# 🌊 Aquagreen AI Dashboard

Real-time water quality monitoring dashboard with Arduino integration.

## 🚀 Features

- **Real-time Dashboard** - Live sensor data visualization
- **Arduino Integration** - Direct sensor data collection  
- **Firebase Backend** - Cloud database and functions
- **Line Notifications** - Automated alerts for abnormal readings
- **Responsive Design** - Works on desktop and mobile

## 🛠️ Tech Stack

- **Frontend**: Vite + TypeScript + React + shadcn-ui + Tailwind CSS
- **Backend**: Firebase Firestore + Firebase Functions
- **Notifications**: Line Messaging API
- **Hardware**: Arduino UNO R4 WiFi + Water Quality Sensors

## 📊 Quick Start

### 1. Run Dashboard
```bash
npm install
npm run dev
```
Dashboard will be available at: http://localhost:8081

### 2. Arduino Integration
See **[ARDUINO_API.md](./ARDUINO_API.md)** for complete Arduino integration guide.

**Quick API Info:**
- **Endpoint**: Firebase Firestore REST API
- **API Key**: `AIzaSyB88B5BQM3OJPXZGLFYBZopAOYhOaBQdio`
- **Project**: `arduinosensoralerts`

### 3. Test Data
```bash
node test_arduino_data.js
```

## 🔗 Arduino Connection

For Arduino developers, see **[ARDUINO_API.md](./ARDUINO_API.md)** which includes:
- Complete API documentation
- Sample Arduino code (WiFi/HTTP)
- JSON payload format
- Troubleshooting guide

## 📱 System Flow

```
Arduino Sensors → Firebase Firestore → Dashboard + Line Alerts
```

1. Arduino reads sensor data (pH, TDS, Turbidity, Temperature)
2. Sends data to Firebase via REST API  
3. Dashboard displays real-time charts
4. Line notifications sent if values exceed limits

## 🎯 Sensor Limits

- **pH**: 6.5 - 8.5 (alerts outside range)
- **TDS**: < 1000 ppm (alerts above)
- **Turbidity**: < 50% (alerts above)  
- **Temperature**: 15-35°C (alerts outside range)
