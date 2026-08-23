from typing import List, Optional
from pydantic import BaseModel

class HistoryAnswerCreate(BaseModel):
    question_key: str
    question_text: str
    answer_text: str
    answer_type: str

class HistorySubmit(BaseModel):
    answers: List[HistoryAnswerCreate]

class HistoryAnswerOut(HistoryAnswerCreate):
    id: str
    section_id: Optional[str] = None
    case_id: str

    class Config:
        from_attributes = True
