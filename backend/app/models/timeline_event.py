import uuid
import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.database.base import Base

class TimelineEvent(Base):
    __tablename__ = "timeline_events"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String, ForeignKey("clinical_cases.id"))
    event_date = Column(DateTime)
    event_type = Column(Enum("consultation", "lab_test", "medication", "imaging", "surgery", "follow_up", "current_visit", name="timeline_event_types"), default="consultation")
    title = Column(String)
    description = Column(String, nullable=True)
    source = Column(String, nullable=True)
    verification_status = Column(String, default="unverified")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    case = relationship("ClinicalCase", back_populates="timeline_events")
