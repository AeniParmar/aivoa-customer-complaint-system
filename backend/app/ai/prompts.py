COMPLAINT_EXTRACTION_PROMPT = """You are a customer complaint data extraction assistant.

Extract structured complaint information from the text below.

Return JSON only with this exact structure:
{{
  "customer_name": "string or null",
  "customer_email": "string or null",
  "customer_phone": "string or null",
  "product_name": "string or null",
  "batch_number": "string or null",
  "quantity": 0,
  "complaint_description": "string or null",
  "category": "string or null"
}}

Rules:
- Return valid JSON only. No markdown, no explanation.
- Use null for missing fields.
- Extract customer_phone exactly as provided in the complaint text if present; otherwise return null.
- quantity must be a number (use 0 if unknown).
- category examples: Quality Issue, Packaging Defect, Delivery Delay, Wrong Product, Contamination, Other.

Complaint text:
{text}
"""

RISK_ASSESSMENT_PROMPT = """You are a pharmaceutical customer complaint risk assessment expert.

Analyze the complaint data below and determine the operational, product-quality,
patient-safety, and regulatory risk.

You MUST return ONLY a valid JSON object.
Do not return markdown.
Do not return explanations outside the JSON.
Do not wrap the JSON in ```.

Use EXACTLY this structure:

{
  "severity": "High",
  "risk_assessment": "Detailed explanation of the identified risk.",
  "next_action": "Recommended immediate action."
}

IMPORTANT SEVERITY RULES:

The "severity" field MUST contain exactly ONE of these four strings:

"Low"
"Medium"
"High"
"Critical"

Never return:
- "Low | Medium | High | Critical"
- "low"
- "medium"
- "high"
- "critical"
- an array
- an object
- a number
- an empty string

Use these guidelines:

Low:
Minor issue with little or no impact on product quality or patient safety.

Medium:
Potential quality issue requiring investigation but with limited immediate
patient or regulatory impact.

High:
Significant product-quality issue, substantial batch impact, repeated complaints,
or a credible risk to product safety requiring prompt investigation.

Critical:
Potential contamination, serious patient-safety risk, major product failure,
large-scale batch impact, or significant regulatory/compliance exposure requiring
immediate escalation.

Base the severity ONLY on the complaint data provided.
Do not invent facts.

Complaint data:
{complaint_data}
"""


COMPLAINT_ENHANCEMENT_PROMPT = """You are a pharmaceutical customer complaint quality expert.

Analyze the complaint data below and produce an AI-enhanced quality analysis.

Return ONLY a valid JSON object.
Do not return markdown.
Do not return explanations outside the JSON.
Do not wrap the JSON in ```.

Use EXACTLY this structure:

{
  "complaint_summary": null,
  "root_cause": null,
  "capa_recommendation": null
}

Rules:
- complaint_summary must be a concise factual 1-3 sentence summary.
- Base the summary ONLY on the supplied complaint data.
- root_cause should identify the most likely contributing factor only when supported
  by the available information.
- Consider product quality, packaging, handling, distribution, and usage factors.
- If the root cause cannot be determined from the information provided, return null.
- capa_recommendation should provide actionable corrective and preventive actions.
- Do not invent facts.
- Use null when information is insufficient.

Complaint data:
{complaint_data}
"""


COMPLAINT_UPDATE_PROMPT = """You are a customer complaint update assistant.

Update the existing complaint record according to the user's instruction.

Return ONLY a valid JSON object.
Do not return markdown.
Do not return explanations outside the JSON.
Do not wrap the JSON in ```.

Return the complete updated complaint object using EXACTLY these fields:

{
  "customer_name": null,
  "customer_email": null,
  "customer_phone": null,
  "product_name": null,
  "batch_number": null,
  "quantity": 0,
  "complaint_description": null,
  "category": null,
  "severity": null,
  "risk_assessment": null,
  "status": null
}

Rules:
- Apply only the changes requested by the user.
- Preserve every unchanged field from the existing complaint data.
- Do not invent missing information.
- Use null for missing string values.
- quantity must be a number.
- severity, when changed, must be exactly one of:
  "Low",
  "Medium",
  "High",
  "Critical".

Existing complaint data:
{existing_data}

User instruction:
{user_instruction}
"""


def build_extraction_prompt(text: str) -> str:
    return COMPLAINT_EXTRACTION_PROMPT.replace("{text}", text)


def build_risk_assessment_prompt(complaint_data: dict) -> str:
    return RISK_ASSESSMENT_PROMPT.replace(
        "{complaint_data}",
        str(complaint_data),
    )


def build_update_prompt(existing_data: dict, user_instruction: str) -> str:
    prompt = COMPLAINT_UPDATE_PROMPT.replace(
        "{existing_data}",
        str(existing_data),
    )

    prompt = prompt.replace(
        "{user_instruction}",
        user_instruction,
    )

    return prompt


def build_enhancement_prompt(complaint_data: dict) -> str:
    return COMPLAINT_ENHANCEMENT_PROMPT.replace(
        "{complaint_data}",
        str(complaint_data),
    )