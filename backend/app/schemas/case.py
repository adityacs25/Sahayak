from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel
from .patient import PatientOut
from .history import HistoryAnswerOut
from .red_flag import RedFlagOut
from .summary import SummaryOut
from .timeline import TimelineEventOut
from .document import DocumentOut
from .review import ReviewOut

class CaseBase(BaseModel):
    patient_id: str
    chief_complaint: str
    priority: Optional[str] = "normal"

class CaseCreate(CaseBase):
    pass

class CaseUpdate(BaseModel):
    case_status: Optional[str] = None
    priority: Optional[str] = None

class CaseOut(CaseBase):
    id: str
    case_status: str
    created_at: datetime
    submitted_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class CaseListOut(CaseOut):
    patient_name: Optional[str] = None
    waiting_time: Optional[str] = None

class CaseQueueOut(BaseModel):
    id: str
    patient_id: str
    patient_name: str
    patient_age: int
    patient_gender: str
    chief_complaint: str
    case_status: str
    priority: str
    submitted_at: datetime

class CaseDetailOut(BaseModel):
    case: CaseOut
    patient: PatientOut
    history: List[HistoryAnswerOut]
    red_flags: List[RedFlagOut]
    summary: Optional[SummaryOut] = None
    timeline: List[TimelineEventOut]
    documents: List[DocumentOut]
    review: Optional[ReviewOut] = None
