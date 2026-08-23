from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.clinical_case import ClinicalCase
from app.models.history_answer import HistoryAnswer
from app.models.ai_summary import AISummary
from app.models.red_flag import RedFlag
from app.ai.provider import get_ai_service

async def generate_summary_for_case(case_id: str, db: AsyncSession):
    case = await db.get(ClinicalCase, case_id)
    if not case:
        return None

    history_result = await db.execute(
        select(HistoryAnswer).where(HistoryAnswer.case_id == case_id)
    )
    history = {
        answer.question_key: answer.answer_text
        for answer in history_result.scalars().all()
    }
    ai_service = get_ai_service()
    summary_data = ai_service.generate_summary({
        "chief_complaint": case.chief_complaint,
        "history": history,
    })

    result = await db.execute(select(AISummary).where(AISummary.case_id == case_id))
    summary = result.scalar_one_or_none()
    if not summary:
        summary = AISummary(case_id=case_id)
        db.add(summary)

    summary.chief_complaint_summary = summary_data["chief_complaint_summary"]
    summary.history_summary = summary_data.get("history_summary")
    summary.red_flag_summary = summary_data.get("red_flag_summary")
    summary.ai_narrative = (
        "AI-Generated — Requires Doctor Review\n\n"
        f"{summary_data['ai_narrative']}"
    )
    summary.is_mock = summary_data["is_mock"]
    await db.commit()
    await db.refresh(summary)
    return summary

async def generate_red_flags_for_case(case_id: str, db: AsyncSession):
    case = await db.get(ClinicalCase, case_id)
    if not case:
        return []
    ai_service = get_ai_service()
    flags = ai_service.detect_red_flags(case.chief_complaint, {})

    created_flags = []
    for f in flags:
        existing = await db.execute(
            select(RedFlag).where(
                RedFlag.case_id == case_id,
                RedFlag.flag_type == f["flag_type"],
                RedFlag.description == f["description"],
            )
        )
        if existing.scalar_one_or_none():
            continue
        rf = RedFlag(
            case_id=case_id,
            flag_type=f["flag_type"],
            description=f["description"],
            severity=f["severity"],
            reason=f["reason"]
        )
        db.add(rf)
        created_flags.append(rf)
    await db.commit()
    return created_flags

def generate_adaptive_questions(chief_complaint: str):
    ai_service = get_ai_service()
    return ai_service.generate_followup_questions(chief_complaint, {})

async def generate_timeline_for_case(case_id: str, db: AsyncSession):
    pass # Timeline compilation logic can go here
