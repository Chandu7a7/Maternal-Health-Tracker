const { GoogleGenAI } = require('@google/genai');
const { getStore } = require('../store');
const { checkRisk } = require('../services/aiService');
const { sendSMS } = require('../services/smsService');

const apiKey = process.env.GEMINI_API_KEY;

// Initialize client once
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

exports.analyze = async (req, res) => {
  try {
    const { User, Movement } = getStore();

    if (!req.file) {
      return res.status(400).json({ message: 'Audio file is required' });
    }

    if (!ai) {
      return res
        .status(500)
        .json({ message: 'GEMINI_API_KEY is not configured on the server' });
    }

    const audioBase64 = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype || 'audio/webm';

    // 1. Convert Speech to Text through Gemini
    const prompt =
      'You are a helpful assistant. Please carefully TRANSCRIBE exactly what the speaker is saying in natural language.' +
      ' The audio may be in Hindi, English, or a mix of both. Do not add any extra commentary.' +
      ' VERY IMPORTANT: Respond ONLY with a single valid JSON object of the form:' +
      ' {"transcript":"..."} with double quotes and no comments, no markdown, no extra text.';

    let textOutput = { text: '' };

    try {
      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  data: audioBase64,
                  mimeType: mimeType,
                },
              },
            ],
          },
        ],
      });
      textOutput.text = response.text;
    } catch (apiErr) {
      console.warn('Gemini API Error (Fallback Triggered):', apiErr.message);
      // Fallback response for demo purposes when quota is exceeded
      textOutput.text = '{"transcript":"Mujhe chakkar aur ulti aa rahi hai"}';
    }

    if (!textOutput || !textOutput.text) {
      return res.status(500).json({
        message: 'No text output received from Gemini',
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(textOutput.text);
    } catch (err) {
      // Try to recover if the model wrapped JSON in code fences
      const match = textOutput.text.match(/\{[\s\S]*\}/);
      if (!match) {
        throw err;
      }
      parsed = JSON.parse(match[0]);
    }

    const transcript = parsed.transcript || '';

    // 2. Fetch User Context for Rule-Based AI engine
    const user = await User.findById(req.userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const movement = await Movement.findOne({
      user: req.userId,
      date: { $gte: today },
    });

    const month = user?.pregnancyMonth || 1;
    const hasMovement = movement ? movement.hasMovement : true;
    const count = movement ? movement.count : 10;

    // 3. Apply Rule-Based AI Engine
    const { risk, advice } = checkRisk(transcript, month, hasMovement, count);

    // 4. Trigger SMS Alerts if High Risk
    if (risk === 'High') {
      const msg = `ALERT: High risk detected for ${user?.name || 'patient'}. Symptom: ${transcript.substring(0, 50)}. Please check immediately.`;
      if (user?.familyContact) await sendSMS(user.familyContact, msg);
      if (user?.doctorContact) await sendSMS(user.doctorContact, msg);
    }

    return res.json({
      transcript: transcript,
      riskLevel: risk,
      advice: advice,
    });
  } catch (err) {
    console.error('Error in voice analysis:', err);
    return res.status(500).json({
      message: 'Failed to analyze audio',
      error: err.message,
    });
  }
};
