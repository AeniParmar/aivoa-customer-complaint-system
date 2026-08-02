from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.complaint import ComplaintCreate, ComplaintResponse, ComplaintUpdate
from app.services import complaint_service

router = APIRouter(prefix="/complaints", tags=["Complaints"])


@router.post("", response_model=ComplaintResponse, status_code=status.HTTP_201_CREATED)
def create_complaint(
    complaint_data: ComplaintCreate,
    db: Session = Depends(get_db),
):
    if not complaint_data.force_save:
        duplicate = complaint_service.find_duplicate(
            db,
            complaint_data.customer_name,
            complaint_data.product_name,
            complaint_data.batch_number,
        )
        if duplicate is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={
                    "message": "Duplicate complaint detected",
                    "duplicate": {
                        "customer_name": duplicate.customer_name,
                        "product_name": duplicate.product_name,
                        "batch_number": duplicate.batch_number,
                        "created_at": duplicate.created_at.isoformat()
                        if duplicate.created_at
                        else None,
                    },
                },
            )
    return complaint_service.create_complaint(db, complaint_data)


@router.get("", response_model=list[ComplaintResponse])
def list_complaints(db: Session = Depends(get_db)):
    return complaint_service.get_all_complaints(db)


@router.get("/{complaint_id}", response_model=ComplaintResponse)
def get_complaint(complaint_id: int, db: Session = Depends(get_db)):
    complaint = complaint_service.get_complaint(db, complaint_id)
    if complaint is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Complaint with id {complaint_id} not found",
        )
    return complaint


@router.put("/{complaint_id}", response_model=ComplaintResponse)
def update_complaint(
    complaint_id: int,
    complaint_data: ComplaintUpdate,
    db: Session = Depends(get_db),
):
    complaint = complaint_service.update_complaint(db, complaint_id, complaint_data)
    if complaint is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Complaint with id {complaint_id} not found",
        )
    return complaint


@router.delete("/{complaint_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_complaint(complaint_id: int, db: Session = Depends(get_db)):
    deleted = complaint_service.delete_complaint(db, complaint_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Complaint with id {complaint_id} not found",
        )
