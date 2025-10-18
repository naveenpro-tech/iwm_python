# Backend (FastAPI)

- Python venv recommended (Windows PS):
  - python -m venv .venv
  - .venv\\Scripts\\Activate.ps1
  - pip install -r apps/backend/requirements.txt

- Run with HTTP/2 (Hypercorn):
  - hypercorn apps.backend.src.main:app --bind 0.0.0.0:8000 --worker-class asyncio --h2

- Config via .env (copy .env.example)
- OpenAPI is exported on startup to packages/shared/openapi/openapi.json

