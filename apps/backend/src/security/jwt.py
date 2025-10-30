from __future__ import annotations

from datetime import datetime, timedelta, timezone
import jwt
from typing import Any, Dict

from ..config import settings


def _now() -> datetime:
    return datetime.now(timezone.utc)


def create_access_token(sub: str, role_profiles: list[dict] | None = None) -> str:
    payload = {
        "sub": sub,
        "type": "access",
        "iat": int(_now().timestamp()),
        "exp": int((_now() + timedelta(minutes=settings.access_token_exp_minutes)).timestamp()),
    }
    # Include role_profiles if provided (for admin role checking in middleware)
    if role_profiles:
        payload["role_profiles"] = role_profiles
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def create_refresh_token(sub: str) -> str:
    payload = {
        "sub": sub,
        "type": "refresh",
        "iat": int(_now().timestamp()),
        "exp": int((_now() + timedelta(days=settings.refresh_token_exp_days)).timestamp()),
    }
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_token(token: str) -> Dict[str, Any]:
    return jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])

