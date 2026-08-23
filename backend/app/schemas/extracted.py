from pydantic import BaseModel
from typing import Optional
from datetime import date

class ExtractedDataOut(BaseModel):
    id: str
    document_id: str
    field_name: str
    field_value: str
    unit: Optional[str] = None
    reference_range: Optional[str] = None
    document_date: Optional[date] = None
    is_abnormal: bool
    verification_status: str

    class Config:
        from_attributes = True
