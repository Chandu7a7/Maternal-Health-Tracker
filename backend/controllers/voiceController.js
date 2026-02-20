const { GoogleGenAI } = require('@google/genai');

const apiKey = process.env.GEMINI_API_KEY;

// Initialize client once
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

exports.analyze = async (req, res) => {
  try {
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

    const prompt =
      'You are an experienced obstetrician/gynaecologist analyzing a pregnant woman\'s' +
      ' voice description of her current health and pregnancy symptoms.' +
      ' The audio may be in Hindi, English, or a mix of both.' +
      ' First, carefully TRANSCRIBE exactly what she is saying in natural language.' +
      ' Then, based on the transcript, assess MATERNAL risk level as one of: "Low", "Medium", or "High".' +
      ' Consider red flags like severe abdominal pain, heavy bleeding, absent baby movements, high blood pressure symptoms,' +
      ' seizures, severe headache, vision changes, breathlessness at rest, high fever, or convulsions.' +
      ' Finally, provide clear, empathetic advice in 2–4 sentences in simple language.' +
      ' VERY IMPORTANT: Respond ONLY with a single valid JSON object of the form:' +
      ' {"transcript":"...","riskLevel":"Low|Medium|High","advice":"..."} with double quotes and no comments, no markdown, no extra text.';

    const interaction = await ai.interactions.create({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      input: [
        { type: 'text', text: prompt },
        { type: 'audio', data: audioBase64, mime_type: mimeType },
      ],
    });

    const outputs = interaction.outputs || [];
    const textOutput = outputs.find((o) => o.type === 'text');

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

    const { transcript, riskLevel, advice } = parsed;

    return res.json({
      transcript: transcript || '',
      riskLevel: riskLevel || 'Low',
      advice: advice || '',
    });
  } catch (err) {
    console.error('Error in voice analysis:', err);
    return res.status(500).json({
      message: 'Failed to analyze audio',
      error: err.message,
    });
  }
};

