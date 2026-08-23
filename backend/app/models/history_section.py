import uuid
import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Boolean
from sqlalchemy.orm import relationship
from app.database.base import Base

class HistorySection(Base):
    __tablename__ = "history_sections"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String, ForeignKey("clinical_cases.id"))
    section_name = Column(String)
    section_order = Column(Integer)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    case = relationship("ClinicalCase", back_populates="history_sections")
    answers = relationship("HistoryAnswer", back_populates="section")
