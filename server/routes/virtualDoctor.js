const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const { Configuration, OpenAIApi } = require("openai");
const { SYSTEM_PROMPT, ASSISTANT_INSTRUCTION, EMERGENCY_KEYWORDS } = require('../config/systemPrompt');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure file handling
const handleBase64Audio = (base64Data) => {
  const matches = base64Data.match(/^data:audio\/([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 audio data');
  }
  const fileType = matches[1];
  const base64Buffer = matches[2];
  const filePath = path.join(uploadsDir, `audio-${Date.now()}.${fileType}`);
  fs.writeFileSync(filePath, Buffer.from(base64Buffer, 'base64'));
  return filePath;
};

// Check for emergency keywords
const containsEmergencyKeywords = (text) => {
  return EMERGENCY_KEYWORDS.some(keyword => 
    text.toLowerCase().includes(keyword.toLowerCase())
  );
};

// Transcribe audio using Whisper
router.post('/transcribe', async (req, res) => {
  let audioFilePath = null;
  try {
    console.log('Received transcribe request');
    
    if (!req.body.audioData) {
      console.log('No audio data in request');
      return res.status(400).json({ error: 'No audio data provided' });
    }

    console.log('Audio data length:', req.body.audioData.length);
    
    try {
      // Save base64 audio to file
      audioFilePath = handleBase64Audio(req.body.audioData);
      console.log('Audio saved to:', audioFilePath);

      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(audioFilePath),
        model: 'whisper-1',
      });
      console.log('Transcription completed:', transcription.text);

      if (containsEmergencyKeywords(transcription.text)) {
        return res.json({
          text: transcription.text,
          isEmergency: true,
          emergencyMessage: "If this is an emergency, call your local emergency number (e.g., 112/911) or go to the nearest emergency room now."
        });
      }

      res.json({ text: transcription.text, isEmergency: false });
    } finally {
      // Clean up the audio file
      if (audioFilePath && fs.existsSync(audioFilePath)) {
        try {
          fs.unlinkSync(audioFilePath);
          console.log('Cleaned up audio file:', audioFilePath);
        } catch (cleanupError) {
          console.error('Error cleaning up audio file:', cleanupError);
        }
      }
    }
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

// Get AI response
router.post('/chat', async (req, res) => {
  try {
    const userText = req.body.text;
    
    // Emergency check first
    if (containsEmergencyKeywords(userText)) {
      return res.json({
        text: "If this is an emergency, call your local emergency number (e.g., 112/911) or go to the nearest emergency room now.",
        isEmergency: true
      });
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: ASSISTANT_INSTRUCTION },
      { role: "user", content: userText }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      temperature: 0.2,
      max_tokens: 300,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    const assistantText = completion.choices[0]?.message?.content || "Sorry, I couldn't respond.";

    // Generate speech from the response
    const speechResponse = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: assistantText.split('\n')[0] // Only convert the actual response to speech, not the JSON
    });

    // Convert the audio buffer to base64
    const audioBuffer = await speechResponse.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');

    res.json({
      text: assistantText,
      audio: audioBase64,
      isEmergency: false
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

module.exports = router;