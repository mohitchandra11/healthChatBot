const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // Password is not strictly required at the schema level
      // because Google users won't have one.
    },
    country: {
      type: String,
      required: true,
    },
    googleId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to hash the password BEFORE it's saved to the database
userSchema.pre('save', async function (next) {
  // We only want to hash the password if it's a new user with a password,
  // or if an existing user is changing their password.
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  // If a password is provided, hash it.
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;