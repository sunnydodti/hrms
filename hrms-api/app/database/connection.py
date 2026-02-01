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
        
        db_url = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
        
        engine = create_async_engine(
            db_url,
            echo=os.getenv("ENVIRONMENT") == "development",
            future=True
        )
        
        async_session_maker = async_sessionmaker(
            engine,
            class_=AsyncSession,
            expire_on_commit=False
        )
        
        print("✅ PostgreSQL connected successfully")
    
    async def disconnect(self):
        global engine
        if engine:
            await engine.dispose()
            print("👋 PostgreSQL disconnected")
    
    def get_session(self):
        return async_session_maker()


db = Database()
