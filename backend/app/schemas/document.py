from pydantic import BaseModel
from datetime import datetime

class DocumentOut(BaseModel):
    id: str
    case_id: str
    file_name: str
    document_type: str
    upload_date: datetime
    processing_status: str

    class Config:
        from_attributes = True

class DocumentUploadOut(BaseModel):
    document: DocumentOut
    message: str
