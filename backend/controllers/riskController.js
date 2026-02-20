const { getStore } = require('../store');

exports.level = async (req, res) => {
  try {
    const { Symptom, Movement } = getStore();
    const [latestSymptom, todayMovement] = await Promise.all([
      Symptom.findOne({ user: req.userId }).sort({ createdAt: -1 }).lean(),
      Movement.findOne({
        user: req.userId,
        date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }).sort({ date: -1 }).lean(),
    ]);

    let level = 'Safe';
    let advice = 'Continue regular prenatal care.';

    if (latestSymptom?.risk === 'High') {
      level = 'High';
      advice = latestSymptom.advice || 'Please consult your doctor immediately.';
    } else if (latestSymptom?.risk === 'Medium') {
      level = 'Medium';
      advice = latestSymptom.advice || 'Monitor symptoms. Consult doctor if persists.';
    }

    // No movement today = potential High risk
    const today = new Date().toDateString();
    const hasTodayMovement = todayMovement && todayMovement.hasMovement;
    const hasAnyToday = todayMovement !== null;
    if (hasAnyToday && !hasTodayMovement) {
      if (level !== 'High') level = 'High';
      advice = 'No baby movement recorded today. Please consult your doctor.';
    }

    res.json({ level, advice });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
