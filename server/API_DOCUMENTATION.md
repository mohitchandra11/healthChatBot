# API Documentation

Complete API documentation for the Health Chatbot backend server.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer {jwt_token}
```

## Response Format

All responses are in JSON format:

### Success Response
```json
{
  "data": {},
  "message": "Success message",
  "status": 200
}
```

### Error Response
```json
{
  "error": "Error message",
  "status": 400,
  "details": "Additional error details"
}
```

---

## Authentication Endpoints

### Sign Up

Create a new user account.

```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error Responses:**
- `400` - Email already exists
- `400` - Invalid email format
- `400` - Password too weak
- `500` - Server error

**Requirements:**
- Email must be valid and unique
- Password must be at least 8 characters
- Name is required

---

### Log In

Authenticate user with email and password.

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error Responses:**
- `401` - Invalid email or password
- `404` - User not found
- `500` - Server error

---

### Google OAuth Login

Redirect user to Google OAuth.

```http
GET /auth/google
```

Redirects to Google login page. After authentication, user is redirected to callback URL.

---

### Google OAuth Callback

Handle Google OAuth callback.

```http
GET /auth/google/callback?code={authorization_code}
```

**Response (302):**
Redirects to frontend with JWT token in URL parameter.

---

### Log Out

Logout user (invalidate token on client side).

```http
POST /auth/logout
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

## Chat Endpoints

### Send Chat Message

Send a text message to the chat.

```http
POST /chat/send
Authorization: Bearer {token}
Content-Type: application/json

{
  "message": "What should I do for a headache?"
}
```

**Response (201):**
```json
{
  "id": "607f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "message": "What should I do for a headache?",
  "response": "For a headache, you can try...",
  "timestamp": "2025-11-14T10:30:00Z"
}
```

**Error Responses:**
- `400` - Message is empty
- `401` - Unauthorized
- `500` - Server error

**Requirements:**
- Message must not be empty
- Must be authenticated
- Message must be less than 5000 characters

---

### Get Chat History

Retrieve user's chat history.

```http
GET /chat/history
Authorization: Bearer {token}
```

**Query Parameters:**
- `limit` (optional): Number of messages to retrieve (default: 50, max: 100)
- `offset` (optional): Number of messages to skip (default: 0)

**Response (200):**
```json
{
  "chats": [
    {
      "id": "607f1f77bcf86cd799439012",
      "message": "What should I do for a headache?",
      "response": "For a headache, you can try...",
      "timestamp": "2025-11-14T10:30:00Z"
    }
  ],
  "total": 25,
  "limit": 50,
  "offset": 0
}
```

**Error Responses:**
- `401` - Unauthorized
- `500` - Server error

---

### Get Specific Chat

Retrieve a specific chat message.

```http
GET /chat/:chatId
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": "607f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "message": "What should I do for a headache?",
  "response": "For a headache, you can try...",
  "summary": "Pain relief options",
  "action": "Drink water and rest",
  "timestamp": "2025-11-14T10:30:00Z"
}
```

**Error Responses:**
- `401` - Unauthorized
- `404` - Chat not found
- `500` - Server error

---

## Virtual Doctor Endpoints

### Transcribe Audio

Convert audio to text using Whisper API.

```http
POST /virtual-doctor/transcribe
Authorization: Bearer {token}
Content-Type: application/json

{
  "audioData": "data:audio/webm;base64,GkXfo59ChoEBQveWAP7/..."
}
```

**Response (200):**
```json
{
  "text": "What should I do for a fever?",
  "isEmergency": false
}
```

**Error Responses:**
- `400` - No audio data provided
- `400` - Invalid base64 format
- `401` - Unauthorized
- `500` - Transcription failed

**Audio Format:**
- Format: Base64 encoded data URL
- Supported: webm, mp3, mp4, wav
- Max size: 25MB
- Sample rate: 16000 Hz recommended

---

### Get AI Response

Send user text to AI and get response.

```http
POST /virtual-doctor/chat
Authorization: Bearer {token}
Content-Type: application/json

{
  "text": "What should I do for a fever?"
}
```

**Response (200):**
```json
{
  "text": "For a fever, you should...",
  "audio": "base64_encoded_audio_response",
  "isEmergency": false,
  "summary": "Treatment recommendations",
  "action": "Take paracetamol and rest"
}
```

**Error Responses:**
- `400` - Text is empty
- `401` - Unauthorized
- `500` - AI response generation failed

**Response Includes:**
- `text` - Text response from AI
- `audio` - Base64 encoded audio of response
- `isEmergency` - Emergency detected flag
- `summary` - Brief summary of response
- `action` - Recommended action

---

### Combined Audio Chat

Process audio input and get AI response in one call.

```http
POST /virtual-doctor/audio-chat
Authorization: Bearer {token}
Content-Type: application/json

