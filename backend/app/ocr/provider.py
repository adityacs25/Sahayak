from app.config import settings
from .base import OCRService
from .mock_ocr import MockOCRService

def get_ocr_service() -> OCRService:
    if settings.MOCK_OCR_MODE:
        return MockOCRService()
    return MockOCRService()
