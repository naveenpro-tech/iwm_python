from __future__ import annotations

from typing import AsyncIterator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from .config import settings


class Base(DeclarativeBase):
    pass


engine = None
SessionLocal: async_sessionmaker[AsyncSession] | None = None


async def init_db() -> None:
    global engine, SessionLocal
    if settings.database_url:
        engine = create_async_engine(settings.database_url, echo=False, pool_pre_ping=True)
        SessionLocal = async_sessionmaker(engine, expire_on_commit=False)
    else:
        engine = None
        SessionLocal = None


async def get_session() -> AsyncIterator[AsyncSession | None]:
    if SessionLocal is None:
        # Allow None to enable mock/stub repositories in development
        yield None
        return
    async with SessionLocal() as session:
        yield session

