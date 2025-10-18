from __future__ import annotations

from typing import Any, Dict, List, Optional
from datetime import datetime

from sqlalchemy import and_, or_, select, asc, desc, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy.dialects.postgresql import JSONB

from ..models import CastingCall, CastingCallRole, SubmissionGuidelines


class TalentHubRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    # --------------------------- DTO helpers ---------------------------
    def _role_to_dto(self, r: CastingCallRole) -> Dict[str, Any]:
        return {
            "id": r.external_id,
            "type": r.type,
            "title": r.title,
            "description": r.description,
            "category": r.category,
            "department": r.department,
            "compensation": r.compensation,
            "paymentDetails": r.payment_details,
            "requirements": r.requirements or {},
            "auditionType": r.audition_type,
        }

    def _call_to_dto(self, c: CastingCall, include_roles: bool = True, include_guidelines: bool = True) -> Dict[str, Any]:
        dto = {
            "id": c.external_id,
            "projectTitle": c.project_title,
            "projectType": c.project_type,
            "productionCompany": c.production_company,
            "description": c.description,
            "productionTimeline": {
                "start": c.production_start.isoformat() + "Z" if c.production_start else None,
                "end": c.production_end.isoformat() + "Z" if c.production_end else None,
            },
            "location": {
                "city": c.location_city,
                "state": c.location_state,
                "country": c.location_country,
            },
            "budgetRange": c.budget_range,
            "visibility": c.visibility,
            "submissionDeadline": c.submission_deadline.isoformat() + "Z" if c.submission_deadline else None,
            "postedDate": c.posted_date.isoformat() + "Z" if c.posted_date else None,
            "posterImage": c.poster_image,
            "isVerified": bool(c.is_verified),
            "status": c.status,
        }
        if include_roles:
            roles = sorted(c.roles, key=lambda x: x.id)
            dto["roles"] = [self._role_to_dto(r) for r in roles]
        else:
            dto["roles"] = []
        if include_guidelines and c.guidelines:
            g = c.guidelines
            dto["submissionGuidelines"] = {
                "requiredMaterials": g.required_materials or [],
                "submissionMethod": g.submission_method,
                "contactInfo": {"email": g.contact_email, "website": g.contact_website},
                "specialInstructions": g.special_instructions,
            }
        else:
            dto["submissionGuidelines"] = None
        return dto

    # --------------------------- Queries ---------------------------
    def _base_call_query(self):
        return select(CastingCall).options(
            selectinload(CastingCall.roles),
            selectinload(CastingCall.guidelines),
        )

    async def list_casting_calls(
        self,
        *,
        search: Optional[str] = None,
        project_type: Optional[str] = None,
        location: Optional[str] = None,
        status: Optional[str] = None,
        visibility: Optional[str] = None,
        budget_range: Optional[str] = None,
        role_type: Optional[str] = None,
        compensation: Optional[str] = None,
        experience_level: Optional[str] = None,
        sort_by: str = "newest",
        page: int = 1,
        limit: int = 20,
    ) -> List[Dict[str, Any]]:
        q = self._base_call_query()

        clauses = []
        if search:
            like = f"%{search.lower()}%"
            clauses.append(
                or_(func.lower(CastingCall.project_title).like(like), func.lower(CastingCall.description).like(like))
            )
        if project_type:
            clauses.append(CastingCall.project_type == project_type)
        if location:
            like = f"%{location.lower()}%"
            clauses.append(
                or_(
                    func.lower(CastingCall.location_city).like(like),
                    func.lower(CastingCall.location_state).like(like),
                    func.lower(CastingCall.location_country).like(like),
                )
            )
        if status:
            clauses.append(CastingCall.status == status)
        if visibility:
            clauses.append(CastingCall.visibility == visibility)
        if budget_range:
            clauses.append(CastingCall.budget_range == budget_range)

        # Role-based filters (join roles)
        joined = False
        if role_type or compensation or experience_level:
            q = q.join(CastingCallRole, CastingCallRole.call_id == CastingCall.id)
            joined = True
            if role_type:
                clauses.append(CastingCallRole.type == role_type)
            if compensation:
                clauses.append(CastingCallRole.compensation == compensation)
            if experience_level:
                # requirements->>'experienceLevel' = value
                clauses.append(CastingCallRole.requirements["experienceLevel"].astext == experience_level)

        if clauses:
            q = q.where(and_(*clauses))

        # Sorting
        if sort_by == "deadline":
            q = q.order_by(asc(CastingCall.submission_deadline))
        elif sort_by == "alphabetical":
            q = q.order_by(asc(CastingCall.project_title))
        else:  # newest
            q = q.order_by(desc(CastingCall.posted_date))

        # Pagination
        q = q.limit(limit).offset((page - 1) * limit)

        rows = (await self.session.execute(q)).scalars().unique().all()
        return [self._call_to_dto(c) for c in rows]

    async def get_casting_call_detail(self, call_external_id: str) -> Optional[Dict[str, Any]]:
        q = self._base_call_query().where(CastingCall.external_id == call_external_id)
        c = (await self.session.execute(q)).scalars().first()
        if not c:
            return None
        return self._call_to_dto(c, include_roles=True, include_guidelines=True)

