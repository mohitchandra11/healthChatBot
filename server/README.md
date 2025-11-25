# Health Chatbot Backend

A comprehensive Express.js backend server for the AI-powered health chatbot application. This server handles user authentication, chat management, and integration with OpenAI APIs for voice and text processing.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Create .env file with configuration
cp .env.example .env

# Start the server
npm start
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
server/
├── config/
│   ├── db.js                 # MongoDB connection configuration
│   ├── passport-setup.js     # Google OAuth configuration
│   └── systemPrompt.js       # AI system prompts and keywords
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── chatController.js     # Chat message handling
│   ├── guestChatController.js # Guest chat logic
│   └── userController.js     # User profile management
├── middleware/
│   └── authMiddleware.js     # JWT authentication middleware
├── models/
│   ├── Chat.js               # Chat message schema
│   └── User.js               # User schema
├── routes/
│   ├── authRoutes.js         # Authentication endpoints
│   ├── chatRoutes.js         # Chat endpoints
│   ├── guestChatRoutes.js    # Guest chat endpoints
│   ├── userRoutes.js         # User endpoints
│   └── virtualDoctor.js      # Virtual doctor (AI) endpoints
├── uploads/                  # Temporary audio file storage
├── server.js                 # Main server entry point
└── package.json              # Dependencies and scripts
```

## 🔧 Installation

### Prerequisites

- Node.js v14.0.0 or higher
- npm v6.0.0 or higher
- MongoDB (local or Atlas)
- OpenAI API Key

### Setup Steps

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see Configuration section)

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/health-chatbot
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/health-chatbot

# OpenAI API Configuration
OPENAI_API_KEY=sk-your_openai_api_key_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000
```

### MongoDB Setup

**Local MongoDB:**
```bash
# On Windows
mongod

# On macOS/Linux
brew services start mongodb-community
```

**MongoDB Atlas (Cloud):**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Add to MONGODB_URI in .env

### OpenAI API Key

1. Visit https://platform.openai.com/api-keys
2. Create new API key
3. Add to OPENAI_API_KEY in .env

## 📦 Dependencies

### Core Dependencies

- **express** (^4.18.0) - Web framework
- **mongoose** (^7.0.0) - MongoDB ODM
- **dotenv** (^16.0.0) - Environment variables
- **cors** (^2.8.5) - Cross-origin requests
- **bcryptjs** (^2.4.3) - Password hashing
- **jsonwebtoken** (^9.0.0) - JWT authentication
- **passport** (^0.6.0) - Authentication
- **passport-google-oauth20** (^2.0.0) - Google OAuth
- **openai** (^4.0.0) - OpenAI API client

### Dev Dependencies

- **nodemon** (^2.0.20) - Auto-restart on file changes

## 🚀 Running the Server

### Development Mode

```bash
npm run dev
```

This uses nodemon for automatic restart on file changes.

### Production Mode

```bash
npm start
```

### Testing

```bash
npm test
```

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

#### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}

Response: 201
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": { "id", "email", "name" }
}
```

#### Log In
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response: 200
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": { "id", "email", "name" }
}
```

#### Google OAuth
```http
GET /api/auth/google
```

#### Log Out
```http
POST /api/auth/logout
Authorization: Bearer {token}

Response: 200
{
  "message": "Logout successful"
}
```

### Chat Routes (`/api/chat`)

#### Send Chat Message
```http
POST /api/chat/send
Authorization: Bearer {token}
Content-Type: application/json

{
  "message": "What should I do for a headache?"
}

Response: 201
{
  "id": "chat_id",
  "userId": "user_id",
  "message": "What should I do for a headache?",
  "timestamp": "2025-11-14T10:30:00Z"
}
```

#### Get Chat History
```http
GET /api/chat/history
Authorization: Bearer {token}

Response: 200
[
  {
    "id": "chat_id",
    "message": "What should I do for a headache?",
    "response": "For a headache...",
    "timestamp": "2025-11-14T10:30:00Z"
  }
]
```

#### Get Specific Chat
```http
GET /api/chat/:chatId
Authorization: Bearer {token}

Response: 200
{
  "id": "chat_id",
  "userId": "user_id",
  "message": "What should I do for a headache?",
  "response": "For a headache...",
  "timestamp": "2025-11-14T10:30:00Z"
}
```

### Virtual Doctor Routes (`/api/virtual-doctor`)

#### Transcribe Audio
```http
POST /api/virtual-doctor/transcribe
Authorization: Bearer {token}
Content-Type: application/json

{
  "audioData": "data:audio/webm;base64,GkXfo59ChoEBQveWAP7/..."
}

Response: 200
{
  "text": "What should I do for a fever?",
  "isEmergency": false
}
```

#### Get AI Response
```http
POST /api/virtual-doctor/chat
Authorization: Bearer {token}
Content-Type: application/json

{
  "text": "What should I do for a fever?"
}

Response: 200
{
  "text": "For a fever, you should...",
  "audio": "base64_encoded_audio",
  "isEmergency": false
}
```

