COMPLAINT_EXTRACTION_PROMPT = """You are a customer complaint data extraction assistant.

Extract structured complaint information from the text below.

Return JSON only with this exact structure:
{{
  "customer_name": "string or null",
  "customer_email": "string or null",
  "product_name": "string or null",
  "batch_number": "string or null",
  "quantity": 0,
  "complaint_description": "string or null",
  "category": "string or null"
}}

Rules:
- Return valid JSON only. No markdown, no explanation.
- Use null for missing fields.
- quantity must be a number (use 0 if unknown).
- category examples: Quality Issue, Packaging Defect, Delivery Delay, Wrong Product, Contamination, Other.

Complaint text:
{text}
"""


RISK_ASSESSMENT_PROMPT = """You are a pharmaceutical customer complaint risk assessment expert.

Analyze the complaint data below and assess operational and compliance risk.

Return JSON only with this exact structure:
{{
  "severity": "Low | Medium | High | Critical",
  "risk_assessment": "Detailed explanation of the risk",
  "next_action": "Recommended immediate next action"
}}

Rules:
- Return valid JSON only. No markdown, no explanation.
- severity must be one of: Low, Medium, High, Critical.
- Consider product impact, batch scope, patient safety, and regulatory exposure.

Complaint data:
{complaint_data}
"""


COMPLAINT_UPDATE_PROMPT = """You are a customer complaint update assistant.

Update the existing complaint record based on the user's instruction.

Return JSON only with the full updated complaint object using this structure:
{{
  "customer_name": "string or null",
  "customer_email": "string or null",
  "product_name": "string or null",
  "batch_number": "string or null",
  "quantity": 0,
  "complaint_description": "string or null",
  "category": "string or null",
  "severity": "string or null",
  "risk_assessment": "string or null",
  "status": "string or null"
}}

Rules:
- Return valid JSON only. No markdown, no explanation.
- Apply only the changes implied by the user instruction.
- Preserve unchanged fields from the existing data.
- quantity must be a number.

Existing complaint data:
{existing_data}

User instruction:
{user_instruction}
"""


def build_extraction_prompt(text: str) -> str:
    return COMPLAINT_EXTRACTION_PROMPT.format(text=text)


def build_risk_assessment_prompt(complaint_data: dict) -> str:
    return RISK_ASSESSMENT_PROMPT.format(complaint_data=complaint_data)


def build_update_prompt(existing_data: dict, user_instruction: str) -> str:
    return COMPLAINT_UPDATE_PROMPT.format(
        existing_data=existing_data,
        user_instruction=user_instruction,
    )
