from sqlalchemy.orm import Session

from app.models.complaint import Complaint
from app.schemas.complaint import ComplaintCreate, ComplaintUpdate


def create_complaint(db: Session, complaint_data: ComplaintCreate) -> Complaint:
    complaint = Complaint(**complaint_data.model_dump())
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
