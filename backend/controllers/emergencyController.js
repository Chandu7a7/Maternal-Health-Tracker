const { getStore } = require('../store');
const { sendSMS } = require('../services/smsService');

exports.trigger = async (req, res) => {
  try {
    const { User } = getStore();
    const { message } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const msg = message || `Emergency: ${user.name} (${user.mobile}) - Maternal Health Alert. Please contact immediately.`;
    const results = [];

    if (user.doctorContact) {
      const r = await sendSMS(user.doctorContact, `[Doctor] ${msg}`);
      results.push({ to: user.doctorContact, ok: r.ok });
    }
    if (user.familyContact) {
      const r = await sendSMS(user.familyContact, `[Family] ${msg}`);
      results.push({ to: user.familyContact, ok: r.ok });
    }
    const r = await sendSMS(user.mobile, `Maternal Health Alert: ${msg}`);
    results.push({ to: user.mobile, ok: r.ok });

    res.json({ sent: results.filter((x) => x.ok).length, results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
