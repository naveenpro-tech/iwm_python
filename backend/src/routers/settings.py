from __future__ import annotations

from typing import Any, Mapping

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_session
from ..repositories.settings import SettingsRepository
from ..models import User
from ..dependencies.auth import get_current_user

router = APIRouter(prefix="/settings", tags=["settings"])


def repo_dep(session: AsyncSession = Depends(get_session)) -> SettingsRepository:
    return SettingsRepository(session)


@router.get("/")
async def get_all_settings(
    current_user: User = Depends(get_current_user),
    repo: SettingsRepository = Depends(repo_dep),
) -> dict[str, Any]:
    return await repo.get_all(current_user.external_id)


@router.put("/")
async def update_all_settings(
    payload: Mapping[str, Any],
    current_user: User = Depends(get_current_user),
    repo: SettingsRepository = Depends(repo_dep),
) -> dict[str, Any]:
    return await repo.update_all(current_user.external_id, payload)


@router.get("/account")
async def get_account_settings(
    current_user: User = Depends(get_current_user),
    repo: SettingsRepository = Depends(repo_dep)
) -> dict[str, Any]:
    return await repo.get_section(current_user.external_id, "account")


@router.put("/account")
async def update_account_settings(
    payload: Mapping[str, Any],
    current_user: User = Depends(get_current_user),
    repo: SettingsRepository = Depends(repo_dep),
) -> dict[str, Any]:
    return await repo.update_section(current_user.external_id, "account", payload)


@router.get("/profile")
async def get_profile_settings(
    current_user: User = Depends(get_current_user),
    repo: SettingsRepository = Depends(repo_dep)
) -> dict[str, Any]:
    return await repo.get_section(current_user.external_id, "profile")


@router.put("/profile")
async def update_profile_settings(
    payload: Mapping[str, Any],
    current_user: User = Depends(get_current_user),
    repo: SettingsRepository = Depends(repo_dep),
) -> dict[str, Any]:
    return await repo.update_section(current_user.external_id, "profile", payload)


@router.get("/privacy")
async def get_privacy_settings(
    current_user: User = Depends(get_current_user),
    repo: SettingsRepository = Depends(repo_dep)
) -> dict[str, Any]:
    return await repo.get_section(current_user.external_id, "privacy")


@router.put("/privacy")
async def update_privacy_settings(
    payload: Mapping[str, Any],
    current_user: User = Depends(get_current_user),
    repo: SettingsRepository = Depends(repo_dep),
) -> dict[str, Any]:
    return await repo.update_section(current_user.external_id, "privacy", payload)


@router.get("/display")
async def get_display_settings(
    current_user: User = Depends(get_current_user),
    repo: SettingsRepository = Depends(repo_dep)
) -> dict[str, Any]:
    return await repo.get_section(current_user.external_id, "display")


@router.put("/display")
async def update_display_settings(
    payload: Mapping[str, Any],
    current_user: User = Depends(get_current_user),
    repo: SettingsRepository = Depends(repo_dep),
) -> dict[str, Any]:
    return await repo.update_section(current_user.external_id, "display", payload)


@router.get("/preferences")
async def get_preferences_settings(
    current_user: User = Depends(get_current_user),
    repo: SettingsRepository = Depends(repo_dep)
) -> dict[str, Any]:
    return await repo.get_section(current_user.external_id, "preferences")


@router.put("/preferences")
async def update_preferences_settings(
    payload: Mapping[str, Any],
    current_user: User = Depends(get_current_user),
    repo: SettingsRepository = Depends(repo_dep),
) -> dict[str, Any]:
    return await repo.update_section(current_user.external_id, "preferences", payload)

