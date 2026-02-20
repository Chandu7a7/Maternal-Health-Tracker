const { getStore } = require('../store');
const { checkRisk } = require('../services/aiService');

exports.add = async (req, res) => {
  try {
    const { Symptom } = getStore();
    const { symptom } = req.body;
    if (!symptom || !symptom.trim()) {
      return res.status(400).json({ message: 'Symptom text required' });
    }
    const { risk, advice } = checkRisk(symptom);
    const doc = await Symptom.create({
      user: req.userId,
      symptom: symptom.trim(),
      risk,
      advice,
    });
    res.status(201).json({ symptom: doc.symptom, risk: doc.risk, advice: doc.advice });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const { Symptom } = getStore();
    const symptoms = await Symptom.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json(symptoms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
