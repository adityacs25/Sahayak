import uuid
import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from app.database.base import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    action = Column(String)
    entity_type = Column(String)
    entity_id = Column(String)
    details = Column(Text, nullable=True)
    ip_address = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
