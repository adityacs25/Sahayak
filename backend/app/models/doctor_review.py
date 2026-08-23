import uuid
import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from app.database.base import Base

class DoctorReview(Base):
    __tablename__ = "doctor_reviews"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String, ForeignKey("clinical_cases.id"))
    doctor_id = Column(String, ForeignKey("users.id"))
    notes = Column(Text, nullable=True)
    verified_at = Column(DateTime, nullable=True)
    confirmed_at = Column(DateTime, nullable=True)
    verification_status = Column(Enum("unverified", "doctor_verified", "doctor_modified", name="review_status"), default="unverified")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    case = relationship("ClinicalCase", back_populates="doctor_reviews")
    doctor = relationship("User")
