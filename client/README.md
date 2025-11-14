# Health Chatbot Frontend

A modern, responsive React application for AI-powered health consultations with voice interaction capabilities. This frontend provides a seamless user experience for medical advice through chat and voice interface.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The application will open at `http://localhost:3000`

## 📁 Project Structure

```
client/
├── public/
│   ├── index.html            # Main HTML file
│   ├── manifest.json         # PWA manifest
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── EmailLoginForm.jsx      # Login form
│   │   │   └── EmailSignupForm.jsx     # Signup form
│   │   ├── chat/
│   │   │   └── ChatWindow.jsx          # Main chat interface
│   │   ├── common/
│   │   │   ├── AuthLayout.jsx          # Auth page layout
│   │   │   ├── AuthModal.jsx           # Auth modal component
│   │   │   ├── Header.jsx              # Page header
│   │   │   ├── Navbar.jsx              # Navigation bar
│   │   │   ├── ProtectedLayout.jsx     # Protected routes layout
│   │   │   └── ProtectedRoute.jsx      # Route protection
│   │   └── dashboard/
│   │       ├── Emergency.jsx           # Emergency panel
│   │       ├── EmergencyCard.jsx       # Emergency alert card
│   │       ├── ProfileSidebar.jsx      # User profile sidebar
│   │       ├── Sidebar.jsx             # Navigation sidebar
│   │       ├── ToolsCard.jsx           # Tools/features card
│   │       └── VirtualDoctor.jsx       # Main virtual doctor UI
│   ├── context/
│   │   ├── AuthContext.js              # Authentication context
│   │   ├── ChatContext.js              # Chat state context
│   │   └── DashboardContext.js         # Dashboard context
│   ├── pages/
│   │   ├── AuthCallbackPage.jsx        # OAuth callback
│   │   ├── DashboardPage.jsx           # Main dashboard
│   │   ├── EmergencyAccessPage.jsx     # Emergency access
│   │   ├── GuestChatPage.jsx           # Guest chat page
│   │   ├── HomePage.jsx                # Landing page
│   │   └── VirtualDoctorGatePage.jsx   # Virtual doctor entry
│   ├── services/
│   │   └── authService.js              # Auth API calls
│   ├── App.jsx                         # Main app component
│   ├── App.css                         # Global styles
│   ├── index.js                        # Entry point
│   ├── index.css                       # Global CSS
│   └── setupTests.js                   # Test configuration
├── package.json
├── tailwind.config.js                  # Tailwind CSS config
├── postcss.config.js                   # PostCSS config
├── build/                              # Production build
└── README.md
```

## 🔧 Installation

### Prerequisites

- Node.js v14.0.0 or higher
- npm v6.0.0 or higher
- Backend server running on http://localhost:5000

### Setup Steps

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_ENV=development
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the client directory:

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

# Google OAuth (if using)
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### Tailwind CSS Configuration

The project uses Tailwind CSS. Configuration is in `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 📦 Dependencies

### Core Dependencies

- **react** (^18.0.0) - UI library
- **react-dom** (^18.0.0) - React DOM
- **react-router-dom** (^6.0.0) - Routing
- **axios** (^1.0.0) - HTTP client
- **react-markdown** (^8.0.0) - Markdown rendering
- **@heroicons/react** (^2.0.0) - Icon library

### Dev Dependencies

- **@testing-library/react** - Testing utilities
- **tailwindcss** (^3.0.0) - Utility CSS
- **postcss** (^8.0.0) - CSS processor
- **autoprefixer** - CSS vendor prefixes

## 🚀 Running the Application

### Development Mode

```bash
npm start
```

- Starts development server at http://localhost:3000
- Hot reloading enabled
- Development tools available

### Build for Production

```bash
npm run build
```

- Creates optimized production build in `build/` folder
- Minified and optimized assets
- Ready for deployment

### Testing

```bash
npm test
```

- Runs tests in watch mode
- Uses Jest and React Testing Library

## 🎨 Project Features

### 1. Authentication System

**Location:** `src/components/auth/` and `src/context/AuthContext.js`

- Email/Password signup and login
- Google OAuth integration
- JWT token management
- Protected routes
- Auto-logout on token expiration

**Usage:**
```jsx
const { currentUser, login, logout } = useAuth();

if (!currentUser) {
  return <LoginForm />;
}
```

### 2. Chat Interface

**Location:** `src/components/chat/ChatWindow.jsx`

- Real-time message exchange
- Message history display
- Responsive chat bubbles
- Auto-scroll to latest message

### 3. Voice Interaction

**Location:** `src/components/dashboard/VirtualDoctor.jsx`

Features:
- Audio recording with MediaRecorder API
- Real-time transcription with Whisper
- AI response generation with GPT-4
- Audio playback of responses
- Voice feedback animations

**Browser Support:**
- Chrome/Edge 49+
- Firefox 25+
- Safari 14.1+

### 4. Emergency Detection

**Location:** `src/components/dashboard/Emergency.jsx`

- Real-time keyword detection
- Emergency alerts
- Emergency contact information
- Quick dial functionality

### 5. Dashboard

**Location:** `src/pages/DashboardPage.jsx`

Components:
- User profile sidebar
- Navigation sidebar
- Main content area
- Chat history
- Virtual doctor panel

### 6. Context Management

**Location:** `src/context/`

Three main contexts:
- **AuthContext** - User authentication state
- **ChatContext** - Chat messages and history
- **DashboardContext** - Dashboard UI state

## 🎯 Key Components

### AuthContext

Manages authentication state and operations:

```javascript
// Hook usage
const { currentUser, login, logout, openAuthModal } = useAuth();

