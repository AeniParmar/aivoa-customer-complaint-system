from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.complaint import Complaint
from app.schemas.complaint import ComplaintCreate, ComplaintUpdate


def find_duplicate(
    db: Session,
    customer_name: str,
    product_name: str,
    batch_number: str,
) -> Complaint | None:
    return (
        db.query(Complaint)
        .filter(
            func.lower(Complaint.customer_name) == customer_name.strip().lower(),
            func.lower(Complaint.product_name) == product_name.strip().lower(),
            func.lower(Complaint.batch_number) == batch_number.strip().lower(),
        )
        .order_by(Complaint.created_at.desc())
        .first()
    )


def create_complaint(db: Session, complaint_data: ComplaintCreate) -> Complaint:
    data = complaint_data.model_dump(exclude={"force_save"})
    complaint = Complaint(**data)
    db.add(complaint)
    db.commit()
    db.refresh(complaint)
    return complaint


def get_all_complaints(db: Session) -> list[Complaint]:
    return db.query(Complaint).order_by(Complaint.created_at.desc()).all()


def get_complaint(db: Session, complaint_id: int) -> Complaint | None:
    return db.query(Complaint).filter(Complaint.id == complaint_id).first()


def update_complaint(
    db: Session,
    complaint_id: int,
    complaint_data: ComplaintUpdate,
) -> Complaint | None:
    complaint = get_complaint(db, complaint_id)
    if complaint is None:
        return None

    update_data = complaint_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(complaint, field, value)

    db.commit()
    db.refresh(complaint)
    return complaint


def delete_complaint(db: Session, complaint_id: int) -> bool:
    complaint = get_complaint(db, complaint_id)
    if complaint is None:
        return False

    db.delete(complaint)
    db.commit()
    return True
