const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { SYSTEM_PROMPT, ASSISTANT_INSTRUCTION, EMERGENCY_KEYWORDS } = require('../config/systemPrompt');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Check for emergency keywords
const containsEmergencyKeywords = (text) => {
  return EMERGENCY_KEYWORDS.some(keyword =>
    text.toLowerCase().includes(keyword.toLowerCase())
  );
};

// Chat Endpoint (Text-to-Text only)
router.post('/chat', async (req, res) => {
  console.log("--- Virtual Doctor Chat Request Received ---");
  try {
    const userText = req.body.text;
    const history = req.body.history || []; // Get history from client
    console.log("User Text:", userText);

    // Emergency check
    if (containsEmergencyKeywords(userText)) {
      console.log("Emergency keyword detected");
      return res.json({
        text: "If this is an emergency, call your local emergency number (e.g., 112/911) or go to the nearest emergency room now.",
        isEmergency: true
      });
    }

    // Use Gemini 2.5 Flash model (As requested by user)
    console.log("Initializing Gemini Model: gemini-2.5-flash");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Voice-specific instruction to override strict JSON/Health rules
    const VOICE_INSTRUCTION = `
    You are Dr. Aegis, a professional and efficient Virtual Doctor.
    
    STRICT CONVERSATION FLOW (Follow these phases in order):
    1.  **INTAKE**: Identify the main symptom. If the user states it (e.g., "I have a cough"), acknowledge it briefly and move IMMEDIATELY to Phase 2.
    2.  **INVESTIGATION**: Ask 3-5 specific diagnostic questions to understand the cause (e.g., duration, triggers, other symptoms).
        -   **CRITICAL**: Ask ONLY ONE question at a time. Wait for the user's answer.
        -   **MEMORY**: If the user gives a short answer (e.g., "3 hours", "No"), ACCEPT it and ask the next question.
    3.  **CONCLUSION**: Once you have enough info, provide a clear, home-remedy focused solution.
    
    RULES:
    -   **NO REPETITION**: Do NOT say "I understand", "I'm sorry to hear that", or "I apologize" more than ONCE per conversation. Be direct and professional.
    -   **META-CONVERSATION**: If the user corrects you (e.g., "I already told you"), simply say "My mistake" and correct yourself.
    -   **VAGUE INPUTS**: If the user says something vague (e.g., "you know what", "hello", "I'm confused") or slightly off-topic, DO NOT REFUSE. Instead, ask: "Do you have a specific health concern I can help with?" or "Could you describe your symptoms?"
    -   **CLOSING/GRATITUDE**: If the user says "thank you", "no help needed", or "bye", reply warmly: "No worries. I'm here if you need help. Take care!"
    -   **DISCLAIMER**: End your final solution with: "Please see a doctor if symptoms persist."
    
    FORMAT:
    -   Plain text only.
    -   Short, conversational sentences (1-2 max).
    `;

    // Log history for debugging
    console.log("Incoming History Length:", history.length);
    if (history.length > 0) {
      console.log("Last User Message in History:", history[history.length - 2]?.parts[0]?.text);
    }

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT + "\n" + VOICE_INSTRUCTION }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I will act as Dr. Aegis, following the strict phase protocol." }],
        },
        ...history
      ],
    });

    console.log("Sending message to Gemini...");
    const result = await chat.sendMessage(userText);
    const response = await result.response;
    let text = response.text();

    // Clean up response if it still contains JSON or Markdown
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    try {
      if (text.startsWith('{')) {
        const parsed = JSON.parse(text);
        if (parsed.answer) text = parsed.answer;
      }
    } catch (e) { }

    console.log("Gemini Response:", text);

    res.json({
      text: text,
      isEmergency: false
    });

  } catch (error) {
    console.error('Gemini Chat error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

module.exports = router;