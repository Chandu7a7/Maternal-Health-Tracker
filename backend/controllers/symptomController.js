const { getStore } = require('../store');
const { checkRisk } = require('../services/aiService');
const { sendSMS } = require('../services/smsService');

exports.add = async (req, res) => {
  try {
    const { Symptom, User, Movement } = getStore();
    const { symptom } = req.body;
    if (!symptom || !symptom.trim()) {
      return res.status(400).json({ message: 'Symptom text required' });
    }

    // 1. Fetch Context (Month & Movement)
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

    // 2. Perform Rule-Based Risk Analysis
    const { risk, advice } = checkRisk(symptom, month, hasMovement, count);

    // 3. Save Symptom
    const doc = await Symptom.create({
      user: req.userId,
      symptom: symptom.trim(),
      risk,
      advice,
    });

    // 4. Trigger SMS if High Risk
    if (risk === 'High') {
      const msg = `ALERT: High risk detected for ${user?.name || 'patient'}. Symptom: ${symptom.substring(0, 50)}. Please check immediately.`;
      if (user?.familyContact) await sendSMS(user.familyContact, msg);
      if (user?.doctorContact) await sendSMS(user.doctorContact, msg);
    }

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
