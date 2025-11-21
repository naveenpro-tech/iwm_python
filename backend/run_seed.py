import sys
import asyncio
from pathlib import Path

# add repository root to path so 'apps' package is importable
sys.path.append(str(Path(__file__).resolve().parents[2]))
from apps.backend.src.seed import seed  # type: ignore

if __name__ == "__main__":
    asyncio.run(seed())

