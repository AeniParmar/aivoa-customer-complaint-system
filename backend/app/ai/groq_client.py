from groq import Groq

from app.core.config import settings

MODEL_NAME = "openai/gpt-oss-120b"
MODEL_NAME = "openai/gpt-oss-120b"
_client: Groq | None = None


def _get_client() -> Groq:
    global _client
    if _client is None:
        if not settings.GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY is not set in environment variables")
        _client = Groq(api_key=settings.GROQ_API_KEY)
    return _client


def generate_response(prompt: str) -> str:
    client = _get_client()
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
    )
    content = response.choices[0].message.content
    return content.strip() if content else ""
