"""
Rule-based risk prediction API (no ML training).
Replace with trained model later.
"""
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="Maternal Health Risk API")

RISK_HIGH = ["bleeding", "blood", "no movement", "movement nahi", "severe pain", "contraction", "water break", "high fever"]
RISK_MEDIUM = ["dizziness", "chakkar", "vomiting", "ulti", "headache", "swelling", "nausea"]


class SymptomInput(BaseModel):
    symptom: str


class RiskOutput(BaseModel):
    risk: str
    advice: str


def check_risk(text: str) -> dict:
    t = (text or "").lower().strip()
    for kw in RISK_HIGH:
        if kw in t:
            return {"risk": "High", "advice": "Please consult your doctor immediately."}
    for kw in RISK_MEDIUM:
        if kw in t:
            return {"risk": "Medium", "advice": "Monitor symptoms. Consult doctor if persists."}
    return {"risk": "Safe", "advice": "Continue regular prenatal care."}


@app.post("/predict", response_model=RiskOutput)
def predict(item: SymptomInput):
    return check_risk(item.symptom)


@app.get("/health")
def health():
    return {"ok": True}
