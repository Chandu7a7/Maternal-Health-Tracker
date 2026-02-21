// Rule-based risk detection
const RISK_RULES = {
  high: [
    'bleeding', 'blood', 'खून', 'no movement', 'movement nahi', 'हिलावट नहीं',
    'severe pain', 'intense pain', 'गंभीर दर्द', 'contraction', 'संकुचन',
    'water break', 'पानी छूट', 'high fever', 'बुखार', 'fiver', 'seizure'
  ],
  medium: [
    'dizziness', 'chakkar', 'चक्कर', 'vomiting', 'ulti', 'उल्टी',
    'headache', 'सिर दर्द', 'swelling', 'सूजन', 'shortness of breath',
    'सांस फूलना', 'nausea', 'मिचली', 'fever', 'cough'
  ],
};

function normalize(text) {
  return (text || '').toLowerCase().trim();
}

/**
 * AI system combines:
 * 1. Symptoms
 * 2. Pregnancy Month
 * 3. Baby Movement
 */
function checkRisk(symptomText, pregnancyMonth = 1, hasMovement = true, movementCount = 10) {
  const t = normalize(symptomText);
  let riskLevel = 'Safe';
  let matchedHigh = false;
  let matchedMedium = false;

  if (t === 'hi' || t === 'hello') {
    return {
      risk: 'Safe',
      advice: 'Hello! Please type or speak your actual symptoms so I can analyze them for you.',
    };
  }

  // Check specific rules
  for (const kw of RISK_RULES.high) {
    if (t.includes(kw)) matchedHigh = true;
  }
  for (const kw of RISK_RULES.medium) {
    if (t.includes(kw)) matchedMedium = true;
  }

  // Rule 1: High risk keyword immediately triggers High Risk
  if (matchedHigh) {
    riskLevel = 'High';
  }
  // Rule 2: Medium risk keyword
  else if (matchedMedium) {
    // Stage check: Late pregnancy (7-9) makes medium symptoms high risk.
    if (pregnancyMonth >= 7) {
      riskLevel = 'High';
    } else {
      riskLevel = 'Medium';
    }
  }

  // Rule 3: Baby movement Check
  // Logic: 10+ Safe, 5-9 Medium, 0-4 High
  if (hasMovement === false || movementCount <= 4) {
    riskLevel = 'High';
  } else if (movementCount >= 5 && movementCount <= 9) {
    if (riskLevel === 'Safe') riskLevel = 'Medium';
  }
  // 10+ stays Safe (unless overriding symptom rules apply)

  // Generate Advice
  let advice = '';
  if (riskLevel === 'High') {
    if (hasMovement === false || movementCount === 0) {
      advice = 'CRITICAL: No baby movement felt. Please consult your doctor IMMEDIATELY or visit the nearest hospital.';
    } else {
      advice = 'Emergency Alert: High Risk Condition (Reduced Movement). Please consult your doctor IMMEDIATELY.';
    }
  } else if (riskLevel === 'Medium') {
    advice = 'Observation recommended. Baby movement is slightly low. Monitor closely and take rest.';
  } else {
    advice = 'Everything looks good! Baby movement is normal. Continue regular care.';
  }

  return { risk: riskLevel, advice };
}

module.exports = { checkRisk };
