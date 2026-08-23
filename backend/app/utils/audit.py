import json
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.audit_log import AuditLog

async def log_action(db: AsyncSession, user_id: str, action: str, entity_type: str, entity_id: str, details: dict, ip_address: str = None):
    audit_log = AuditLog(
        user_id=user_id,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        details=json.dumps(details) if details else None,
        ip_address=ip_address
    )
    db.add(audit_log)
    await db.commit()
