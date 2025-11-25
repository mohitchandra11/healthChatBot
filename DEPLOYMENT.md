# 🚀 Deployment Guide - Health Chatbot

This guide covers deploying your MERN stack health chatbot application to production.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Deployment Options](#deployment-options)
- [Option 1: Vercel (Frontend) + Render (Backend)](#option-1-vercel--render-recommended)
- [Option 2: Railway (Full Stack)](#option-2-railway-full-stack)
- [Option 3: Heroku (Full Stack)](#option-3-heroku-full-stack)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Post-Deployment](#post-deployment)

---

## 🔧 Prerequisites

Before deploying, ensure you have:

- [x] GitHub account with your repository pushed
- [x] MongoDB Atlas account (for cloud database)
- [x] OpenAI API key with credits
- [x] Google Gemini API key
- [x] Domain name (optional, but recommended)

---

## 🎯 Deployment Options

### Comparison Table

| Platform | Frontend | Backend | Database | Cost | Difficulty |
|----------|----------|---------|----------|------|------------|
| **Vercel + Render** | ✅ Free | ✅ Free | MongoDB Atlas | Free | Easy |
| **Railway** | ✅ Free | ✅ Free | MongoDB Atlas | $5/month | Easy |
| **Heroku** | ✅ Paid | ✅ Paid | MongoDB Atlas | $7+/month | Medium |

**Recommended:** Vercel (Frontend) + Render (Backend) - Best free option

---

## 🌟 Option 1: Vercel + Render (Recommended)

### Part A: Deploy Backend to Render

#### 1. Prepare Backend for Deployment

Create `render.yaml` in the root directory:

```yaml
services:
  - type: web
    name: health-chatbot-api
    env: node
    buildCommand: cd server && npm install
    startCommand: cd server && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
```

#### 2. Sign Up for Render

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click **"New +"** → **"Web Service"**

#### 3. Configure Render Service

1. **Connect Repository:** Select `my-health-chatbot`
2. **Name:** `health-chatbot-api`
3. **Root Directory:** `server`
4. **Environment:** `Node`
5. **Build Command:** `npm install`
6. **Start Command:** `npm start`
7. **Plan:** Free

#### 4. Add Environment Variables on Render

Go to **Environment** tab and add:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_atlas_uri
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
CLIENT_URL=https://your-app.vercel.app
```

#### 5. Deploy Backend

Click **"Create Web Service"** - Render will automatically deploy!

**Your backend URL:** `https://health-chatbot-api.onrender.com`

---

### Part B: Deploy Frontend to Vercel

#### 1. Update API URL in Frontend

Create `client/.env.production`:

```env
REACT_APP_API_URL=https://health-chatbot-api.onrender.com/api
REACT_APP_API_BASE_URL=https://health-chatbot-api.onrender.com
REACT_APP_ENV=production
```

#### 2. Sign Up for Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"Add New Project"**

#### 3. Import Repository

1. Select `my-health-chatbot`
2. **Framework Preset:** Create React App
3. **Root Directory:** `client`
4. **Build Command:** `npm run build`
5. **Output Directory:** `build`

#### 4. Configure Environment Variables

Add these in Vercel dashboard:

```env
REACT_APP_API_URL=https://health-chatbot-api.onrender.com/api
REACT_APP_API_BASE_URL=https://health-chatbot-api.onrender.com
REACT_APP_ENV=production
```

#### 5. Deploy Frontend

Click **"Deploy"** - Vercel will build and deploy!

**Your frontend URL:** `https://my-health-chatbot.vercel.app`

#### 6. Update Backend CORS

Go back to Render → Environment → Update:

```env
C =https://my-health-chatbot.vercel.app
```

---

### Part C: Update Localhost URLs in Code

**IMPORTANT:** Before deploying, you need to replace hardcoded `localhost` URLs with environment variables!

#### 1. Check Your Current Code

Search for hardcoded URLs in your frontend:

```bash
cd client
# Search for localhost references
grep -r "localhost:5000" src/
grep -r "http://localhost" src/
```

Common places with hardcoded URLs:
- `src/services/authService.js`
- `src/components/dashboard/VirtualDoctor.jsx`
- Any file with `axios.post()` or `fetch()` calls

#### 2. Create Environment Files

**Development** (`client/.env.development`):
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_ENV=development
```

**Production** (`client/.env.production`):
```env
REACT_APP_API_URL=https://health-chatbot-api.onrender.com/api
REACT_APP_API_BASE_URL=https://health-chatbot-api.onrender.com
REACT_APP_ENV=production
```

**Note:** Add `.env.production` to `.gitignore` - Set these in Vercel dashboard instead!

#### 3. Update Your Code to Use Environment Variables

**❌ BEFORE (Hardcoded - Don't do this):**
```javascript
// Bad - hardcoded localhost
axios.post('http://localhost:5000/api/virtual-doctor/chat', data)
fetch('http://localhost:5000/api/auth/login', options)
```

**✅ AFTER (Environment Variable - Do this):**
```javascript
// Good - uses environment variable
const API_URL = process.env.REACT_APP_API_URL;

axios.post(`${API_URL}/virtual-doctor/chat`, data)
fetch(`${API_URL}/auth/login`, options)
```

#### 4. Create API Config File (Recommended)

Create `client/src/config/api.js`:

```javascript
// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Export for easy use
export default {
  baseURL: API_BASE_URL,
  apiURL: API_URL,
  endpoints: {
    auth: {
      login: `${API_URL}/auth/login`,
      signup: `${API_URL}/auth/signup`,
      logout: `${API_URL}/auth/logout`,
    },
    virtualDoctor: {
      chat: `${API_URL}/virtual-doctor/chat`,
      transcribe: `${API_URL}/virtual-doctor/transcribe`,
    },
    chat: {
      send: `${API_URL}/chat/send`,
      history: `${API_URL}/chat/history`,
    }
  }
};
```

Then use it in your components:

```javascript
import apiConfig from './config/api';

// In your component
axios.post(apiConfig.endpoints.virtualDoctor.chat, data);
```

#### 5. Update Backend CORS Configuration

Make sure your backend `server/server.js` uses environment variable for CORS:

```javascript
// ✅ Good - uses environment variable
const cors = require('cors');
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
```

**NOT** hardcoded like:
```javascript
// ❌ Bad - hardcoded
app.use(cors({
  origin: 'http://localhost:3000'  // This won't work in production!
}));
```

#### 6. Verify Changes Before Deploying

```bash
# Test that environment variables work locally
cd client
npm start

# Test production build locally
npm run build
npx serve -s build

# Check for any remaining localhost references
grep -r "localhost" src/ | grep -v "node_modules"
```

#### 7. Common Files to Update

**Example: `client/src/services/authService.js`**

```javascript
// Before
const API_URL = 'http://localhost:5000/api';

// After
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

**Example: `client/src/components/dashboard/VirtualDoctor.jsx`**

```javascript
// Before
const response = await axios.post('http://localhost:5000/api/virtual-doctor/chat', {
  text: userInput
});

// After
const API_URL = process.env.REACT_APP_API_URL;
const response = await axios.post(`${API_URL}/virtual-doctor/chat`, {
  text: userInput
});
```

#### 8. What Happens During Deployment

**Development (localhost):**
- Uses `.env.development`
- API calls go to `http://localhost:5000`
- CORS allows `http://localhost:3000`

**Production (Vercel + Render):**
- Uses environment variables from Vercel dashboard
- API calls go to `https://your-api.onrender.com`
- CORS allows `https://your-app.vercel.app`

**No code changes needed** - just different environment variables! 🎯

---

## 🚂 Option 2: Railway (Full Stack)

### 1. Sign Up for Railway

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**

### 2. Deploy Backend

1. Select `my-health-chatbot` repository
2. Railway auto-detects Node.js
3. **Root Directory:** Set to `server`
4. Add environment variables (see below)
5. Railway generates a URL: `https://your-app.railway.app`

### 3. Deploy Frontend

1. Click **"New"** → **"GitHub Repo"** (same repo)
2. **Root Directory:** Set to `client`
3. **Build Command:** `npm run build`
4. **Start Command:** `npx serve -s build -l $PORT`
5. Add environment variables pointing to backend Railway URL

### 4. Environment Variables

**Backend Service:**
```env
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_uri
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
CLIENT_URL=https://your-frontend.railway.app
PORT=3000
```

**Frontend Service:**
```env
REACT_APP_API_URL=https://your-backend.railway.app/api
```

---

## 🎈 Option 3: Heroku (Full Stack)

### 1. Install Heroku CLI

```bash
npm install -g heroku
heroku login
```

### 2. Create Heroku Apps

```bash
# Create backend app
heroku create health-chatbot-api

# Create frontend app
heroku create health-chatbot-web
```

### 3. Deploy Backend

```bash
cd server
git init
heroku git:remote -a health-chatbot-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set GEMINI_API_KEY=your_key
heroku config:set JWT_SECRET=your_secret
heroku config:set CLIENT_URL=https://health-chatbot-web.herokuapp.com

# Deploy
git add .
git commit -m "Deploy backend"
git push heroku main
```

### 4. Deploy Frontend

```bash
cd ../client

# Update .env.production with backend URL
echo "REACT_APP_API_URL=https://health-chatbot-api.herokuapp.com/api" > .env.production

# Build and deploy
npm run build
heroku git:remote -a health-chatbot-web
git add .
git commit -m "Deploy frontend"
git push heroku main
```

---

## 🗄️ Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free
3. Create a **Free Tier Cluster** (M0)

### 2. Configure Database

1. **Database Access:**
   - Create database user
   - Username: `healthchatbot`
   - Password: Generate strong password
   - Save credentials securely

2. **Network Access:**
   - Click "Add IP Address"
   - Select **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This allows Render/Vercel to connect

3. **Get Connection String:**
   - Click **"Connect"** → **"Connect your application"**
   - Copy connection string:
   ```
   mongodb+srv://healthchatbot:<password>@cluster0.xxxxx.mongodb.net/health-chatbot?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password

### 3. Add to Environment Variables

Use this connection string in your deployment platform's environment variables as `MONGODB_URI`

---

## 🔐 Environment Variables Reference

### Backend Environment Variables

```env
# Required
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/health-chatbot
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_super_secret_minimum_32_characters_long

# Frontend URL (for CORS)
CLIENT_URL=https://your-frontend-url.vercel.app
```

### Frontend Environment Variables

```env
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
REACT_APP_API_BASE_URL=https://your-backend-url.onrender.com
REACT_APP_ENV=production
```

---

## ✅ Post-Deployment Checklist

### 1. Test Your Deployment

- [ ] Visit frontend URL - homepage loads
- [ ] Test user signup/login
- [ ] Test virtual doctor chat
- [ ] Test voice recording (requires HTTPS)
- [ ] Test emergency features
- [ ] Check browser console for errors

### 2. Update GitHub Repository

```bash
# Update README with live URLs
git add .
git commit -m "Update deployment URLs"
git push origin main
```

### 3. Configure Custom Domain (Optional)

**Vercel:**
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

**Render:**
1. Go to Settings → Custom Domain
2. Add domain and configure DNS

### 4. Enable HTTPS

Both Vercel and Render provide **free SSL certificates** automatically!

### 5. Monitor Your Application

**Render Dashboard:**
- View logs: `https://dashboard.render.com`
- Monitor CPU/Memory usage
- Check deployment status

**Vercel Dashboard:**
- View analytics
- Check build logs
- Monitor performance

---

## 🐛 Common Deployment Issues

### Issue 1: CORS Errors

**Problem:** Frontend can't connect to backend

**Solution:**
```javascript
// Verify CLIENT_URL in backend .env matches frontend URL exactly
CLIENT_URL=https://my-health-chatbot.vercel.app
```

### Issue 2: MongoDB Connection Failed

**Problem:** "MongoNetworkError" or connection timeout

**Solution:**
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check connection string format
- Ensure password doesn't contain special characters (URL encode if needed)

### Issue 3: Build Fails on Vercel

**Problem:** "Module not found" or build errors

**Solution:**
```bash
# Locally test production build
cd client
npm run build

# If successful, commit and redeploy
git add .
git commit -m "Fix build"
git push
```

### Issue 4: Environment Variables Not Working

**Problem:** API calls fail or features don't work

**Solution:**
- Redeploy after adding environment variables
- Verify variable names match exactly (case-sensitive)
- Check for typos in variable values

### Issue 5: Render Free Tier Sleep

**Problem:** First request takes 30+ seconds

**Solution:**
- Render free tier sleeps after 15 minutes of inactivity
- Consider upgrading to paid tier ($7/month) for always-on
- Or use a service like [UptimeRobot](https://uptimerobot.com) to ping every 5 minutes

---

## 💰 Cost Breakdown

### Free Tier (Recommended for Testing)

| Service | Cost | Limits |
|---------|------|--------|
| Vercel | Free | 100GB bandwidth/month |
| Render | Free | 750 hours/month, sleeps after 15min |
| MongoDB Atlas | Free | 512MB storage |
| **Total** | **$0/month** | Good for development/testing |

### Paid Tier (Production Ready)

| Service | Cost | Benefits |
|---------|------|----------|
| Vercel Pro | $20/month | Custom domains, analytics |
| Render Starter | $7/month | Always-on, no sleep |
| MongoDB Atlas M10 | $10/month | 10GB storage, backups |
| **Total** | **$37/month** | Production-ready |

---

## 🎯 Quick Start (Recommended Path)

**Step-by-step deployment in 30 minutes:**

1. **Setup MongoDB Atlas** (10 min)
   - Create free cluster
   - Get connection string
   
2. **Deploy Backend to Render** (10 min)
   - Connect GitHub repo
   - Add environment variables
   - Deploy
   
3. **Deploy Frontend to Vercel** (10 min)
   - Connect GitHub repo
   - Add backend URL
   - Deploy

**Done!** Your app is live 🎉

---

## 📞 Support

If you encounter issues:

1. Check deployment logs on your platform
2. Review this guide's troubleshooting section
3. Check MongoDB Atlas connection
4. Verify all environment variables are set correctly

---

**Created by:** [@mohitchandra11](https://github.com/mohitchandra11)
