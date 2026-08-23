import uuid
import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from app.database.base import Base

class AISummary(Base):
    __tablename__ = "ai_summaries"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String, ForeignKey("clinical_cases.id"), unique=True)
    patient_overview = Column(Text, nullable=True)
    chief_complaint_summary = Column(Text, nullable=True)
    history_summary = Column(Text, nullable=True)
    associated_symptoms = Column(Text, nullable=True)
    past_history_summary = Column(Text, nullable=True)
    medication_summary = Column(Text, nullable=True)
    allergies_summary = Column(Text, nullable=True)
    investigations_summary = Column(Text, nullable=True)
    red_flag_summary = Column(Text, nullable=True)
    ai_narrative = Column(Text, nullable=True)
    is_mock = Column(Boolean, default=True)
    generated_at = Column(DateTime, default=datetime.datetime.utcnow)
    doctor_edited_at = Column(DateTime, nullable=True)
    doctor_edited_content = Column(Text, nullable=True)

    case = relationship("ClinicalCase", back_populates="ai_summary")
