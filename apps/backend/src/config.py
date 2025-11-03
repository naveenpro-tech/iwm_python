import json
import os
import json
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, field_validator

class Settings(BaseSettings):
    env: str = Field(default="development")
    app_name: str = Field(default="iwm-backend")
    log_level: str = Field(default="INFO")
    # Example: postgresql+asyncpg://user:pass@localhost:5432/iwm
    database_url: str | None = Field(default=None)
    export_openapi_on_startup: bool = Field(default=True)
    cors_origins: list[str] = Field(default_factory=lambda: [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://192.168.0.194:3000",  # Mobile access on local network
        "http://192.168.0.194:5173",  # Alternative port for mobile
    ])  # Frontend ports (desktop + mobile network access)

    # JWT/Auth settings
    jwt_secret_key: str = Field(default=os.getenv("JWT_SECRET_KEY", "dev-secret-change-me"))
    jwt_algorithm: str = Field(default=os.getenv("JWT_ALGORITHM", "HS256"))
    access_token_exp_minutes: int = Field(default=int(os.getenv("ACCESS_TOKEN_EXP_MINUTES", "30")))
    refresh_token_exp_days: int = Field(default=int(os.getenv("REFRESH_TOKEN_EXP_DAYS", "7")))

    # External API keys
    tmdb_api_key: str | None = Field(default=None)
    gemini_api_key: str | None = Field(default=None)
    gemini_model: str = Field(default="gemini-2.5-flash")

    # Pydantic v2: load .env from backend app folder regardless of cwd
    model_config = SettingsConfigDict(
        env_file=str((Path(__file__).resolve().parents[1] / ".env")),
        extra="ignore",
    )

    @field_validator("cors_origins", mode="before")
    @classmethod
    def _parse_cors_origins(cls, v):
        if isinstance(v, str):
            s = v.strip()
            if s.startswith("["):
                try:
                    return json.loads(s)
                except Exception:
                    pass
            return [item.strip() for item in s.split(",") if item.strip()]
        return v

settings = Settings()