// Methods
login(email, password)
logout()
signup(email, password, name)
openAuthModal(type) // 'login' or 'signup'
```

### VirtualDoctor Component

Main component for voice-based consultation:

```javascript
// Key state
isListening        // Recording status
isProcessing       // Processing status
aiResponse         // AI response text
isEmergency        // Emergency flag
avatarState        // Avatar animation state

// Key methods
startRecording()   // Start audio recording
stopRecording()    // Stop and process audio
processAudio()     // Send to API
```

## 🔐 Security Features

- JWT token storage in localStorage
- Secure API communication
- Protected routes with authentication check
- CORS handling
- Environment variable protection
- XSS prevention through React's built-in protection

## 🎨 Styling

The project uses:

1. **Tailwind CSS** - Utility-first CSS framework
2. **Custom CSS** - Additional styles in `.css` files
3. **Responsive Design** - Mobile-first approach

### Color Scheme

- Primary: Blue
- Secondary: Emerald
- Success: Green
- Warning: Amber
- Danger: Red

### Breakpoints

- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

## 🧪 Testing

### Running Tests

```bash
npm test
```

### Test Files

- `App.test.js` - Main app tests
- Component test files (as needed)

### Test Utilities

- Jest - Test runner
- React Testing Library - Component testing

## 📊 Component Communication

### Data Flow

```
App
├── AuthContext (provides auth state)
├── ChatContext (provides chat state)
├── DashboardContext (provides UI state)
└── Routes
    ├── HomePage
    ├── AuthCallbackPage
    ├── GuestChatPage
    ├── DashboardPage
    │   ├── VirtualDoctor
    │   ├── ChatWindow
    │   └── Dashboard components
    └── EmergencyAccessPage
```

### State Management

- **Local State** - Component-level state (useState)
- **Context API** - Global state (contexts)
- **SessionStorage** - JWT token
- **Browser Cache** - Chat history

## 🚀 Deployment

### Build Output

```bash
npm run build
```

Creates `build/` directory with:
- `index.html` - Main HTML
- `static/js/` - JavaScript files
- `static/css/` - CSS files
- `manifest.json` - PWA manifest

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

### Deploy to GitHub Pages

1. Add to `package.json`:
   ```json
   "homepage": "https://yourusername.github.io/repo-name"
   ```

2. Deploy:
   ```bash
   npm run build
   npm install gh-pages --save-dev
   npm run deploy
   ```

## 🐛 Common Issues

### CORS Errors

**Issue:** "Access to XMLHttpRequest blocked by CORS policy"

**Solution:**
- Ensure backend is running
- Check REACT_APP_API_URL in .env
- Verify backend CORS configuration

### Microphone Access Denied

**Issue:** "Permission denied" when recording audio

**Solution:**
- Allow microphone in browser settings
- Use HTTPS in production
- Check browser microphone permissions

### API Connection Failed

**Issue:** "Failed to fetch" or "Network Error"

**Solution:**
- Verify backend is running on port 5000
- Check API_URL in environment variables
- Check browser console for detailed error

### Build Fails

**Issue:** "npm run build" fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install

# Try build again
npm run build
```

## 📚 File Naming Conventions

- **Components**: PascalCase (e.g., `VirtualDoctor.jsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `useAuth.js`)
- **Utilities**: camelCase (e.g., `authService.js`)
- **CSS**: matching component name (e.g., `App.css`)

## 🎯 Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 Responsive Design

- **Mobile** (< 640px): Stacked layout, full-width components
- **Tablet** (640px - 1024px): Two-column layout
- **Desktop** (> 1024px): Three-column layout

## 🔌 API Integration

### Authentication Endpoints

```javascript
// Login
POST /api/auth/login
{ email, password }

// Signup
POST /api/auth/signup
{ email, password, name }

// Logout
POST /api/auth/logout
```

### Chat Endpoints

```javascript
// Send message
POST /api/chat/send
{ message }

// Get history
GET /api/chat/history

// Virtual doctor
POST /api/virtual-doctor/transcribe
{ audioData }
```

## 📖 Documentation

- Main README: `../README.md`
- Backend README: `../server/README.md`
- Component documentation in JSDoc comments

## 📞 Support

For issues or questions, create an issue in the repository.

## 📝 License

This project is licensed under the MIT License.

## 👥 Development Team

- Frontend Development Team

## 🔄 Version History

- **v1.0.0** - Initial frontend release
  - User authentication
  - Chat interface
  - Voice interaction
  - Emergency detection
  - Dashboard
  - Guest chat mode

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
