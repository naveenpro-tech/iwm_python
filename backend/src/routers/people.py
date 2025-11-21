from __future__ import annotations

from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_session
from ..repositories.people import PeopleRepository

router = APIRouter(prefix="/people", tags=["people"])

@router.get("")
async def list_people(
    page: int = 1,
    limit: int = 20,
    session: AsyncSession = Depends(get_session),
) -> Any:
    repo = PeopleRepository(session)
    return await repo.list(page=page, limit=limit)


@router.get("/{person_id}")
async def get_person(person_id: str, session: AsyncSession = Depends(get_session)) -> Any:
    repo = PeopleRepository(session)
    data = await repo.get(person_id)
    if not data:
        raise HTTPException(status_code=404, detail="Person not found")
    return data

