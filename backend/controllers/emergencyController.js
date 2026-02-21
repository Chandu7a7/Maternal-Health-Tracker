const { getStore } = require("../store");
const { sendEmergencySMS } = require("../services/smsService");

exports.triggerEmergency = async (req, res) => {
  try {
    const { User } = getStore();
    // In our middleware, req.userId is used. User suggested req.body.userId, but we use req.userId for security.
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`[Emergency] Triggering alert for ${user.name}`);

    await sendEmergencySMS(
      user.doctorContact,
      user.familyContact
    );

    res.json({ success: true, message: "Emergency SMS Sent" });
  } catch (error) {
    console.error("[Emergency] Error:", error);
    res.status(500).json({ message: "Failed to send emergency alert" });
  }
};
