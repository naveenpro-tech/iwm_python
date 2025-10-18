from __future__ import annotations

import os
from contextlib import asynccontextmanager
from pathlib import Path
import json

from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .logging_config import setup_logging, log
from .db import init_db
from .routers import health as health_router
from .routers import genres as genres_router
from .routers import movies as movies_router
from .routers import people as people_router
from .routers import search as search_router
from .routers import reviews as reviews_router
from .routers import collections as collections_router
from .routers import watchlist as watchlist_router
from .routers import favorites as favorites_router
from .routers import awards as awards_router
from .routers import box_office as box_office_router
from .routers import festivals as festivals_router
from .routers import scene_explorer as scene_explorer_router
from .routers import visual_treats as visual_treats_router
from .routers import pulse as pulse_router
from .routers import quiz as quiz_router
from .routers import talent_hub as talent_hub_router
from .routers import admin as admin_router
from .routers import notifications as notifications_router
from .routers import settings as settings_router
from .routers import auth as auth_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging(settings.log_level)
    log.info("starting_app", env=settings.env)
    await init_db()
    # Export OpenAPI JSON for shared contracts (do this on startup in lifespan)
    if settings.export_openapi_on_startup:
        here = Path(__file__).resolve()
        root = None
        for depth in range(3, 8):
            cand = here.parents[depth]
            if (cand / "packages" / "shared").exists():
                root = cand
                break
        if root is None:
            # Fallback to 4 levels up
            root = here.parents[4]
        target = root / "packages" / "shared" / "openapi" / "openapi.json"
        target.parent.mkdir(parents=True, exist_ok=True)
        with target.open("w", encoding="utf-8") as f:
            json.dump(app.openapi(), f, ensure_ascii=False, indent=2)
        log.info("openapi_exported", path=str(target))
    yield
    log.info("stopping_app")


is_prod = settings.env.lower() == "production"
app = FastAPI(
    title=settings.app_name,
    docs_url=None if is_prod else "/docs",
    redoc_url=None if is_prod else "/redoc",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api = APIRouter(prefix="/api/v1")
api.include_router(health_router.router)
api.include_router(genres_router.router)
api.include_router(movies_router.router)
api.include_router(people_router.router)
api.include_router(search_router.router)
api.include_router(reviews_router.router)
api.include_router(collections_router.router)
api.include_router(watchlist_router.router)
api.include_router(favorites_router.router)
api.include_router(box_office_router.router)
api.include_router(awards_router.router)
api.include_router(festivals_router.router)
api.include_router(scene_explorer_router.router)
api.include_router(visual_treats_router.router)
api.include_router(pulse_router.router)
api.include_router(quiz_router.router)
api.include_router(talent_hub_router.router)
api.include_router(admin_router.router)
api.include_router(settings_router.router)
api.include_router(notifications_router.router)
api.include_router(auth_router.router)
app.include_router(api)



