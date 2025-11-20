from pathlib import Path

env_path = Path(".env")
content = """DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/moviemadders_local
JWT_SECRET_KEY=dev-secret-change-me-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXP_MINUTES=30
REFRESH_TOKEN_EXP_DAYS=7
CORS_ORIGINS=["http://localhost:3000"]
"""

# Write with utf-8 encoding (no BOM)
env_path.write_text(content, encoding="utf-8")
print(f"Fixed .env file at {env_path.absolute()}")
