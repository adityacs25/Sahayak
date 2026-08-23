import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List
from app.database.connection import get_db
from app.models.clinical_case import ClinicalCase
from app.models.patient import Patient
from app.models.history_answer import HistoryAnswer
from app.models.ai_summary import AISummary
from app.models.red_flag import RedFlag
from app.models.timeline_event import TimelineEvent
from app.models.doctor_review import DoctorReview
from app.schemas.case import CaseCreate, CaseOut, CaseUpdate, CaseQueueOut, CaseDetailOut
from app.schemas.history import HistorySubmit, HistoryAnswerOut
from app.schemas.summary import SummaryOut, SummaryUpdate
from app.schemas.red_flag import RedFlagOut
from app.schemas.timeline import TimelineEventOut, TimelineEventCreate
from app.schemas.review import ReviewCreate, ReviewOut
from app.schemas.auth import UserOut
from app.utils.auth import get_current_user
from app.services.case_service import generate_summary_for_case, generate_red_flags_for_case, generate_adaptive_questions

router = APIRouter()

@router.post("", response_model=CaseOut, status_code=201)
async def create_case(case_in: CaseCreate, db: AsyncSession = Depends(get_db)):
    patient = await db.get(Patient, case_in.patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    case = ClinicalCase(**case_in.model_dump(), case_status="draft")
    db.add(case)
    await db.commit()
    await db.refresh(case)
    return case

@router.get("", response_model=List[CaseQueueOut])
async def list_cases(db: AsyncSession = Depends(get_db), current_user: UserOut = Depends(get_current_user)):
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Not authorized")
    result = await db.execute(
        select(ClinicalCase)
        .options(selectinload(ClinicalCase.patient))
        .where(ClinicalCase.case_status == "ready_for_review")
        .order_by(ClinicalCase.submitted_at.desc(), ClinicalCase.created_at.desc())
    )
    return [
        CaseQueueOut(
            id=case.id,
            patient_id=case.patient_id,
            patient_name=case.patient.full_name,
            patient_age=case.patient.age,
            patient_gender=case.patient.gender,
            chief_complaint=case.chief_complaint,
            case_status=case.case_status,
            priority=case.priority,
            submitted_at=case.submitted_at or case.created_at,
        )
        for case in result.scalars().all()
    ]

@router.get("/{case_id}", response_model=CaseDetailOut)
async def get_case(case_id: str, db: AsyncSession = Depends(get_db), current_user: UserOut = Depends(get_current_user)):
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Not authorized")
    result = await db.execute(
        select(ClinicalCase)
        .options(
            selectinload(ClinicalCase.patient),
            selectinload(ClinicalCase.history_answers),
            selectinload(ClinicalCase.red_flags),
            selectinload(ClinicalCase.ai_summary),
            selectinload(ClinicalCase.timeline_events),
            selectinload(ClinicalCase.documents),
            selectinload(ClinicalCase.doctor_reviews),
        )
        .where(ClinicalCase.id == case_id)
    )
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    latest_review = max(case.doctor_reviews, key=lambda review: review.created_at) if case.doctor_reviews else None
    return CaseDetailOut(
        case=case,
        patient=case.patient,
        history=case.history_answers,
        red_flags=case.red_flags,
        summary=case.ai_summary,
        timeline=case.timeline_events,
        documents=case.documents,
        review=latest_review,
    )

@router.put("/{case_id}", response_model=CaseOut)
async def update_case(case_id: str, update_in: CaseUpdate, db: AsyncSession = Depends(get_db), current_user: UserOut = Depends(get_current_user)):
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Not authorized")
    case = await db.get(ClinicalCase, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    if update_in.case_status:
        raise HTTPException(status_code=400, detail="Use submit, review, or confirm to change case status")
    if update_in.priority:
        case.priority = update_in.priority
    await db.commit()
    await db.refresh(case)
    return case

@router.post("/{case_id}/history", response_model=List[HistoryAnswerOut], status_code=201)
async def submit_history(case_id: str, data: HistorySubmit, db: AsyncSession = Depends(get_db)):
    case = await db.get(ClinicalCase, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    if case.case_status not in ["draft", "in_progress"]:
        raise HTTPException(status_code=409, detail="History can no longer be changed for this case")

    answers = []
    for ans in data.answers:
        h = HistoryAnswer(case_id=case_id, **ans.model_dump())
        db.add(h)
        answers.append(h)
    await db.commit()
    for h in answers:
        await db.refresh(h)
    if case.case_status == "draft":
        case.case_status = "in_progress"
        await db.commit()
    return answers

@router.post("/{case_id}/submit", response_model=CaseOut)
async def submit_case(case_id: str, db: AsyncSession = Depends(get_db)):
    case = await db.get(ClinicalCase, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    if case.case_status in ["reviewed", "confirmed"]:
        raise HTTPException(status_code=409, detail="Case has already been reviewed")

    if case.case_status != "ready_for_review":
        case.case_status = "ready_for_review"
        case.submitted_at = datetime.datetime.utcnow()
        await db.commit()

    await generate_summary_for_case(case_id, db)
    await generate_red_flags_for_case(case_id, db)
    await db.refresh(case)
    return case

@router.get("/{case_id}/history", response_model=List[HistoryAnswerOut])
async def get_history(case_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(HistoryAnswer).where(HistoryAnswer.case_id == case_id))
    return res.scalars().all()

@router.post("/{case_id}/questions")
async def get_adaptive_questions(case_id: str, db: AsyncSession = Depends(get_db)):
    case = await db.get(ClinicalCase, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    questions = generate_adaptive_questions(case.chief_complaint)
    return {"questions": questions}

@router.post("/{case_id}/red-flags")
async def generate_red_flags_endpoint(case_id: str, db: AsyncSession = Depends(get_db)):
    await generate_red_flags_for_case(case_id, db)
    return {"status": "success"}

@router.get("/{case_id}/red-flags", response_model=List[RedFlagOut])
async def get_red_flags(case_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(RedFlag).where(RedFlag.case_id == case_id))
    return res.scalars().all()

@router.get("/{case_id}/timeline", response_model=List[TimelineEventOut])
async def get_timeline(case_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(TimelineEvent).where(TimelineEvent.case_id == case_id).order_by(TimelineEvent.event_date.asc()))
    return res.scalars().all()

@router.post("/{case_id}/timeline", response_model=TimelineEventOut)
async def add_timeline_event(case_id: str, event_in: TimelineEventCreate, db: AsyncSession = Depends(get_db)):
    event = TimelineEvent(case_id=case_id, **event_in.model_dump())
    db.add(event)
    await db.commit()
    await db.refresh(event)
    return event

@router.get("/{case_id}/summary", response_model=SummaryOut)
async def get_summary(case_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(AISummary).where(AISummary.case_id == case_id))
    summary = res.scalar_one_or_none()
    if not summary:
        raise HTTPException(status_code=404, detail="Summary not found")
    return summary

@router.put("/{case_id}/summary", response_model=SummaryOut)
async def update_summary(case_id: str, update_in: SummaryUpdate, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(AISummary).where(AISummary.case_id == case_id))
    summary = res.scalar_one_or_none()
    if not summary:
        raise HTTPException(status_code=404, detail="Summary not found")
    summary.doctor_edited_content = update_in.doctor_edited_content
    import datetime
    summary.doctor_edited_at = datetime.datetime.utcnow()
    await db.commit()
    await db.refresh(summary)
    return summary

@router.post("/{case_id}/review", response_model=ReviewOut)
async def create_review(case_id: str, review_in: ReviewCreate, db: AsyncSession = Depends(get_db), current_user: UserOut = Depends(get_current_user)):
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Not authorized")
    case = await db.get(ClinicalCase, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    if case.case_status not in ["ready_for_review", "reviewed"]:
        raise HTTPException(status_code=409, detail="Case is not available for review")

    review = DoctorReview(
        case_id=case_id,
        doctor_id=current_user.id,
        verified_at=datetime.datetime.utcnow(),
        **review_in.model_dump(),
    )
    db.add(review)
    case.case_status = "reviewed"
    await db.commit()
    await db.refresh(review)
    return review

@router.post("/{case_id}/confirm")
async def confirm_case(case_id: str, db: AsyncSession = Depends(get_db), current_user: UserOut = Depends(get_current_user)):
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Not authorized")
    case = await db.get(ClinicalCase, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    if case.case_status == "confirmed":
        return {"status": "confirmed"}
    if case.case_status not in ["ready_for_review", "reviewed"]:
        raise HTTPException(status_code=409, detail="Case is not available for confirmation")

    result = await db.execute(
        select(DoctorReview)
        .where(DoctorReview.case_id == case_id, DoctorReview.doctor_id == current_user.id)
        .order_by(DoctorReview.created_at.desc())
    )
    review = result.scalars().first()
    now = datetime.datetime.utcnow()
    if not review:
        review = DoctorReview(
            case_id=case_id,
            doctor_id=current_user.id,
            verification_status="doctor_verified",
            verified_at=now,
        )
        db.add(review)
    review.confirmed_at = now
    case.case_status = "confirmed"
    await db.commit()
    return {"status": "confirmed"}
