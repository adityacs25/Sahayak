import asyncio
import datetime

from sqlalchemy import select

from app.database.connection import AsyncSessionLocal
from app.database.init_db import create_all_tables
from app.models.ai_summary import AISummary
from app.models.clinical_case import ClinicalCase
from app.models.consent import Consent
from app.models.history_answer import HistoryAnswer
from app.models.patient import Patient
from app.models.red_flag import RedFlag
from app.models.timeline_event import TimelineEvent
from app.models.user import User
from app.utils.auth import hash_password

AI_REVIEW_LABEL = "AI-Generated — Requires Doctor Review"


async def first(db, model, *conditions):
    result = await db.execute(select(model).where(*conditions))
    return result.scalars().first()


async def get_or_create_user(db, email, password, role, full_name):
    user = await first(db, User, User.email == email)
    if user:
        return user
    user = User(email=email, hashed_password=hash_password(password), role=role, full_name=full_name)
    db.add(user)
    await db.flush()
    return user


async def get_or_create_patient(db, values):
    patient = await first(db, Patient, Patient.phone_number == values["phone_number"])
    if patient:
        return patient
    patient = Patient(**values)
    db.add(patient)
    await db.flush()
    return patient


async def get_or_create_case(db, patient_id, fixture):
    case = await first(
        db, ClinicalCase,
        ClinicalCase.patient_id == patient_id,
        ClinicalCase.chief_complaint == fixture["complaint"],
    )
    if case:
        if fixture["status"] == "ready_for_review" and not case.submitted_at:
            case.submitted_at = case.created_at
        return case
    case = ClinicalCase(
        patient_id=patient_id,
        chief_complaint=fixture["complaint"],
        case_status=fixture["status"],
        priority=fixture["priority"],
        submitted_at=datetime.datetime.utcnow() if fixture["status"] == "ready_for_review" else None,
    )
    db.add(case)
    await db.flush()
    return case


async def add_fixture_children(db, case, fixture):
    for answer in fixture["history"]:
        existing = await first(db, HistoryAnswer, HistoryAnswer.case_id == case.id, HistoryAnswer.question_key == answer["question_key"])
        if not existing:
            db.add(HistoryAnswer(case_id=case.id, **answer))

    for flag in fixture["flags"]:
        existing = await first(db, RedFlag, RedFlag.case_id == case.id, RedFlag.flag_type == flag["flag_type"], RedFlag.description == flag["description"])
        if not existing:
            db.add(RedFlag(case_id=case.id, **flag))

    for event in fixture.get("timeline", []):
        existing = await first(db, TimelineEvent, TimelineEvent.case_id == case.id, TimelineEvent.title == event["title"])
        if not existing:
            db.add(TimelineEvent(case_id=case.id, **event))

    summary = await first(db, AISummary, AISummary.case_id == case.id)
    narrative = f"{AI_REVIEW_LABEL}\n\n{fixture['summary']['ai_narrative']}"
    if not summary:
        db.add(AISummary(case_id=case.id, **{**fixture["summary"], "ai_narrative": narrative}))
    elif summary.is_mock and not (summary.ai_narrative or "").startswith(AI_REVIEW_LABEL):
        summary.ai_narrative = f"{AI_REVIEW_LABEL}\n\n{summary.ai_narrative or ''}".rstrip()


