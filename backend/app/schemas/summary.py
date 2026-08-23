from pydantic import BaseModel
from typing import Optional, Dict, Any

class SummaryOut(BaseModel):
    id: str
    case_id: str
    patient_overview: Optional[str] = None
    chief_complaint_summary: Optional[str] = None
    history_summary: Optional[str] = None
    associated_symptoms: Optional[str] = None
    past_history_summary: Optional[str] = None
    medication_summary: Optional[str] = None
    allergies_summary: Optional[str] = None
    investigations_summary: Optional[str] = None
    red_flag_summary: Optional[str] = None
    ai_narrative: Optional[str] = None
    is_mock: bool

    class Config:
        from_attributes = True

class SummaryUpdate(BaseModel):
    doctor_edited_content: str
