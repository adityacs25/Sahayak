from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.database.connection import get_db
from app.models.patient import Patient
from app.models.consent import Consent
from app.schemas.patient import PatientCreate, PatientOut
from app.schemas.consent import ConsentCreate, ConsentOut
from app.schemas.auth import UserOut
from app.utils.auth import get_current_user

router = APIRouter()

@router.post("", response_model=PatientOut, status_code=201)
async def create_patient(patient_in: PatientCreate, db: AsyncSession = Depends(get_db)):
    patient = Patient(**patient_in.model_dump())
    db.add(patient)
    await db.commit()
    await db.refresh(patient)
    return patient

@router.get("", response_model=List[PatientOut])
async def list_patients(db: AsyncSession = Depends(get_db), current_user: UserOut = Depends(get_current_user)):
    if current_user.role not in ["doctor", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    result = await db.execute(select(Patient))
    return result.scalars().all()

@router.get("/{patient_id}", response_model=PatientOut)
async def get_patient(patient_id: str, db: AsyncSession = Depends(get_db)):
    patient = await db.get(Patient, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@router.post("/{patient_id}/consent", response_model=ConsentOut, status_code=201)
async def create_consent(patient_id: str, consent_in: ConsentCreate, db: AsyncSession = Depends(get_db)):
    consent = Consent(patient_id=patient_id, **consent_in.model_dump(), ip_address="127.0.0.1")
    db.add(consent)
    await db.commit()
    await db.refresh(consent)
    return consent
