from pydantic import BaseModel

class RedFlagOut(BaseModel):
    id: str
    case_id: str
    flag_type: str
    description: str
    severity: str
    reason: str
    is_acknowledged: bool

    class Config:
        from_attributes = True
