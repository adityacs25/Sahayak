import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.database.connection import get_db
from app.models.document import Document
from app.models.extracted_medical_data import ExtractedMedicalData
from app.schemas.document import DocumentOut, DocumentUploadOut
from app.schemas.extracted import ExtractedDataOut
from app.config import settings
from app.ocr.provider import get_ocr_service

router = APIRouter()

@router.post("/{case_id}", response_model=DocumentUploadOut)
async def upload_document(case_id: str, file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(settings.UPLOAD_DIR, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    doc = Document(case_id=case_id, file_name=file.filename, file_path=file_path, document_type="other")
    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    
    return DocumentUploadOut(document=DocumentOut.model_validate(doc), message="Uploaded successfully")

@router.get("/{case_id}", response_model=List[DocumentOut])
async def list_documents(case_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Document).where(Document.case_id == case_id))
    return res.scalars().all()

@router.post("/process/{document_id}")
async def process_document(document_id: str, db: AsyncSession = Depends(get_db)):
    doc = await db.get(Document, document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    ocr_service = get_ocr_service()
    extracted_data = ocr_service.extract_structured(doc.file_path)
    
    for item in extracted_data:
        ed = ExtractedMedicalData(
            document_id=document_id,
            case_id=doc.case_id,
            field_name=item.get("field_name", "Unknown"),
            field_value=item.get("field_value", ""),
            unit=item.get("unit"),
            reference_range=item.get("reference_range"),
            is_abnormal=item.get("is_abnormal", False)
        )
        db.add(ed)
        
    doc.processing_status = "completed"
    await db.commit()
    return {"status": "processed"}

@router.get("/{document_id}/extracted", response_model=List[ExtractedDataOut])
async def get_extracted_data(document_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(ExtractedMedicalData).where(ExtractedMedicalData.document_id == document_id))
    return res.scalars().all()
