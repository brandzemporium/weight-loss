# Zubair OS — Weight Loss Operating System

A personal weight loss tracking app built with React + Vite, designed for mobile-first PWA usage on iPhone.

## Features
- 🏠🍽️✈️ Three operating modes (Home / Social / Travel) with adaptive calorie targets
- 📸 AI-powered meal photo analysis (estimates calories + protein via Claude API)
- 🧠 Live AI coaching feedback based on your actual tracking data
- 📊 Daily scoring system (0-100) with streak tracking
- 📈 Weight trend charts, daily score bar charts, calorie/protein sparklines
- 💧 Water tracking in liters, step tracking, workout progression
- 📱 PWA — installs as a home screen app on iPhone

## Deploy to Vercel (2 minutes)

### Step 1: Push to GitHub
```bash
cd zubair-os
git init
git add .
git commit -m "Zubair OS v2"
gh repo create zubair-os --public --push --source=.
```

Or manually:
1. Go to github.com → New Repository → name it `zubair-os`
2. Follow the "push an existing repository" instructions shown

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your `zubair-os` repository
4. Framework Preset: **Vite** (should auto-detect)
5. Click **Deploy**
6. Wait ~30 seconds — you'll get a URL like `zubair-os.vercel.app`

### Step 3: Install on iPhone
1. Open `your-app.vercel.app` in **Safari** (must be Safari, not Chrome)
2. Tap the **Share button** (square with arrow at bottom)
3. Scroll down → tap **"Add to Home Screen"**
4. Tap **"Add"**
5. The app icon appears on your home screen — full screen, no browser bar

## Local Development
```bash
npm install
npm run dev
```

## Tech Stack
- React 19 + Vite
- Claude API (Sonnet 4) for meal photo analysis + coaching
- LocalStorage for data persistence
- Pure CSS (no framework) — mobile-optimized
