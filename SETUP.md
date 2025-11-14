# Setup Guide - Health Chatbot

Complete step-by-step guide to set up the Health Chatbot project.

## 📋 Prerequisites

Before starting, ensure you have installed:

- **Node.js** (v14.0.0+) - [Download](https://nodejs.org/)
- **npm** (v6.0.0+) - Comes with Node.js
- **Git** (latest) - [Download](https://git-scm.com/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community)
- **Text Editor/IDE** - [VS Code](https://code.visualstudio.com/) recommended

### Verify Installation

```bash
node --version    # Should be v14.0.0 or higher
npm --version     # Should be v6.0.0 or higher
git --version     # Any recent version
mongod --version  # Should show MongoDB version
```

## 🔑 API Keys Required

### 1. OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in
3. Go to API Keys section
4. Create new secret key
5. Copy and save securely

**Cost:** ~$0.01-0.10 per consultation (varies based on usage)

### 2. Google OAuth (Optional)

For Google login functionality:

1. Visit [Google Cloud Console](https://console.cloud.google.com)
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web Application)
5. Set authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Client Secret

### 3. MongoDB Setup

#### Option A: Local MongoDB

```bash
# Windows
# Download and install from https://www.mongodb.com/try/download/community
mongod

# macOS
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Linux
# Follow: https://docs.mongodb.com/manual/installation/
sudo systemctl start mongod
```

#### Option B: MongoDB Atlas (Cloud)

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster
4. Get connection string
5. Add connection string to `.env`

## 📥 Clone Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/my-health-chatbot.git

# Navigate to project
cd my-health-chatbot

# List contents
ls -la
```

## ⚙️ Backend Setup

### Step 1: Navigate to Server

```bash
cd server
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- express - Web framework
- mongodb - Database driver
- mongoose - ODM
- openai - OpenAI API client
- jwt - Authentication
- passport - OAuth
- cors - Cross-origin support
- dotenv - Environment variables

**Installation time:** 2-3 minutes

### Step 3: Create .env File

```bash
# Copy example file
cp .env.example .env

# Or create manually
touch .env
```

### Step 4: Configure .env

Edit `.env` file with your credentials:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/health-chatbot

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/health-chatbot

# OpenAI API
OPENAI_API_KEY=sk-your_actual_openai_key_here

# JWT Configuration
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Client URL
CLIENT_URL=http://localhost:3000
```

**⚠️ Important:** Never commit `.env` to git!

### Step 5: Verify MongoDB Connection

```bash
# Test MongoDB connection
npm test

# Or try connecting with:
mongo
# Then type: exit
```

### Step 6: Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

**Expected Output:**
```
Server running on port 5000
Connected to MongoDB
listening on http://localhost:5000
```

## 🎨 Frontend Setup

### Step 1: Open New Terminal

Open another terminal window (keep backend running).

### Step 2: Navigate to Client

```bash
cd client
```

### Step 3: Install Dependencies

```bash
npm install
```

This installs:
- react - UI library
- react-router-dom - Routing
- axios - HTTP client
- tailwindcss - Styling
- react-markdown - Markdown support
- And more...

**Installation time:** 3-5 minutes

### Step 4: Create .env File

```bash
# Create .env file
touch .env
```

### Step 5: Configure .env

Edit `.env` file:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_API_BASE_URL=http://localhost:5000

# Environment
REACT_APP_ENV=development

# Feature Flags
REACT_APP_ENABLE_VOICE=true
REACT_APP_ENABLE_GUEST_CHAT=true
REACT_APP_ENABLE_EMERGENCY_ALERT=true

# Google OAuth (if setup)
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### Step 6: Start Frontend Server

```bash
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view my-health-chatbot in the browser.
  Local: http://localhost:3000
  On Your Network: http://192.168.x.x:3000
```

## ✅ Verification

### Check Backend (Terminal 1)

```
✓ Server running on http://localhost:5000
✓ Connected to MongoDB
✓ All services ready
```

### Check Frontend (Terminal 2)

```
✓ Compiled successfully!
✓ Running on http://localhost:3000
✓ Hot reload enabled
```

### Test Application

1. Open browser: http://localhost:3000
2. Should see Health Chatbot homepage
3. Click "Get Started"
4. Sign up with test account
5. Try recording a message (allow microphone permission)
6. Should see AI response

## 🧪 Testing Setup

### Backend Tests

```bash
cd server
npm test
```

### Frontend Tests

```bash
cd client
npm test
```

## 📁 Project Structure After Setup

```
my-health-chatbot/
├── client/
│   ├── node_modules/        # Installed packages
│   ├── src/
│   ├── .env                 # Your environment variables
│   └── package.json
├── server/
│   ├── node_modules/        # Installed packages
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── .env                 # Your environment variables
│   ├── server.js
│   └── package.json
├── README.md
├── CONTRIBUTING.md
└── SETUP.md                 # This file
```

## 🐛 Troubleshooting

### Issue: "Port 5000 already in use"

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change PORT in .env to 5001
```

### Issue: "MongoDB connection refused"

```bash
# Check MongoDB is running
mongod

# For macOS
brew services start mongodb-community

# Check connection string in .env
MONGODB_URI=mongodb://localhost:27017/health-chatbot
```

### Issue: "CORS error"

**Error:** "Access to XMLHttpRequest blocked by CORS policy"

**Fix:**
- Verify backend is running
- Check CLIENT_URL in server/.env
- Ensure frontend URL matches CORS config

### Issue: "OpenAI API error"

**Error:** "401 Unauthorized" or "Insufficient quota"

**Fix:**
- Verify API key is correct
- Check account has remaining credits
- Check API is accessible from your location

### Issue: "npm install fails"

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules
rm package-lock.json

# Reinstall
npm install
```

### Issue: "Microphone permission denied"

- Check browser microphone settings
- Firefox: Preferences > Privacy & Security > Permissions
- Chrome: Settings > Privacy and security > Site Settings > Microphone

## 📚 Database Setup (MongoDB)

### Create Sample Data (Optional)

```bash
# Connect to MongoDB
mongo

# Switch to database
use health-chatbot

# Create collection
db.createCollection("users")

# Verify collection
show collections
```

### Backup Database

```bash
# Backup
mongodump --db health-chatbot --out ./backup

# Restore
mongorestore --db health-chatbot ./backup/health-chatbot
```

## 🚀 Next Steps

1. **Explore the Application**
   - Try voice recording
   - Test emergency detection
   - Try guest chat

2. **Review Documentation**
   - Read `README.md`
   - Check `server/README.md`
   - Review `server/API_DOCUMENTATION.md`

3. **Start Development**
   - Read `CONTRIBUTING.md`
   - Create feature branch
   - Make changes
   - Submit pull request

## 📞 Getting Help

### Common Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com/manual)
- [OpenAI API Docs](https://platform.openai.com/docs)

### Debugging Tips

1. Check browser console (F12)
2. Check server terminal output
3. Enable debug logging in .env
4. Check network tab in DevTools
5. Review error messages carefully

## 🔐 Security Reminder

**Never commit these to git:**
- `.env` files
- API keys
- Database credentials
- JWT secrets
- Google OAuth secrets

## ✨ You're All Set!

Your Health Chatbot development environment is ready. Start by:

```bash
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Frontend
cd client && npm start

# Open browser
http://localhost:3000
```

Happy coding! 🎉

## 📋 Checklist

- [ ] Node.js and npm installed
- [ ] Git installed
- [ ] MongoDB installed/accessible
- [ ] OpenAI API key obtained
- [ ] Repository cloned
- [ ] Backend dependencies installed
- [ ] Backend .env configured
- [ ] Backend started successfully
- [ ] Frontend dependencies installed
- [ ] Frontend .env configured
- [ ] Frontend started successfully
- [ ] Can access http://localhost:3000
- [ ] Can sign up and use application

## Need More Help?

- Check GitHub Issues
- Read CONTRIBUTING.md
- Review server/README.md
- Check server/API_DOCUMENTATION.md
- Contact project maintainers

---

**Last Updated:** November 14, 2025
**Version:** 1.0.0
