from fastapi import UploadFile

from app.ai.groq_client import generate_response
from app.ai.parser import parse_ai_json
from app.ai.pdf_reader import extract_pdf_text
from app.ai.prompts import build_update_prompt
from app.ai.workflow import run_complaint_workflow


def extract_complaint(text: str) -> dict:
    return run_complaint_workflow(text)


def update_complaint(existing_data: dict, user_instruction: str) -> dict:
    prompt = build_update_prompt(existing_data, user_instruction)
    response = generate_response(prompt)
    parsed = parse_ai_json(response)

    if "error" in parsed:
        return {
            "error": parsed["error"],
            "raw_response": parsed.get("raw_response"),
            "existing_data": existing_data,
        }

    return parsed


async def extract_from_pdf(pdf_file: UploadFile) -> dict:
    text = await extract_pdf_text(pdf_file)
    if not text:
        return {
            "error": "No text could be extracted from the PDF",
            "extracted_text": "",
        }

    result = extract_complaint(text)
    return {
        "extracted_text": text,
        **result,
    }
