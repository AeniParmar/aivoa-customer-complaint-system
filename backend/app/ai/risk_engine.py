from app.ai.groq_client import generate_response
from app.ai.parser import parse_ai_json
from app.ai.prompts import build_risk_assessment_prompt

def assess_risk(complaint: dict) -> dict:
    prompt = build_risk_assessment_prompt(complaint)
    response = generate_response(prompt)
    parsed = parse_ai_json(response)
    if "error" in parsed:
        return {
            "severity": "Medium",
            "risk_assessment": "Unable to assess risk automatically. Manual review required.",
            "next_action": "Review complaint manually and assign to quality team.",
            "parse_error": parsed.get("error"),
            "raw_response": parsed.get("raw_response"),
        }

    return {
        "severity": parsed.get("severity") or "Medium",
        "risk_assessment": parsed.get("risk_assessment") or "Risk assessment unavailable.",
        "next_action": parsed.get("next_action") or "Review complaint and determine next steps.",
    }
