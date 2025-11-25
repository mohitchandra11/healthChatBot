// Import mongoose to interact with MongoDB
const mongoose = require('mongoose');

// Function to connect to the database
const connectDB = async () => {
  try {
    // Attempt to connect to the MongoDB URI from our environment variables
    // Support both MONGODB_URI (standard) and MONGO_URI (legacy/local)
    const conn = await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // If connection is successful, log it to the console
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If there's an error, log it and exit the application
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with a failure code
  }
};

// Export the function so we can use it in our main server file
module.exports = connectDB;