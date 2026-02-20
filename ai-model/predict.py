"""Risk prediction logic - used by FastAPI or can be called directly."""
RISK_HIGH = ["bleeding", "blood", "no movement", "severe pain", "contraction", "water break", "high fever"]
RISK_MEDIUM = ["dizziness", "chakkar", "vomiting", "ulti", "headache", "swelling", "nausea"]


def predict(symptom: str) -> dict:
    t = (symptom or "").lower().strip()
    for kw in RISK_HIGH:
        if kw in t:
            return {"risk": "High", "advice": "Consult doctor immediately."}
    for kw in RISK_MEDIUM:
        if kw in t:
            return {"risk": "Medium", "advice": "Monitor. Consult if persists."}
    return {"risk": "Safe", "advice": "Continue regular care."}
