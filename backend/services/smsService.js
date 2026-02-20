const twilio = require('twilio');

let client = null;

function init() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (sid && token && from) {
    client = twilio(sid, token);
    return { from };
  }
  return null;
}

const twilioConfig = init();

async function sendSMS(to, body) {
  if (!client || !twilioConfig) {
    console.log('[SMS] Twilio not configured. Would send:', to, body);
    return { ok: true, simulated: true };
  }
  try {
    await client.messages.create({
      body,
      from: twilioConfig.from,
      to: to.startsWith('+') ? to : `+91${to}`,
    });
    return { ok: true };
  } catch (err) {
    console.error('Twilio error:', err.message);
    return { ok: false, error: err.message };
  }
}

module.exports = { sendSMS };
