import uuid
import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.database.base import Base

class Consent(Base):
    __tablename__ = "consents"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, ForeignKey("patients.id"))
    consented_at = Column(DateTime, default=datetime.datetime.utcnow)
    ip_address = Column(String)
    consent_version = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    patient = relationship("Patient", back_populates="consents")
