import uuid
import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.database.base import Base

class Patient(Base):
    __tablename__ = "patients"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    full_name = Column(String)
    age = Column(Integer)
    gender = Column(String)
    phone_number = Column(String)
    date_of_birth = Column(Date)
    address = Column(String)
    emergency_contact_name = Column(String)
    emergency_contact_phone = Column(String)
    language_preference = Column(String, default="English")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="patient_profile")
    cases = relationship("ClinicalCase", back_populates="patient")
    consents = relationship("Consent", back_populates="patient")
