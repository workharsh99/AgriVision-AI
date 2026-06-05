import { getChatbotResponse } from '../services/geminiService.js';

// Receives chat messages and sends them along with history to the Gemini chatbot service
export const sendChatMessage = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Please provide a message.' });
    }

    const chatHistory = history || [];
    const aiResponse = await getChatbotResponse(chatHistory, message);

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error in chatbot controller:', error);
    res.status(500).json({ message: 'Failing to connect to AI assistant.' });
  }
};
