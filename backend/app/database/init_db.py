import app.models  # Import all models to ensure they are registered with Base
from app.database.connection import engine
from app.database.base import Base

async def create_all_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
