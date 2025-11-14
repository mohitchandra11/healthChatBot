const mongoose = require('mongoose');

// This defines the structure for a single web source,
// which is used for the "Deep Search" feature to cite sources.
const sourceSchema = new mongoose.Schema({
  uri: String,
  title: String,
});

// This defines the structure for a single message within a chat.
const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'bot'], // A message can only be from the 'user' or the 'bot'.
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  sources: [sourceSchema], // An array to hold the source links for an AI's response.
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// This is the main schema for an entire chat conversation session.
const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // This links the chat to a specific user.
      required: true,
      ref: 'User', // The 'ref' tells Mongoose that this ID points to a document in the 'User' collection.
    },
    title: {
      type: String,
      required: true,
      default: 'New Chat', // A default title for newly created conversations.
    },
    messages: [messageSchema], // Each chat document contains an array of message documents.
  },
  {
    timestamps: true, // This automatically adds 'createdAt' and 'updatedAt' fields to each chat.
  }
);

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;

