from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.init_db import create_all_tables
from app.api.router import router as api_router
from app.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_all_tables()
    yield

app = FastAPI(title="MediKiosk API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/health")
async def health_check():
    return {"status": "ok"}
