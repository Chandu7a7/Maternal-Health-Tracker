// Rule-based risk detection (no ML training)
const RISK_RULES = {
  high: [
    'bleeding', 'blood', 'खून', 'no movement', 'movement nahi', 'हिलावट नहीं',
    'severe pain', 'intense pain', 'गंभीर दर्द', 'contraction', 'संकुचन',
    'water break', 'पानी छूट', 'high fever', 'बुखार',
  ],
  medium: [
    'dizziness', 'chakkar', 'चक्कर', 'vomiting', 'ulti', 'उल्टी',
    'headache', 'सिर दर्द', 'swelling', 'सूजन', 'shortness of breath',
    'सांस फूलना', 'nausea', 'मिचली',
  ],
};

function normalize(text) {
  return (text || '').toLowerCase().trim();
}

function checkRisk(symptomText) {
  const t = normalize(symptomText);
  for (const kw of RISK_RULES.high) {
    if (t.includes(kw)) {
      return {
        risk: 'High',
        advice: 'Please consult your doctor immediately. If urgent, visit nearest hospital.',
      };
    }
  }
  for (const kw of RISK_RULES.medium) {
    if (t.includes(kw)) {
      return {
        risk: 'Medium',
        advice: 'Monitor your symptoms. Consult doctor if it persists or worsens.',
      };
    }
  }
  return {
    risk: 'Safe',
    advice: 'Continue regular prenatal care. Stay hydrated and rest well.',
  };
}

module.exports = { checkRisk };
