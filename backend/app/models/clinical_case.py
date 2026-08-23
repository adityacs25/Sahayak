import uuid
import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.database.base import Base

class ClinicalCase(Base):
    __tablename__ = "clinical_cases"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, ForeignKey("patients.id"))
    chief_complaint = Column(String)
    case_status = Column(Enum("draft", "in_progress", "ready_for_review", "reviewed", "confirmed", name="case_statuses"), default="draft")
    priority = Column(Enum("normal", "attention", "urgent", name="case_priorities"), default="normal")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    submitted_at = Column(DateTime, nullable=True)

    patient = relationship("Patient", back_populates="cases")
    history_sections = relationship("HistorySection", back_populates="case")
    history_answers = relationship("HistoryAnswer", back_populates="case")
    red_flags = relationship("RedFlag", back_populates="case")
    documents = relationship("Document", back_populates="case")
    timeline_events = relationship("TimelineEvent", back_populates="case")
    ai_summary = relationship("AISummary", back_populates="case", uselist=False)
    doctor_reviews = relationship("DoctorReview", back_populates="case")
