import sys

sys.path.insert(0, "d:/AIVOA-Customer-Complaint-System/backend")

from app.ai.workflow import complaint_workflow, run_complaint_workflow  # noqa: E402
from app.ai.prompts import (  # noqa: E402
    build_enhancement_prompt,
    build_extraction_prompt,
    build_risk_assessment_prompt,
    build_update_prompt,
)

print("workflow compiled OK")

# Validate prompt builders
ext = build_extraction_prompt("sample text")
assert "{text}" not in ext and "customer_name" in ext
risk = build_risk_assessment_prompt({"product_name": "Paracetamol"})
assert "severity" in risk
upd = build_update_prompt({"status": "open"}, "Close it")
assert "existing_data" not in upd
enh = build_enhancement_prompt({"product_name": "Paracetamol"})
assert "complaint_summary" in enh and "root_cause" in enh and "capa_recommendation" in enh

print("prompt builders OK")

# Inspect graph structure
try:
    graph = complaint_workflow.get_graph()
    print("graph nodes:", list(graph.nodes.keys()))
except Exception as exc:
    print("graph inspect skipped:", exc)

print("ALL CHECKS PASSED")

