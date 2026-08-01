from typing import Any

from fastapi import APIRouter, File, HTTPException, UploadFile, status
from pydantic import BaseModel, Field

from app.services import ai_service

router = APIRouter(prefix="/ai", tags=["AI"])


class ExtractRequest(BaseModel):
    text: str = Field(..., min_length=1)


class UpdateRequest(BaseModel):
    existing_data: dict[str, Any]
    user_instruction: str = Field(..., min_length=1)


@router.post("/extract")
def extract_complaint(request: ExtractRequest):
    try:
        return ai_service.extract_complaint(request.text)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI extraction failed: {exc}",
        ) from exc


@router.post("/update")
def update_complaint(request: UpdateRequest):
    try:
        result = ai_service.update_complaint(
            request.existing_data,
            request.user_instruction,
        )
        if "error" in result:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=result["error"],
            )
        return result
    except HTTPException:
        raise
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI update failed: {exc}",
        ) from exc


@router.post("/upload-pdf")
async def upload_pdf(pdf_file: UploadFile = File(...)):
    if pdf_file.content_type not in {"application/pdf", "application/x-pdf"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported",
        )

    try:
        result = await ai_service.extract_from_pdf(pdf_file)
        if "error" in result and "customer_name" not in result:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result["error"],
            )
        return result
    except HTTPException:
        raise
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"PDF extraction failed: {exc}",
        ) from exc
