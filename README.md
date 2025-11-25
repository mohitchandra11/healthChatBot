# My Health Chatbot

A comprehensive full-stack MERN (MongoDB, Express, React, Node.js) application that provides an AI-powered virtual doctor chatbot with voice interaction capabilities, emergency detection, and user authentication.

## 🌟 Features

- **Voice-Based Interaction**: Record and send voice messages to get medical advice
- **AI-Powered Doctor**: Powered by OpenAI's GPT-4 for intelligent medical responses
- **Speech Recognition**: Uses OpenAI's Whisper API for accurate audio transcription
- **Text-to-Speech**: Converts AI responses back to audio for better user experience
- **Emergency Detection**: Automatically identifies emergency keywords and provides urgent guidance
- **User Authentication**: Secure login and signup with JWT tokens
- **Chat History**: Stores and retrieves past consultations
- **Guest Chat**: Allows users to chat without authentication
- **Responsive Design**: Built with React and Tailwind CSS for mobile and desktop

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Technologies Used](#technologies-used)
- [Features Documentation](#features-documentation)

## 📁 Project Structure

```
my-health-chatbot/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context for state management
│   │   ├── services/      # API services
│   │   └── App.jsx        # Main app component
│   ├── package.json       # Frontend dependencies
│   └── tailwind.config.js # Tailwind CSS configuration
│
├── server/                # Node.js Express backend
│   ├── config/           # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── server.js         # Main server file
│   └── package.json      # Backend dependencies
│
└── README.md             # Main project documentation
```

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **MongoDB** (local or MongoDB Atlas account)
- **OpenAI API Key** (for GPT-4 and Whisper)
- **Google OAuth Credentials** (for social authentication)

## 💾 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/mohitchandra11/my-health-chatbot.git
cd my-health-chatbot
```

### 2. Install Server Dependencies

```bash
cd server
npm install
```

### 3. Install Client Dependencies

```bash
cd ../client
npm install
```

## ⚙️ Configuration

### Backend Configuration

Create a `.env` file in the `/server` directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/health-chatbot
# or use MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/health-chatbot

# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Server Port
PORT=5000
NODE_ENV=development
```

### Frontend Configuration

The frontend connects to the backend at `http://localhost:5000`. This is configured in the API service files.

## 🚀 Running the Application

### Option 1: Run Both in Separate Terminals

**Terminal 1 - Start Backend Server:**
```bash
cd server
npm start
# Server runs on http://localhost:5000
```

**Terminal 2 - Start Frontend Development Server:**
```bash
cd client
npm start
# Client runs on http://localhost:3000
```

### Option 2: Run Backend Only (Production Build)

First, build the client:
```bash
cd client
npm run build
```

Then run the server:
```bash
cd server
npm start
```

## 📡 API Documentation

### Authentication Endpoints

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback

### Chat Endpoints

- `POST /api/chat/send` - Send a chat message
- `GET /api/chat/history` - Get chat history
- `GET /api/chat/:id` - Get specific chat

### Virtual Doctor Endpoints

- `POST /api/virtual-doctor/transcribe` - Transcribe audio to text
- `POST /api/virtual-doctor/chat` - Get AI response
- `POST /api/virtual-doctor/audio-chat` - Combined audio processing

### Guest Chat Endpoints

- `POST /api/guest-chat/send` - Send anonymous message

### User Endpoints

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## 🛠️ Technologies Used

### Frontend
- **React** - UI library
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Navigation
- **React Markdown** - Markdown rendering
- **Heroicons** - Icon library
- **MediaRecorder API** - Audio recording

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **OpenAI API** - AI/ML services (GPT-4, Whisper, TTS)
- **JWT** - Authentication
- **Passport.js** - OAuth authentication
- **Dotenv** - Environment variables
- **CORS** - Cross-origin support

## 📚 Features Documentation

### 1. Voice-Based Consultation

Users can:
- Record their medical queries using the microphone
- Automatic transcription via Whisper API
- Get AI-generated responses
- Receive audio responses via text-to-speech

### 2. Emergency Detection

The system automatically detects emergency keywords and provides:
- Immediate emergency alerts
- Local emergency number guidance
- Emergency action recommendations

### 3. User Authentication

- Email/Password registration and login
- Google OAuth integration
- JWT token-based session management
- Secure password hashing

### 4. Chat History

- Stores all consultations in MongoDB
- Retrieves user's consultation history
- Displays summaries and recommendations

### 5. Guest Chat

- Allow anonymous users to access basic features
- No authentication required
- Limited features compared to registered users

## 🔐 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Environment variable protection
- CORS configuration
- Protected routes middleware
- Input validation and sanitization

## 📦 Build and Deployment

### Build for Production

```bash
cd client
npm run build
```

This creates an optimized build in the `client/build` directory.

### Deploy on Vercel, Heroku, or AWS

1. Build the frontend
2. Configure environment variables on hosting platform
3. Deploy backend to hosting service
4. Update frontend API endpoint in production

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in server/.env or kill process using port 5000
lsof -i :5000
kill -9 <PID>
```

### Database Connection Issues
- Verify MongoDB is running
- Check connection string in .env
- Ensure firewall allows MongoDB access

### OpenAI API Errors
- Verify API key is valid
- Check account has sufficient credits
- Ensure API is accessible from your location

## 📞 Support

For issues or questions, please create an issue in the repository or contact the development team.

## 📝 License

All rights reserved.

## 👥 Contributors

- [@mohitchandra11](https://github.com/mohitchandra11) - Full Stack Development

## 🔄 Version History

- **v1.0.0** - Initial release with core features
  - Voice-based consultation
  - AI-powered responses
  - User authentication
  - Emergency detection
