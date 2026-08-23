from fastapi import APIRouter
from .auth import router as auth_router
from .patients import router as patients_router
from .cases import router as cases_router
from .documents import router as documents_router

router = APIRouter()
router.include_router(auth_router, prefix="/auth", tags=["Auth"])
router.include_router(patients_router, prefix="/patients", tags=["Patients"])
router.include_router(cases_router, prefix="/cases", tags=["Cases"])
router.include_router(documents_router, prefix="/documents", tags=["Documents"])
