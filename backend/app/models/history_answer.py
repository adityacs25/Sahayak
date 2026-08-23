import uuid
import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base

class HistoryAnswer(Base):
    __tablename__ = "history_answers"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    section_id = Column(String, ForeignKey("history_sections.id"), nullable=True)
    case_id = Column(String, ForeignKey("clinical_cases.id"))
    question_key = Column(String)
    question_text = Column(String)
    answer_text = Column(String)
    answer_type = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    section = relationship("HistorySection", back_populates="answers")
    case = relationship("ClinicalCase", back_populates="history_answers")
