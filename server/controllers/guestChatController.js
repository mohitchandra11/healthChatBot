const { GoogleGenerativeAI } = require('@google/generative-ai');

// Ensure the API key is loaded
if (!process.env.GEMINI_API_KEY) {
  throw new Error("FATAL ERROR: GEMINI_API_KEY is not set in the .env file.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// This function processes a message from a non-logged-in user.
// It does NOT save anything to the database.
const processGuestMessage = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required.' });
  }

  try {
    const prompt = `You are "Aegis," a helpful AI Health Assistant. Your goal is to provide safe, general health information. NEVER provide a diagnosis. ALWAYS end your response with a clear disclaimer: "Disclaimer: I am an AI assistant. Please consult a doctor for any health concerns." User query: "${message}"`;
    
    // We use the standard generateContent without deep search for guests
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const botResponseText = response.text();

    res.json({ reply: botResponseText });
  } catch (error) {
    console.error("--- Google AI Error in Guest Chat ---", error);
    res.status(500).json({ message: 'Error processing your message with the AI.' });
  }
};

module.exports = { processGuestMessage };
