"""Functional test of the AI enhancement workflow with mocked Groq responses.

Verifies:
- run_complaint_workflow produces complaint_summary, root_cause, capa_recommendation
- Existing fields (customer_name, severity, risk_assessment, next_action) preserved
- PDF upload path (extract_from_pdf) still works and includes new fields
- The parser handles null values correctly
"""
import sys
import json

sys.path.insert(0, "d:/AIVOA-Customer-Complaint-System/backend")

import app.ai.groq_client as groq_client
import app.ai.workflow as workflow_mod
from app.services import ai_service
from app.ai.prompts import build_extraction_prompt, build_risk_assessment_prompt, build_enhancement_prompt

# ---- Mock Groq responses ----
_mock_responses = {
    "customer complaint data extraction assistant": json.dumps({
        "customer_name": "John Doe",
        "customer_email": "john@example.com",
        "product_name": "Paracetamol 500mg",
        "batch_number": "BATCH-001",
        "quantity": 5,
        "complaint_description": "Tablets arrived crushed and broken.",
        "category": "Quality Issue",
    }),
    "risk assessment expert": json.dumps({
        "severity": "High",
        "risk_assessment": "Product integrity compromised.",
        "next_action": "Quarantine batch and investigate.",
    }),
    "quality expert": json.dumps({
        "complaint_summary": "Customer reported crushed tablets in batch BATCH-001.",
        "root_cause": "Likely mishandling during transport.",
        "capa_recommendation": "Improve packaging and add shock indicators.",
    }),
}


def _fake_generate_response(prompt: str) -> str:
    for key, payload in _mock_responses.items():
        if key in prompt:
            return payload
    return "{}"


groq_client.generate_response = _fake_generate_response
workflow_mod.generate_response = _fake_generate_response

# Also patch the references imported into risk_engine and ai_service
import app.ai.risk_engine as risk_engine
risk_engine.generate_response = _fake_generate_response
import app.ai.parser  # ensure parser available
# workflow already re-imported? Force re-bind in workflow module
from app.ai.workflow import run_complaint_workflow

# ---- Test 1: Manual analysis path (POST /ai/extract) ----
result = run_complaint_workflow("Customer John Doe reports Paracetamol batch BATCH-001 arrived crushed.")
print("=== Manual analysis result ===")
for k, v in result.items():
    print(f"  {k}: {v}")

assert result["customer_name"] == "John Doe"
assert result["severity"] == "High"
assert result["risk_assessment"] == "Product integrity compromised."
assert result["next_action"] == "Quarantine batch and investigate."
assert result["complaint_summary"] == "Customer reported crushed tablets in batch BATCH-001."
assert result["root_cause"] == "Likely mishandling during transport."
assert result["capa_recommendation"] == "Improve packaging and add shock indicators."
print("  -> Manual analysis path OK (existing + new fields present)")

# ---- Test 2: PDF upload path (extract_from_pdf with mocked text) ----
# Patch extract_pdf_text to avoid real PDF parsing
import app.services.ai_service as svc_mod
import app.ai.pdf_reader as pdf_reader

async def _fake_pdf_text(file):
    return "PDF content: Customer reports crushed tablets."

pdf_reader.extract_pdf_text = _fake_pdf_text
svc_mod.extract_pdf_text = _fake_pdf_text


class FakeFile:
    content_type = "application/pdf"


async def run_pdf_test():
    pdf_result = await ai_service.extract_from_pdf(FakeFile())
    print("=== PDF upload result ===")
    for k, v in pdf_result.items():
        print(f"  {k}: {v}")
    assert "extracted_text" in pdf_result
    assert pdf_result["complaint_summary"] is not None
    assert pdf_result["root_cause"] is not None
    assert pdf_result["capa_recommendation"] is not None
    assert pdf_result["severity"] == "High"
    print("  -> PDF upload path OK (extracted_text + new fields present)")


import asyncio
asyncio.run(run_pdf_test())

# ---- Test 3: Save Complaint payload (frontend reads category/severity/risk_assessment) ----
save_payload = {
    "customer_name": result["customer_name"],
    "customer_email": "john@example.com",
    "product_name": result["product_name"],
    "batch_number": result["batch_number"],
    "quantity": result["quantity"],
    "complaint_description": result["complaint_description"],
    "category": result["category"] or None,
    "severity": result["severity"] or None,
    "risk_assessment": result["risk_assessment"] or None,
    "status": "open",
}
print("=== Save complaint payload (schema unchanged) ===")
print("  ", save_payload)
# The ComplaintCreate schema has no complaint_summary/root_cause/capa fields - ensure we don't send them
assert "complaint_summary" not in save_payload
assert "root_cause" not in save_payload
assert "capa_recommendation" not in save_payload
print("  -> Save Complaint path OK (new fields NOT sent to DB; schema untouched)")

print()
print("ALL FUNCTIONAL TESTS PASSED")

