from __future__ import annotations

from typing import Any, Mapping

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_session
from ..repositories.settings import SettingsRepository

router = APIRouter(prefix="/settings", tags=["settings"])


def repo_dep(session: AsyncSession = Depends(get_session)) -> SettingsRepository:
    return SettingsRepository(session)


@router.get("/")
async def get_all_settings(
    userId: str = Query(..., description="External user id"),
    repo: SettingsRepository = Depends(repo_dep),
) -> dict[str, Any]:
    return await repo.get_all(userId)


@router.put("/")
async def update_all_settings(
    payload: Mapping[str, Any],
    userId: str = Query(..., description="External user id"),
    repo: SettingsRepository = Depends(repo_dep),
) -> dict[str, Any]:
    return await repo.update_all(userId, payload)


@router.get("/account")
async def get_account_settings(
    userId: str = Query(...), repo: SettingsRepository = Depends(repo_dep)
) -> dict[str, Any]:
    return await repo.get_section(userId, "account")


@router.put("/account")
async def update_account_settings(
    payload: Mapping[str, Any],
    userId: str = Query(...),
    repo: SettingsRepository = Depends(repo_dep),
) -> dict[str, Any]:
    return await repo.update_section(userId, "account", payload)


@router.get("/profile")
async def get_profile_settings(
    userId: str = Query(...), repo: SettingsRepository = Depends(repo_dep)
) -> dict[str, Any]:
    return await repo.get_section(userId, "profile")


@router.put("/profile")
async def update_profile_settings(
    payload: Mapping[str, Any],
    userId: str = Query(...),
    repo: SettingsRepository = Depends(repo_dep),
) -> dict[str, Any]:
    return await repo.update_section(userId, "profile", payload)


@router.get("/privacy")
async def get_privacy_settings(
    userId: str = Query(...), repo: SettingsRepository = Depends(repo_dep)
) -> dict[str, Any]:
    return await repo.get_section(userId, "privacy")


@router.put("/privacy")
async def update_privacy_settings(
    payload: Mapping[str, Any],
    userId: str = Query(...),
    repo: SettingsRepository = Depends(repo_dep),
) -> dict[str, Any]:
    return await repo.update_section(userId, "privacy", payload)


@router.get("/display")
async def get_display_settings(
    userId: str = Query(...), repo: SettingsRepository = Depends(repo_dep)
) -> dict[str, Any]:
    return await repo.get_section(userId, "display")


@router.put("/display")
async def update_display_settings(
    payload: Mapping[str, Any],
    userId: str = Query(...),
    repo: SettingsRepository = Depends(repo_dep),
) -> dict[str, Any]:
    return await repo.update_section(userId, "display", payload)


@router.get("/preferences")
async def get_preferences_settings(
    userId: str = Query(...), repo: SettingsRepository = Depends(repo_dep)
) -> dict[str, Any]:
    return await repo.get_section(userId, "preferences")


@router.put("/preferences")
async def update_preferences_settings(
    payload: Mapping[str, Any],
    userId: str = Query(...),
    repo: SettingsRepository = Depends(repo_dep),
) -> dict[str, Any]:
    return await repo.update_section(userId, "preferences", payload)

