param(
  [string]$Python = "python"
)

Write-Host "Creating venv at apps/backend/.venv"
& $Python -m venv apps/backend/.venv
Write-Host "Activating venv"
. "apps/backend/.venv/Scripts/Activate.ps1"
Write-Host "Installing requirements"
pip install -r apps/backend/requirements.txt
Write-Host "Done. Run backend with: hypercorn apps.backend.src.main:app --bind 0.0.0.0:8000 --worker-class asyncio --h2"

