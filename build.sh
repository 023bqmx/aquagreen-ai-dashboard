#!/bin/bash

# 🚀 Complete Build Script for Aquagreen AI Dashboard

echo "🌊 Building Aquagreen AI Dashboard..."

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 2. Build the project
echo "🔨 Building project..."
npm run build

# 3. Install Functions dependencies
echo "🔧 Installing Functions dependencies..."
cd functions
npm install
cd ..

# 4. Deploy to Firebase (requires login)
echo "🚀 Deploying to Firebase..."
if firebase projects:list >/dev/null 2>&1; then
    echo "✅ Firebase authenticated"
    firebase deploy
else
    echo "⚠️ Please run 'firebase login' first"
    echo "ℹ️ Or use GitHub Actions for automatic deployment"
fi

echo "✨ Build completed!"
echo "🌐 Local: http://localhost:8080"
echo "🌍 Production: https://aquagreen-ai-dashboard.web.app"
