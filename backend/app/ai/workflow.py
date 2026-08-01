from typing import TypedDict

from langgraph.graph import END, StateGraph

from app.ai.groq_client import generate_response
from app.ai.parser import parse_ai_json
from app.ai.prompts import build_extraction_prompt
from app.ai.risk_engine import assess_risk


class ComplaintWorkflowState(TypedDict):
    text: str
    extracted: dict
    severity: str
    risk_assessment: str
    next_action: str
    result: dict


def extract_complaint_node(state: ComplaintWorkflowState) -> dict:
    prompt = build_extraction_prompt(state["text"])
    response = generate_response(prompt)
    extracted = parse_ai_json(response)

    if "error" in extracted:
        extracted = {
            "customer_name": None,
            "customer_email": None,
            "product_name": None,
            "batch_number": None,
            "quantity": 0,
            "complaint_description": state["text"],
            "category": None,
            "parse_error": extracted.get("error"),
        }

    return {"extracted": extracted}


def risk_assessment_node(state: ComplaintWorkflowState) -> dict:
    risk = assess_risk(state["extracted"])
    return {
        "severity": risk["severity"],
        "risk_assessment": risk["risk_assessment"],
        "next_action": risk["next_action"],
    }


def return_final_json_node(state: ComplaintWorkflowState) -> dict:
    result = {
        **state["extracted"],
        "severity": state["severity"],
        "risk_assessment": state["risk_assessment"],
        "next_action": state["next_action"],
    }
    return {"result": result}


def build_complaint_workflow():
    graph = StateGraph(ComplaintWorkflowState)

    graph.add_node("extract_complaint", extract_complaint_node)
    graph.add_node("risk_assessment", risk_assessment_node)
    graph.add_node("return_final_json", return_final_json_node)

    graph.set_entry_point("extract_complaint")
    graph.add_edge("extract_complaint", "risk_assessment")
    graph.add_edge("risk_assessment", "return_final_json")
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
            "result": {},
        }
    )
    return final_state["result"]