async def seed():
    print("Creating tables...")
    await create_all_tables()
    async with AsyncSessionLocal() as db:
        print("Ensuring synthetic demo users...")
        patient_user = await get_or_create_user(db, "patient@demo.com", "demo1234", "patient", "Ramesh Kumar")
        await get_or_create_user(db, "doctor@demo.com", "demo1234", "doctor", "Dr. Anjali Mehta")

        patient_specs = [
            {"user_id": patient_user.id, "full_name": "Ramesh Kumar", "age": 58, "gender": "Male", "phone_number": "9876543210", "date_of_birth": datetime.date(1968, 1, 1), "address": "Delhi", "emergency_contact_name": "Sita", "emergency_contact_phone": "9876543211"},
            {"full_name": "Priya Sharma", "age": 34, "gender": "Female", "phone_number": "9876543212", "date_of_birth": datetime.date(1992, 5, 12), "address": "Mumbai", "emergency_contact_name": "Rahul", "emergency_contact_phone": "9876543213"},
            {"full_name": "Suresh Rao", "age": 62, "gender": "Male", "phone_number": "9876543214", "date_of_birth": datetime.date(1964, 8, 23), "address": "Bangalore", "emergency_contact_name": "Geeta", "emergency_contact_phone": "9876543215"},
            {"full_name": "Meena Devi", "age": 45, "gender": "Female", "phone_number": "9876543216", "date_of_birth": datetime.date(1981, 11, 5), "address": "Chennai", "emergency_contact_name": "Raj", "emergency_contact_phone": "9876543217"},
            {"full_name": "Arjun Verma", "age": 28, "gender": "Male", "phone_number": "9876543218", "date_of_birth": datetime.date(1998, 2, 14), "address": "Pune", "emergency_contact_name": "Neha", "emergency_contact_phone": "9876543219"},
        ]
        patients = [await get_or_create_patient(db, spec) for spec in patient_specs]
        for patient in patients:
            if not await first(db, Consent, Consent.patient_id == patient.id, Consent.consent_version == "v1.0"):
                db.add(Consent(patient_id=patient.id, consent_version="v1.0", ip_address="127.0.0.1"))

        fixtures = [
            {"complaint": "Chest pain radiating to left arm", "status": "ready_for_review", "priority": "urgent", "history": [{"question_key": "q1", "question_text": "Onset?", "answer_text": "2 hours ago", "answer_type": "text"}, {"question_key": "q2", "question_text": "Severity?", "answer_text": "8", "answer_type": "scale"}], "flags": [{"flag_type": "Cardiac", "description": "Chest pain with possible cardiac features", "severity": "urgent", "reason": "Possible MI"}], "timeline": [{"event_date": datetime.datetime(2020, 1, 1), "event_type": "consultation", "title": "HTN Diagnosed"}], "summary": {"chief_complaint_summary": "Chest pain", "ai_narrative": "Patient reports acute chest pain radiating to left arm.", "red_flag_summary": "Urgent cardiac evaluation needed."}},
            {"complaint": "Cough for 3 weeks, mild fever", "status": "confirmed", "priority": "normal", "history": [{"question_key": "q1", "question_text": "Type of cough?", "answer_text": "Dry", "answer_type": "text"}], "flags": [{"flag_type": "None", "description": "No significant red flags", "severity": "normal", "reason": "Routine"}], "timeline": [{"event_date": datetime.datetime(2024, 1, 1), "event_type": "consultation", "title": "Viral Fever"}], "summary": {"chief_complaint_summary": "Chronic cough", "ai_narrative": "Patient has dry cough for 3 weeks.", "red_flag_summary": "Normal."}},
            {"complaint": "Diabetes follow-up, increased thirst", "status": "reviewed", "priority": "attention", "history": [{"question_key": "q1", "question_text": "Thirst level?", "answer_text": "High", "answer_type": "text"}], "flags": [{"flag_type": "Endocrine", "description": "Polydipsia in diabetic", "severity": "attention", "reason": "Poor glycemic control"}], "summary": {"chief_complaint_summary": "Diabetes follow-up", "ai_narrative": "Uncontrolled diabetes symptoms.", "red_flag_summary": "Attention required."}},
            {"complaint": "Severe headache for 2 days", "status": "ready_for_review", "priority": "attention", "history": [{"question_key": "q1", "question_text": "Location?", "answer_text": "Right-sided", "answer_type": "text"}], "flags": [{"flag_type": "Neurological", "description": "Severe headache", "severity": "attention", "reason": "Rule out secondary causes"}], "summary": {"chief_complaint_summary": "Headache", "ai_narrative": "Migraine features present.", "red_flag_summary": "Needs assessment."}},
            {"complaint": "Digestive issues, acidity, fatigue", "status": "in_progress", "priority": "normal", "history": [{"question_key": "q1", "question_text": "Prakriti?", "answer_text": "Pitta-Vata", "answer_type": "text"}], "flags": [{"flag_type": "None", "description": "Normal", "severity": "normal", "reason": "Routine"}], "summary": {"chief_complaint_summary": "Acidity", "ai_narrative": "Digestive issues, likely lifestyle related.", "red_flag_summary": "Normal."}},
        ]

        print("Ensuring synthetic demo cases and child records...")
        for patient, fixture in zip(patients, fixtures):
            case = await get_or_create_case(db, patient.id, fixture)
            await add_fixture_children(db, case, fixture)
        await db.commit()
        print("Synthetic demo seed data is present and idempotent.")


if __name__ == "__main__":
    asyncio.run(seed())
