from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ReviewCreate(BaseModel):
    notes: Optional[str] = None
    verification_status: str = "doctor_verified"

class ReviewOut(ReviewCreate):
    id: str
    case_id: str
    doctor_id: str
    verified_at: Optional[datetime] = None
    confirmed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True
