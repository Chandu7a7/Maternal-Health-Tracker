const { getStore } = require('../store');
const { checkRisk } = require('../services/aiService');
const { sendSMS } = require('../services/smsService');

exports.record = async (req, res) => {
  try {
    const { Movement, User } = getStore();
    const { hasMovement, count } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const user = await User.findById(req.userId);

    let doc = await Movement.findOne({
      user: req.userId,
      date: { $gte: today },
    });

    if (doc) {
      doc.hasMovement = hasMovement;
      doc.count = count ?? (hasMovement ? (doc.count || 0) + 1 : doc.count || 0);
      doc.date = new Date();
      if (typeof doc.save === 'function') await doc.save();
    } else {
      doc = await Movement.create({
        user: req.userId,
        hasMovement,
        count: count ?? (hasMovement ? 1 : 0),
      });
    }

    // AI Check for Consecutive Days No Movement
    let risk = 'Safe';
    let advice = '';

    // Check last 2 days
    const last2Days = await Movement.find({ user: req.userId })
      .sort({ date: -1 })
      .limit(2)
      .lean();

    const noMovementConsecutive = last2Days.length >= 2 && last2Days.every(m => !m.hasMovement);

    // Get Risk from AI Service (Combines month + currently recorded movement)
    const aiResult = checkRisk('', user?.pregnancyMonth || 1, hasMovement, doc.count);
    risk = aiResult.risk;
    advice = aiResult.advice;

    if (noMovementConsecutive) {
      risk = 'High';
      advice = 'CRITICAL: No baby movement for 2 consecutive days. Emergency Checkup Required!';
    }

    // Trigger SMS if High Risk
    if (risk === 'High') {
      const msg = `ALERT: High risk detected for ${user?.name}. Reason: ${advice}. Movement Count: ${doc.count}.`;
      if (user?.familyContact) await sendSMS(user.familyContact, msg);
      if (user?.doctorContact) await sendSMS(user.doctorContact, msg);
    }

    res.status(201).json({
      hasMovement: doc.hasMovement,
      count: doc.count,
      date: doc.date,
      risk,
      advice
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const { Movement } = getStore();
    const movements = await Movement.find({ user: req.userId })
      .sort({ date: -1 })
      .limit(30)
      .lean();
    res.json(movements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
