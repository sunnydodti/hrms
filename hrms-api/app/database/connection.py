from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

Base = declarative_base()
engine = None
async_session_maker = None


class Database:

    def __init__(self):
        self.engine = None
        self.session_maker = None

    async def connect(self):
        global engine, async_session_maker

        # Determine which driver to use based on environment and availability
        use_pooler = "pooler.supabase.com" in DATABASE_URL

        if use_pooler:
            # Always use psycopg for pooler connections (more stable)
            db_url = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://")
            driver_name = "psycopg"
            connect_args = {"sslmode": "require"}
        else:
            # For direct connections, use asyncpg
            db_url = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
            driver_name = "asyncpg"
            connect_args = {"ssl": "require"}

        engine = create_async_engine(
            db_url,
            echo=os.getenv("ENVIRONMENT") == "development",
            future=True,
            # Add connection pooling and timeout settings for better cloud compatibility
            pool_size=5,
            max_overflow=10,
            pool_timeout=30,
            pool_recycle=3600,
            connect_args=connect_args,
        )

        async_session_maker = async_sessionmaker(
            engine,
            class_=AsyncSession,
            expire_on_commit=False
        )

        print(f"✅ PostgreSQL connected successfully using {driver_name}")
        print(f"📍 Using database: {'Pooler (Production)' if use_pooler else 'Direct (Development)'}")

    async def disconnect(self):
        global engine
        if engine:
            await engine.dispose()
            print("👋 PostgreSQL disconnected")

    def get_session(self):
        return async_session_maker()


db = Database()
