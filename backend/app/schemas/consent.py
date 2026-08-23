from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ConsentCreate(BaseModel):
    consent_version: str

class ConsentOut(ConsentCreate):
    id: str
    patient_id: str
    consented_at: datetime
    ip_address: Optional[str] = None

    class Config:
        from_attributes = True
