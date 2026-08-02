# AI Enhancement Feature - TODO

## Plan

1. Add `COMPLAINT_ENHANCEMENT_PROMPT` + `build_enhancement_prompt()` in `backend/app/ai/prompts.py`.
2. Extend LangGraph in `backend/app/ai/workflow.py`:
   - Add `ai_enhancement` node between `risk_assessment` and `return_final_json`.
   - Generate `complaint_summary`, `root_cause`, `capa_recommendation` (null on failure, no throw).
   - Keep all existing fields unchanged.
3. Display new fields in `frontend/src/components/ai/AIResult.jsx`.
4. Verify backend imports/starts and frontend builds.

## Steps

- [x] Gather context (read AI prompts, parser, workflow, services, routes, frontend components)
- [x] Get plan approval
- [x] Edit `backend/app/ai/prompts.py` - add enhancement prompt + builder
- [x] Edit `backend/app/ai/workflow.py` - add `ai_enhancement` node, extend state, update final JSON
- [x] Edit `frontend/src/components/ai/AIResult.jsx` - display 3 new fields
- [ ] Backend imports/compiles successfully
- [ ] Backend starts successfully
- [ ] Frontend builds successfully (`npm run build`)
- [ ] Provide modified files + verification results

