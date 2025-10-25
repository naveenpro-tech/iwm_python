from __future__ import annotations

from typing import Any
from pydantic import BaseModel, EmailStr
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..db import get_session
from ..models import User
from ..security.password import hash_password, verify_password
from ..security.jwt import create_access_token, create_refresh_token, decode_token
from ..dependencies.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


class SignupBody(BaseModel):
    email: EmailStr
    password: str
    name: str


class LoginBody(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class MeResponse(BaseModel):
    id: str
    email: EmailStr
    name: str
    avatarUrl: str | None = None


@router.post("/signup", response_model=TokenResponse)
async def signup(body: SignupBody, session: AsyncSession = Depends(get_session)) -> Any:
    # email uniqueness
    existing = (await session.execute(select(User).where(User.email == body.email))).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    user = User(
        external_id=body.email,  # use email as external_id for now
        email=body.email,
        name=body.name,
        hashed_password=hash_password(body.password),
    )
    session.add(user)
    await session.flush()
    await session.commit()
    sub = str(user.id)
    return TokenResponse(access_token=create_access_token(sub), refresh_token=create_refresh_token(sub))


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginBody, session: AsyncSession = Depends(get_session)) -> Any:
    res = await session.execute(select(User).where(User.email == body.email))
    user = res.scalar_one_or_none()
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    sub = str(user.id)
    return TokenResponse(access_token=create_access_token(sub), refresh_token=create_refresh_token(sub))


class RefreshBody(BaseModel):
    refresh_token: str


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(body: RefreshBody) -> Any:
    try:
        payload = decode_token(body.refresh_token)
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
    sub = payload.get("sub")
    if not sub:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    return TokenResponse(access_token=create_access_token(sub), refresh_token=create_refresh_token(sub))


@router.post("/logout")
async def logout() -> Any:
    # Stateless JWT: nothing to do server-side; client should discard tokens
    return {"ok": True}


@router.get("/me", response_model=MeResponse)
async def me(user: User = Depends(get_current_user)) -> Any:
    return MeResponse(id=user.external_id, email=user.email, name=user.name, avatarUrl=user.avatar_url)

