import uuid
import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum, Boolean
from sqlalchemy.orm import relationship
from app.database.base import Base

class RedFlag(Base):
    __tablename__ = "red_flags"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String, ForeignKey("clinical_cases.id"))
    flag_type = Column(String)
    description = Column(String)
    severity = Column(Enum("normal", "attention", "urgent", name="red_flag_severity"), default="normal")
    reason = Column(String)
    is_acknowledged = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    case = relationship("ClinicalCase", back_populates="red_flags")
