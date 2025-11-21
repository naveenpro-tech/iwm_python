import sys
from pathlib import Path
import os

# Add project root to sys.path
project_root = Path(__file__).resolve().parents[2]
sys.path.append(str(project_root))

print(f"Project root: {project_root}")
print(f"Current working directory: {os.getcwd()}")

try:
    from apps.backend.src.config import settings
    print(f"Database URL from settings: {settings.database_url}")
    print(f"Env file path in config: {settings.model_config.get('env_file')}")
    
    env_path = Path(__file__).resolve().parent / ".env"
    print(f"Checking if .env exists at {env_path}: {env_path.exists()}")
    if env_path.exists():
        print("Content of .env:")
        print(env_path.read_text())
except Exception as e:
    print(f"Error loading settings: {e}")
