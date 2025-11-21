#!/usr/bin/env bash
set -euo pipefail
PYTHON_BIN="${PYTHON_BIN:-python3}"

echo "Creating venv at apps/backend/.venv"
$PYTHON_BIN -m venv apps/backend/.venv
source apps/backend/.venv/bin/activate
pip install --upgrade pip
pip install -r apps/backend/requirements.txt

echo "Done. Run backend with: hypercorn apps.backend.src.main:app --bind 0.0.0.0:8000 --worker-class asyncio --h2"

