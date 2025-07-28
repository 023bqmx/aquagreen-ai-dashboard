@echo off
echo 🌊 Starting Aquagreen AI Dashboard...
echo ===================================

cd /d "C:\Users\OS\Documents\GitHub\aquagreen-ai-dashboard"

echo 📦 Installing dependencies...
call npm install

echo 🚀 Starting development server...
call npm run dev

echo ✅ Dashboard should be running at http://localhost:8080
pause
