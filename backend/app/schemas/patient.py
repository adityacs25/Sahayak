from typing import Optional
from datetime import date
from pydantic import BaseModel

class PatientBase(BaseModel):
    full_name: str
    age: int
    gender: str
    phone_number: str
    date_of_birth: Optional[date] = None
    address: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    language_preference: Optional[str] = "English"

class PatientCreate(PatientBase):
    pass

class PatientUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None

class PatientOut(PatientBase):
    id: str
    user_id: Optional[str] = None

    class Config:
        from_attributes = True