{
  "audioData": "data:audio/webm;base64,GkXfo59ChoEBQveWAP7/..."
}
```

**Response (200):**
```json
{
  "transcribed": "What should I do for a fever?",
  "response": "For a fever, you should...",
  "audio": "base64_encoded_audio_response",
  "isEmergency": false
}
```

**Error Responses:**
- `400` - No audio data provided
- `401` - Unauthorized
- `500` - Processing failed

---

## Guest Chat Endpoints

### Send Guest Message

Send a message without authentication.

```http
POST /guest-chat/send
Content-Type: application/json

{
  "message": "What is a common cold?"
}
```

**Response (201):**
```json
{
  "message": "What is a common cold?",
  "response": "A common cold is...",
  "timestamp": "2025-11-14T10:30:00Z"
}
```

**Error Responses:**
- `400` - Message is empty
- `429` - Rate limit exceeded
- `500` - Server error

**Rate Limiting:**
- 10 requests per minute per IP
- 100 requests per hour per IP

---

## User Endpoints

### Get User Profile

Retrieve authenticated user's profile.

```http
GET /user/profile
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2025-11-01T00:00:00Z",
  "updatedAt": "2025-11-14T10:30:00Z",
  "totalChats": 15
}
```

**Error Responses:**
- `401` - Unauthorized
- `404` - User not found
- `500` - Server error

---

### Update User Profile

Update user's profile information.

```http
PUT /user/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Smith",
  "email": "newemail@example.com"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "newemail@example.com",
    "name": "John Smith",
    "updatedAt": "2025-11-14T10:30:00Z"
  }
}
```

**Error Responses:**
- `400` - Email already taken
- `400` - Invalid email format
- `401` - Unauthorized
- `404` - User not found
- `500` - Server error

**Requirements:**
- Email must be unique if changed
- Name must be 2-100 characters
- Both fields optional (update what you want)

---

## Emergency Keywords

These keywords trigger emergency detection:

- "heart attack"
- "chest pain"
- "stroke"
- "paralysis"
- "severe bleeding"
- "unconscious"
- "difficulty breathing"
- "breathlessness"
- "poisoning"
- "overdose"
- "allergic reaction"
- "anaphylaxis"
- "seizure"
- "convulsion"
- "suicide"
- "self-harm"

When detected, response includes:
```json
{
  "isEmergency": true,
  "emergencyMessage": "If this is an emergency, call your local emergency number (e.g., 112/911) or go to the nearest emergency room now."
}
```

---

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |
| 503 | Service Unavailable - Server temporarily down |

---

## Rate Limiting

API rate limits apply per IP address:

- **Authenticated users**: 100 requests per minute
- **Guest users**: 10 requests per minute
- **Auth endpoints**: 5 requests per minute per IP

Headers included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1605361200
```

---

## CORS

The API accepts requests from:
- `http://localhost:3000` (development)
- `https://yourdomain.com` (production)

Include credentials in cross-origin requests:
```javascript
axios.post(url, data, {
  withCredentials: true,
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## Pagination

Endpoints supporting pagination use these query parameters:

- `limit`: Number of results per page (default: 50, max: 100)
- `offset`: Number of results to skip (default: 0)
- `page`: Page number (alternative to offset)

Response includes:
```json
{
  "data": [],
  "pagination": {
    "total": 100,
    "limit": 50,
    "offset": 0,
    "pages": 2,
    "currentPage": 1
  }
}
```

---

## Filtering and Sorting

Some endpoints support filtering and sorting:

### Chat History Example
```http
GET /chat/history?limit=10&offset=0&sort=-timestamp
```

Sort order:
- `-timestamp` - Newest first
- `timestamp` - Oldest first

---

## Versioning

Current API version: **v1**

Future versions will be available at:
- `/api/v1/...` (current)
- `/api/v2/...` (future)

---

## Examples

### cURL Examples

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Send Chat Message:**
```bash
curl -X POST http://localhost:5000/api/chat/send \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What should I do for a headache?"
  }'
```

### JavaScript (Fetch) Examples

**Login:**
```javascript
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
const data = await response.json();
console.log(data.token);
```

**Send Chat Message:**
```javascript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:5000/api/chat/send', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: 'What should I do for a headache?'
  })
});
const data = await response.json();
console.log(data);
```

---

## Webhooks (Future)

Planned webhook functionality:
- Emergency alerts
- Chat notifications
- User registration events
- API errors

To be implemented in v2.

---

## Support

For API issues or questions:
1. Check this documentation
2. Review error messages in response
3. Check server logs
4. Contact support team

## Version

- API Version: 1.0.0
- Last Updated: November 14, 2025
