// Import core Node.js packages
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');

// Import local modules
const connectDB = require('./config/db');

// --- INITIAL CONFIGURATION ---

// Load environment variables from the .env file into process.env
dotenv.config();

// Execute the passport configuration file to set up the Google strategy
require('./config/passport-setup');

// --- DATABASE CONNECTION ---

// Call the function to establish the connection to your MongoDB database
connectDB();

// --- EXPRESS APP INITIALIZATION ---

// Create an instance of the Express application
const app = express();

// --- MIDDLEWARE SETUP ---

// Configure Cross-Origin Resource Sharing (CORS)
const corsOptions = {
  origin: process.env.CLIENT_URL || '*', // Use env var for production security
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'], // Explicitly allow the Authorization header for JWT
};
app.use(cors(corsOptions));

// Enable the Express app to parse JSON formatted request bodies
app.use(express.json());

// Initialize Passport middleware to enable Google OAuth
app.use(passport.initialize());

// --- API ROUTES ---

// A simple root route to confirm the API is running
app.get('/', (req, res) => {
  res.send('API is running successfully!');
});

// Mount all the different API route modules
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/guest-chat', require('./routes/guestChatRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/virtual-doctor', require('./routes/virtualDoctor'));


// --- SERVER LISTENER ---

// Define the port the server will run on. It uses the PORT from the .env file,
// or defaults to 5000 if it's not defined.
const PORT = process.env.PORT || 5000;

// This is the critical command that starts the server and makes it "listen"
// for incoming requests on the specified port.
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));