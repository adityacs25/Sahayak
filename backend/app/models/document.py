import uuid
import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.database.base import Base

class Document(Base):
    __tablename__ = "documents"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String, ForeignKey("clinical_cases.id"))
    file_name = Column(String)
    file_path = Column(String)
    document_type = Column(Enum("prescription", "lab_report", "discharge_summary", "imaging_report", "other", name="doc_types"), default="other")
    upload_date = Column(DateTime, default=datetime.datetime.utcnow)
    processing_status = Column(Enum("pending", "processing", "completed", "failed", name="doc_status"), default="pending")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    case = relationship("ClinicalCase", back_populates="documents")
    extracted_data = relationship("ExtractedMedicalData", back_populates="document")
