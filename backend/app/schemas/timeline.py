from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TimelineEventCreate(BaseModel):
    event_date: datetime
    event_type: str
    title: str
    description: Optional[str] = None
    source: Optional[str] = None

class TimelineEventOut(TimelineEventCreate):
    id: str
    case_id: str
    verification_status: str

    class Config:
        from_attributes = True
