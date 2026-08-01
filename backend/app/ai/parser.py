import json
import re


def _strip_code_fence(text: str) -> str:
    cleaned = text.strip()
    fence_match = re.match(r"^```(?:json)?\s*(.*?)\s*```$", cleaned, re.DOTALL | re.IGNORECASE)
    if fence_match:
        return fence_match.group(1).strip()
    return cleaned


def parse_ai_json(response: str) -> dict:
    if not response or not response.strip():
        return {
            "error": "Empty AI response",
            "raw_response": response,
        }

    cleaned = _strip_code_fence(response)

    try:
        parsed = json.loads(cleaned)
    except json.JSONDecodeError:
        return {
            "error": "Invalid JSON response from AI",
            "raw_response": response,
        }

    if not isinstance(parsed, dict):
        return {
            "error": "AI response is not a JSON object",
            "raw_response": response,
        }

    return parsed