#### Combined Audio Chat
```http
POST /api/virtual-doctor/audio-chat
Authorization: Bearer {token}
Content-Type: application/json

{
  "audioData": "data:audio/webm;base64,..."
}

Response: 200
{
  "transcribed": "What should I do for a fever?",
  "response": "For a fever, you should...",
  "audio": "base64_encoded_audio",
  "isEmergency": false
}
```

### Guest Chat Routes (`/api/guest-chat`)

#### Send Guest Message
```http
POST /api/guest-chat/send
Content-Type: application/json

{
  "message": "What is a common cold?"
}

Response: 201
{
  "message": "What is a common cold?",
  "response": "A common cold is...",
  "timestamp": "2025-11-14T10:30:00Z"
}
```

### User Routes (`/api/user`)

#### Get User Profile
```http
GET /api/user/profile
Authorization: Bearer {token}

Response: 200
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2025-11-01T00:00:00Z"
}
```

#### Update User Profile
```http
PUT /api/user/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Smith",
  "email": "newemail@example.com"
}

Response: 200
{
  "message": "Profile updated successfully",
  "user": { "id", "email", "name" }
}
```

## 🔐 Security

### Authentication

- JWT (JSON Web Tokens) for stateless authentication
- Tokens stored in Authorization header: `Authorization: Bearer {token}`
- Token expiration: 7 days (configurable)

### Password Security

- bcryptjs for password hashing
- Passwords never stored in plain text
- Password salting with 10 rounds

### Middleware Protection

- `authMiddleware.js` protects authenticated routes
- CORS configured to allow only authorized origins
- Input validation on all endpoints

### Best Practices

1. Always use HTTPS in production
2. Rotate JWT_SECRET regularly
3. Keep OpenAI API key secure
4. Validate all user inputs
5. Use environment variables for sensitive data

## 🛠️ Database Schemas

### User Model

```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  googleId: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Chat Model

```javascript
{
  userId: ObjectId,
  message: String,
  response: String,
  summary: String,
  action: String,
  isEmergency: Boolean,
  timestamp: Date
}
```

## 🚨 Emergency Keywords

The system detects the following emergency keywords:

- Heart attack / Chest pain
- Stroke / Paralysis
- Severe bleeding
- Loss of consciousness
- Difficulty breathing
- Poisoning / Overdose
- Severe allergic reaction
- Seizure

When detected, the user receives:
- Emergency alert
- Instructions to call emergency services (911/112)
- Guidance to go to nearest emergency room

## 🐛 Error Handling

### Common Errors

**401 Unauthorized**
- Invalid or missing JWT token
- Token has expired
- Solution: Login again to get new token

**404 Not Found**
- Endpoint doesn't exist
- Resource not found
- Solution: Check API documentation and URL

**400 Bad Request**
- Invalid request format
- Missing required fields
- Solution: Verify request body format

**500 Internal Server Error**
- Server error
- Database connection issue
- OpenAI API error
- Solution: Check server logs

## 📝 Logging

The server logs all important events to console:

```bash
Server running on port 5000
Connected to MongoDB
GET /api/user/profile - 200 OK
POST /api/virtual-doctor/transcribe - 200 OK
```

Monitor these logs during development and production.

## 🚀 Deployment

### Heroku

1. Create Heroku app:
   ```bash
   heroku create your-app-name
   ```

2. Set environment variables:
   ```bash
   heroku config:set OPENAI_API_KEY=your_key
   heroku config:set JWT_SECRET=your_secret
   ```

3. Deploy:
   ```bash
   git push heroku main
   ```

### AWS EC2

1. Launch EC2 instance (Node.js)
2. Clone repository
3. Install dependencies
4. Set environment variables
5. Run with PM2 for process management

### DigitalOcean

1. Create droplet
2. Install Node.js
3. Clone repository
4. Install dependencies
5. Use Nginx as reverse proxy
6. Use systemd for service management

## 📊 Performance Optimization

- Connection pooling for MongoDB
- Caching strategies for frequent queries
- Async/await for non-blocking operations
- Environment-based optimization

## 📞 Support and Issues

### Common Issues

**Database Connection Failed**
- Ensure MongoDB is running
- Check MONGODB_URI format
- Verify firewall settings

**OpenAI API Error**
- Verify API key is correct
- Check API account has credits
- Review rate limits

**CORS Errors**
- Update CLIENT_URL in .env
- Ensure frontend URL is whitelisted

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [JWT Introduction](https://jwt.io/)

## 📝 License

All rights reserved.

## 👥 Development Team

- [@mohitchandra11](https://github.com/mohitchandra11) - Backend Development

## 🔄 Version History

- **v1.0.0** - Initial backend release
  - User authentication with JWT
  - Chat message management
  - Virtual doctor with AI responses
  - Guest chat functionality
  - Emergency detection system
