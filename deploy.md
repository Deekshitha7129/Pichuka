# Pichuka Restaurant - Deployment Guide

## 🚀 Quick Deployment Steps

### Prerequisites
1. **MongoDB Atlas Account** (Free tier available)
2. **Render.com Account** (For backend hosting - Free tier)
3. **Vercel Account** (For frontend hosting - Free tier)

### Step 1: Database Setup (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string (replace `<password>` with your actual password)
5. Whitelist all IP addresses (0.0.0.0/0) for development

### Step 2: Backend Deployment (Render.com)
1. Push your code to GitHub (if not already done)
2. Go to [Render.com](https://render.com) and create account
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Select the `backend` folder as root directory
6. Set these environment variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `FRONTEND_URL`: `https://your-frontend-domain.vercel.app`
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render default)

### Step 3: Frontend Deployment (Vercel)
1. Go to [Vercel.com](https://vercel.com) and create account
2. Import your GitHub repository
3. Set root directory to `WebFrontend`
4. Set environment variable:
   - `VITE_API_URL`: `https://your-backend-domain.onrender.com/api/v1`
5. Deploy!

### Step 4: Update CORS Settings
After deployment, update your backend's FRONTEND_URL environment variable with your actual Vercel domain.

## 🔧 Local Development
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd WebFrontend
npm install
npm run dev
```

## 📱 Features
- ✅ Customer Registration & Login
- ✅ Staff/Chef Role-based Access
- ✅ Restaurant Reservations
- ✅ Food Ordering System
- ✅ Cart Management
- ✅ Order Tracking
- ✅ Chef Dashboard
- ✅ Staff Dashboard
- ✅ Order History

## 🎯 Project Structure
```
Pichuka Restaurant/
├── backend/           # Node.js/Express API
├── WebFrontend/       # React/Vite Frontend
├── render.yaml        # Render deployment config
└── deploy.md          # This deployment guide
```

Your restaurant management system is ready for production! 🎉
