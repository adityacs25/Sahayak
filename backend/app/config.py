from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite+aiosqlite:///./medikiosk.db"
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    AI_API_KEY: str = ""
    MOCK_AI_MODE: bool = True
    MOCK_OCR_MODE: bool = True
    UPLOAD_DIR: str = "./uploads"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480

    class Config:
        env_file = ".env"

settings = Settings()
