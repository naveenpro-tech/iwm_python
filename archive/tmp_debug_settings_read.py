import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy import select
from apps.backend.src.config import settings
from apps.backend.src.models import User, UserSettings

async def main():
    eng = create_async_engine(settings.database_url, echo=False)
    Session = async_sessionmaker(eng, expire_on_commit=False)
    async with Session() as s:
        u = (await s.execute(select(User).where(User.external_id=="user-1"))).scalar_one_or_none()
        print("user-1 id:", getattr(u, "id", None))
        rows = (await s.execute(select(UserSettings))).scalars().all()
        print("user_settings count:", len(rows))
        if u:
            row = (await s.execute(select(UserSettings).where(UserSettings.user_id==u.id))).scalar_one_or_none()
            print("row for user-1 exists?", bool(row))
            if row:
                print("privacy:", row.privacy)

if __name__ == "__main__":
    asyncio.run(main())

