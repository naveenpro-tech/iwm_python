import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parents[2]))
from apps.backend.src.config import settings  # type: ignore
print(settings.database_url)

