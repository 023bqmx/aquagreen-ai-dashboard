# Deployment Instructions

## Quick Vercel Deployment (Recommended)

Your dashboard is now ready for online deployment! Here's the fastest way to get it online:

### Step 1: Install Vercel CLI
```powershell
npm install -g vercel
```

### Step 2: Deploy
```powershell
cd c:\Users\OS\Documents\GitHub\aquagreen-ai-dashboard
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your personal account
- **Link to existing project?** → No
- **What's your project's name?** → aquagreen-dashboard (or your choice)
- **In which directory is your code located?** → ./ (current directory)

### Step 3: Production Deployment
```powershell
vercel --prod
```

## What You Get Online

✅ **Real-time Updates**: Your Firebase integration continues working - data updates automatically across all connected browsers

✅ **Live Sensor Data**: Arduino sensors can continue sending data via the API documented in ARDUINO_API.md

✅ **Line Notifications**: Your Line messaging integration remains fully functional

✅ **Multiple Device Access**: Access your dashboard from any device with internet

## Alternative Deployment Options

### Netlify (Alternative)
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Build project: `npm run build`
3. Deploy: `netlify deploy --prod --dir=dist`

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

## Cost Information
- **Vercel Free Tier**: Perfect for personal projects (100GB bandwidth/month)
- **Netlify Free Tier**: 100GB bandwidth, 300 build minutes
- **Firebase Hosting**: 10GB storage, 360MB/day transfer (free)

Your dashboard will be accessible worldwide at the provided URL (e.g., `aquagreen-dashboard.vercel.app`)!
