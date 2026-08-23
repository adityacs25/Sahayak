import uuid
import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Date, Enum
from sqlalchemy.orm import relationship
from app.database.base import Base

class ExtractedMedicalData(Base):
    __tablename__ = "extracted_medical_data"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(String, ForeignKey("documents.id"))
    case_id = Column(String, ForeignKey("clinical_cases.id"))
    field_name = Column(String)
    field_value = Column(String)
    unit = Column(String, nullable=True)
    reference_range = Column(String, nullable=True)
    document_date = Column(Date, nullable=True)
    is_abnormal = Column(Boolean, default=False)
    verification_status = Column(Enum("unverified", "doctor_verified", "doctor_modified", name="verification_status"), default="unverified")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    document = relationship("Document", back_populates="extracted_data")
