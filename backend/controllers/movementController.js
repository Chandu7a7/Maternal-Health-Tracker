const { getStore } = require('../store');

exports.record = async (req, res) => {
  try {
    const { Movement } = getStore();
    const { hasMovement, count } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

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

    res.status(201).json({ hasMovement: doc.hasMovement, count: doc.count, date: doc.date });
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
