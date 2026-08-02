from typing import TypedDict

import re
from langgraph.graph import END, StateGraph

from app.ai.groq_client import generate_response
from app.ai.parser import parse_ai_json
from app.ai.prompts import (
    build_enhancement_prompt,
    build_extraction_prompt,
)
from app.ai.risk_engine import assess_risk


class ComplaintWorkflowState(TypedDict):
    text: str
    extracted: dict
    severity: str
    risk_assessment: str
    next_action: str
    complaint_summary: str | None
    root_cause: str | None
    capa_recommendation: str | None
    result: dict


def extract_complaint_node(state: ComplaintWorkflowState) -> dict:
    prompt = build_extraction_prompt(state["text"])
    response = generate_response(prompt)
    extracted = parse_ai_json(response)

    if "error" in extracted:
        extracted = {
            "customer_name": None,
            "customer_email": None,
            "customer_phone": None,
            "product_name": None,
            "batch_number": None,
            "quantity": 0,
            "complaint_description": state["text"],
            "category": None,
            "parse_error": extracted.get("error"),
        }

    # Recover customer phone if AI doesn't return it
    if not extracted.get("customer_phone"):
        match = re.search(
            r"Customer Phone:\s*(.+)",
            state["text"],
            re.IGNORECASE,
        )

        if match:
            extracted["customer_phone"] = match.group(1).strip()

    return {"extracted": extracted}

def risk_assessment_node(state: ComplaintWorkflowState) -> dict:
    risk = assess_risk(state["extracted"])
    return {
        "severity": risk["severity"],
        "risk_assessment": risk["risk_assessment"],
        "next_action": risk["next_action"],
    }


def ai_enhancement_node(state: ComplaintWorkflowState) -> dict:
    complaint_data = {
        **state["extracted"],
        "severity": state["severity"],
        "risk_assessment": state["risk_assessment"],
        "next_action": state["next_action"],
    }
    prompt = build_enhancement_prompt(complaint_data)
    response = generate_response(prompt)
    parsed = parse_ai_json(response)

    if "error" in parsed:
        return {
            "complaint_summary": None,
            "root_cause": None,
            "capa_recommendation": None,
        }

    return {
        "complaint_summary": parsed.get("complaint_summary") or None,
        "root_cause": parsed.get("root_cause") or None,
        "capa_recommendation": parsed.get("capa_recommendation") or None,
    }


def return_final_json_node(state: ComplaintWorkflowState) -> dict:

    extracted = state["extracted"]

    required_fields = [
        "customer_name",
        "customer_email",
        "customer_phone",
        "product_name",
        "batch_number",
        "quantity",
        "complaint_description",
    ]

    missing_fields = []
    completed = 0

    for field in required_fields:
        value = extracted.get(field)

        if value in [None, "", 0]:
            missing_fields.append(field.replace("_", " ").title())
        else:
            completed += 1

    completeness_score = int((completed / len(required_fields)) * 100)

    if completeness_score == 100:
        status = "Complete"
    elif completeness_score >= 70:
        status = "Almost Complete"
    else:
        status = "Incomplete"

    result = {
        **extracted,
        "severity": state["severity"],
        "risk_assessment": state["risk_assessment"],
        "next_action": state["next_action"],

        "complaint_summary": state["complaint_summary"],
        "root_cause": state["root_cause"],
        "capa_recommendation": state["capa_recommendation"],

        "completeness_score": completeness_score,
        "missing_fields": missing_fields,
        "completeness_status": status,
    }

    return {"result": result}


def build_complaint_workflow():
    graph = StateGraph(ComplaintWorkflowState)

    graph.add_node("extract_complaint", extract_complaint_node)
    graph.add_node("risk_assessment", risk_assessment_node)
    graph.add_node("ai_enhancement", ai_enhancement_node)
    graph.add_node("return_final_json", return_final_json_node)

    graph.set_entry_point("extract_complaint")
    graph.add_edge("extract_complaint", "risk_assessment")
    graph.add_edge("risk_assessment", "ai_enhancement")
    graph.add_edge("ai_enhancement", "return_final_json")
    graph.add_edge("return_final_json", END)

    return graph.compile()


complaint_workflow = build_complaint_workflow()


def run_complaint_workflow(text: str) -> dict:
    final_state = complaint_workflow.invoke(
        {
            "text": text,
            "extracted": {},
            "severity": "",
            "risk_assessment": "",
            "next_action": "",
            "complaint_summary": None,
            "root_cause": None,
            "capa_recommendation": None,
            "result": {},
        }
    )
    return final_state["result"]
