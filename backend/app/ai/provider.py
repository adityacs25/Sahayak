from app.config import settings
from .base import AIService
from .mock_ai import MockAIService

def get_ai_service() -> AIService:
    if settings.MOCK_AI_MODE:
        return MockAIService()
    # In a real app, initialize real AI service here
    return MockAIService()
