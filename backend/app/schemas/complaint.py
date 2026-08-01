from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ComplaintCreate(BaseModel):
    customer_name: str = Field(..., min_length=1, max_length=255)
    customer_email: EmailStr
    product_name: str = Field(..., min_length=1, max_length=255)
    batch_number: str = Field(..., min_length=1, max_length=100)
    quantity: int = Field(..., gt=0)
    complaint_description: str = Field(..., min_length=1)

    category: str | None = Field(default=None, max_length=100)
    severity: str | None = Field(default=None, max_length=50)
    risk_assessment: str | None = None
    next_action: str | None = None

    status: str = Field(default="open", max_length=50)


class ComplaintUpdate(BaseModel):
    customer_name: str | None = Field(default=None, min_length=1, max_length=255)
    customer_email: EmailStr | None = None
    product_name: str | None = Field(default=None, min_length=1, max_length=255)
    batch_number: str | None = Field(default=None, min_length=1, max_length=100)
    quantity: int | None = Field(default=None, gt=0)
    complaint_description: str | None = Field(default=None, min_length=1)

    category: str | None = Field(default=None, max_length=100)
    severity: str | None = Field(default=None, max_length=50)
    risk_assessment: str | None = None
    next_action: str | None = None

    status: str | None = Field(default=None, max_length=50)


class ComplaintResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    customer_name: str
    customer_email: EmailStr
    product_name: str
    batch_number: str
    quantity: int
    complaint_description: str

    category: str | None
    severity: str | None
    risk_assessment: str | None
    next_action: str | None

    status: str
    created_at: datetime