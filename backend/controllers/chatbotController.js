const { GoogleGenAI } = require('@google/genai');

const apiKey = process.env.GEMINI_API_KEY;
// Initialize client once
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

exports.chat = async (req, res) => {
  try {
    const { message } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({ reply: 'Please type your question about your health.' });
    }

    if (!ai) {
      return res.status(500).json({ reply: 'GEMINI_API_KEY is not configured on the server. Please add it to .env files.' });
    }

    const prompt =
      'You are a helpful, empathetic, and knowledgeable maternal healthcare assistant.' +
      ' A pregnant woman is asking a question or describing her symptoms.' +
      ' Her message is: "' + message + '".' +
      ' Respond in the same language she used (Hindi, English, or a mix of both).' +
      ' Keep the response concise, clear, and focused on her well-being.' +
      ' If the symptom sounds severe (like severe bleeding, lack of baby movement, extreme pain, seizures, or very high fever), advise her to contact her doctor or visit a hospital immediately.' +
      ' If her message does not make any sense or is gibberish, politely ask her to clarify her question.' +
      ' Provide your reply as plain text without any JSON formatting or extra commentary.';

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: prompt,
    });

    if (response && response.text) {
      return res.json({ reply: response.text });
    } else {
      return res.status(500).json({ reply: 'Sorry, I could not generate a proper response at the moment.' });
    }

  } catch (err) {
    console.error('Error in chatbot analysis:', err);

    let replyMessage = 'Failed to analyze your message. Please try again.';
    if (err.message) {
      replyMessage += ' Error: ' + err.message;
    }

    return res.status(500).json({
      reply: replyMessage,
    });
  }
};

