const { GoogleGenerativeAI } = require('@google/generative-ai');
const Chat = require('../models/Chat');

if (!process.env.GEMINI_API_KEY) {
  throw new Error("FATAL ERROR: GEMINI_API_KEY is not set in the .env file.");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Virtual Doctor streaming chat
const virtualDoctorStream = async (req, res) => {
  const { message } = req.body;

  try {
    // Set headers for streaming response
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');

    const prompt = `You are an AI doctor assistant. Respond to this health-related query professionally and empathetically: ${message}`;
    
    const result = await model.generateContentStream(prompt);

    // Stream the response
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      res.write(chunkText);
    }

    res.end();
  } catch (error) {
    console.error('Streaming Error:', error);
    res.status(500).json({ message: 'Error in streaming response' });
  }
};

// --- Controller Functions ---
const getChats = async (req, res) => {
    try {
        const chats = await Chat.find({ user: req.user.id }).sort({ updatedAt: -1 });
        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Server Error while fetching chats.' });
    }
};

const createChat = async (req, res) => {
    try {
        const newChat = new Chat({ user: req.user.id, title: 'New Chat' });
        const savedChat = await newChat.save();
        res.status(201).json(savedChat);
    } catch (error) {
        res.status(500).json({ message: 'Server Error while creating chat.' });
    }
};

const deleteChat = async (req, res) => {
    try {
        const result = await Chat.deleteOne({ _id: req.params.id, user: req.user.id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        res.json({ message: 'Chat removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error while deleting chat.' });
    }
};

const updateChat = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) { return res.status(400).json({ message: 'Title is required' }); }
        const updatedChat = await Chat.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { title: title.trim() },
            { new: true }
        );
        if (!updatedChat) { return res.status(404).json({ message: 'Chat not found' }); }
        res.json(updatedChat);
    } catch (error) {
        res.status(500).json({ message: 'Server Error while updating chat.' });
    }
};

const addMessage = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat || chat.user.toString() !== req.user.id.toString()) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    const userMessage = { sender: 'user', content: req.body.message };
    chat.messages.push(userMessage);

    const prompt = `You are "Aegis," a helpful AI Health Assistant. Your goal is to provide safe, general health information based on real-world data from the internet. NEVER provide a diagnosis or prescribe medication. ALWAYS end your response with a clear disclaimer: "Disclaimer: I am an AI assistant. Please consult a doctor for any health concerns." User query: "${req.body.message}"`;
    
    // --- THIS IS THE UPGRADE FOR DEEP SEARCH ---
    const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        tools: [{
            "google_search": {} // This enables the grounding (deep search) feature
        }],
    });
    // --- END OF UPGRADE ---

    const response = await result.response;
    const botResponseText = response.text();

    // Extract the search sources from the AI's response
    let sources = [];
    if (response.groundingMetadata && response.groundingMetadata.groundingAttributions) {
        sources = response.groundingMetadata.groundingAttributions
            .map(attribution => ({
                uri: attribution.web?.uri,
                title: attribution.web?.title,
            }))
            .filter(source => source.uri && source.title);
    }

    const botMessage = { sender: 'bot', content: botResponseText, sources: sources };
    chat.messages.push(botMessage);
    
    if (chat.messages.length <= 2) {
      const titlePrompt = `Create a short, 3-5 word title for this conversation: "${req.body.message}"`;
      const titleResult = await model.generateContent(titlePrompt);
      chat.title = (await titleResult.response.text()).replace(/"/g, '').trim();
    }
    await chat.save();
    
    res.json(chat);
  } catch (error) {
    console.error("--- Google AI or DATABASE ERROR in addMessage ---", error);
    res.status(500).json({ message: 'Error processing your message with the AI.' });
  }
};

module.exports = { getChats, createChat, addMessage, deleteChat, updateChat, virtualDoctorStream };
