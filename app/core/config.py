from pydantic import BaseSettings, AnyUrl
from functools import lru_cache

class Settings(BaseSettings):
    PROJECT_NAME: str = "AutoDrive"
    ENV: str = "dev"
    SECRET_KEY: str = "change-me-in-prod"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    ALGORITHM: str = "HS256"
    # Example: postgresql+psycopg://user:pass@localhost:5432/autodrive
    DATABASE_URL: AnyUrl = "postgresql+psycopg://postgres:postgres@localhost:5432/autodrive"  # type: ignore

    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache
def get_settings() -> Settings:
    return Settings()