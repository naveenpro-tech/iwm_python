from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Tuple
import json

from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import Pulse, User, UserFollow


def _slugify_username(name: str | None) -> str:
    if not name:
        return "user"
    return "".join(ch.lower() if ch.isalnum() else "" for ch in name) or "user"


def _parse_json_array(text: Optional[str]) -> List[Any]:
    if not text:
        return []
    try:
        return json.loads(text)
    except Exception:
        return []


def _parse_json_obj(text: Optional[str]) -> Dict[str, int]:
    if not text:
        return {}
    try:
        data = json.loads(text)
        if isinstance(data, dict):
            return {k: int(v) for k, v in data.items() if isinstance(v, (int, float))}
        return {}
    except Exception:
        return {}


class PulseRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    def _base_query(self):
        return (
            select(Pulse)
            .options(selectinload(Pulse.user), selectinload(Pulse.linked_movie))
        )

    async def list_feed(
        self,
        filter_type: str = "latest",
        window: str = "7d",
        page: int = 1,
        limit: int = 20,
        viewer_external_id: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        q = self._base_query()

        # Window handling
        now = datetime.utcnow()
        delta = timedelta(days=7)
        if window == "24h":
            delta = timedelta(hours=24)
        elif window == "30d":
            delta = timedelta(days=30)

        if filter_type == "latest":
            q = q.order_by(desc(Pulse.created_at))
        elif filter_type == "popular":
            q = q.order_by(desc(Pulse.reactions_total + Pulse.comments_count + Pulse.shares_count), desc(Pulse.created_at))
        elif filter_type == "trending":
            q = q.where(Pulse.created_at >= (now - delta)).order_by(desc(Pulse.reactions_total + Pulse.comments_count + Pulse.shares_count))
        elif filter_type == "following":
            if viewer_external_id:
                viewer = (await self.session.execute(select(User).where(User.external_id == viewer_external_id))).scalar_one_or_none()
                if viewer:
                    following_rows = (
                        await self.session.execute(select(UserFollow.following_id).where(UserFollow.follower_id == viewer.id))
                    ).scalars().all()
                    if following_rows:
                        q = q.where(Pulse.user_id.in_(following_rows)).order_by(desc(Pulse.created_at))
                    else:
                        return []
                else:
                    return []
            else:
                return []
        else:
            q = q.order_by(desc(Pulse.created_at))

        if limit is None or limit <= 0:
            limit = 20
        if page is None or page <= 0:
            page = 1

        q = q.limit(limit).offset((page - 1) * limit)
        rows = (await self.session.execute(q)).scalars().all()

        return [self._to_dto(p) for p in rows]

    async def trending_topics(self, window: str = "7d", limit: int = 10) -> List[Dict[str, Any]]:
        now = datetime.utcnow()
        delta = timedelta(days=7)
        if window == "24h":
            delta = timedelta(hours=24)
        elif window == "30d":
            delta = timedelta(days=30)

        q = self._base_query().where(Pulse.created_at >= (now - delta))
        rows = (await self.session.execute(q)).scalars().all()

        counts: Dict[str, int] = {}
        for p in rows:
            tags = _parse_json_array(p.hashtags)
            for tag in tags:
                if not isinstance(tag, str):
                    continue
                counts[tag] = counts.get(tag, 0) + 1

        items = sorted(counts.items(), key=lambda x: x[1], reverse=True)[:limit]
        # Add naive category inference based on tags
        def infer_category(tag: str) -> Optional[str]:
            lower = tag.lower()
            if "ipl" in lower or "cricket" in lower or "indv" in lower:
                return "cricket"
            if any(k in lower for k in ["oscar", "cannes", "festival"]):
                return "event"
            return "movie" if lower.startswith("#") else "general"

        out = [
            {"id": i + 1, "tag": tag, "count": cnt, "category": infer_category(tag)}
            for i, (tag, cnt) in enumerate(items)
        ]
        return out

    def _to_dto(self, p: Pulse) -> Dict[str, Any]:
        user = p.user
        username = _slugify_username(getattr(user, "name", None))
        display_name = getattr(user, "name", "User")
        avatar_url = getattr(user, "avatar_url", None) or "/user-avatar.png"

        media = _parse_json_array(p.content_media)
        reactions = _parse_json_obj(p.reactions_json)
        total = p.reactions_total or sum(reactions.values())

        linked: Optional[Dict[str, Any]] = None
        if p.linked_movie is not None:
            linked = {
                "type": "movie",
                "id": p.linked_movie.external_id,
                "title": p.linked_movie.title,
                "posterUrl": p.linked_movie.poster_url,
            }
        elif p.linked_type and p.linked_external_id and p.linked_title:
            linked = {
                "type": p.linked_type,
                "id": p.linked_external_id,
                "title": p.linked_title,
                "posterUrl": p.linked_poster_url,
            }

        return {
            "id": p.external_id,
            "userId": user.external_id,
            "userInfo": {
                "username": username,
                "displayName": display_name,
                "avatarUrl": avatar_url,
                "isVerified": False,
            },
            "content": {
                "text": p.content_text,
                "media": media if media else None,
                "linkedContent": linked,
                "hashtags": _parse_json_array(p.hashtags),
            },
            "engagement": {
                "reactions": {
                    **{"love": 0, "fire": 0, "mindblown": 0, "laugh": 0, "sad": 0, "angry": 0},
                    **reactions,
                    "total": total,
                },
                "comments": p.comments_count,
                "shares": p.shares_count,
                "hasCommented": False,
                "hasShared": False,
                "hasBookmarked": False,
            },
            "timestamp": p.created_at.replace(microsecond=0).isoformat() + "Z",
            "editedAt": p.edited_at.replace(microsecond=0).isoformat() + "Z" if p.edited_at else None,
        }

