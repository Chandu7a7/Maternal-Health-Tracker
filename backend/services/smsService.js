const axios = require("axios");

exports.sendEmergencySMS = async (doctor, family) => {
  try {
    // The user explicitly requested to use these numbers: 7725094650, 909838601
    // We will use the user's numbers if available, otherwise fallback to these hardcoded ones
    const numbers = (doctor || family) ? `${doctor}${family ? ',' + family : ''}` : "7725094650,909838601";

    // Exact payload as requested by user
    const payload = {
      route: "q",
      message: "Emergences Contact this user",
      flash: 0,
      numbers: numbers
    };

    console.log("[SMS] Sending POST to Fast2SMS with payload:", payload);
    console.log(`[SMS] Target Numbers: ${numbers}`);
    console.log(`[SMS] Message: "${payload.message}"`);

    const response = await axios.post("https://www.fast2sms.com/dev/bulkV2", payload, {
      headers: {
        "authorization": process.env.FAST2SMS_API_KEY,
        "Content-Type": "application/json"
      }
    });

    console.log("[SMS] Fast2SMS Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("[SMS] Error details:", error.response?.data || error.message);
    return null;
  }
};
