import asyncio
import os

if os.getenv("RENDER") or os.getenv("DYNO"):
    asyncio.set_event_loop_policy(asyncio.DefaultEventLoopPolicy())

from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.routes import employees, attendance, dashboard, health
from app.database.connection import db
from app.middleware.error_handler import ErrorHandlerMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()
    print("Application started successfully")
    yield
    await db.disconnect()
    print("Application shutdown")

app = FastAPI(
    title="HRMS Lite API",
    description="Lightweight Human Resource Management System API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

app.add_middleware(ErrorHandlerMiddleware)

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint - API information"""
    return {
        "message": "Welcome to HRMS Lite API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/health"
    }

@app.get("/debug/dbhost", tags=["Debug"])
async def debug_db_host():
    """Debug endpoint to test database host connectivity"""
    import socket
    try:
        # Test DNS resolution for Supabase host
        info = socket.getaddrinfo("slaldyilmhmvwvljuywz.pooler.supabase.com", 5432)
        return {
            "host": "slaldyilmhmvwvljuywz.pooler.supabase.com",
            "port": 5432,
            "addresses": [{"family": addr[0], "type": addr[1], "proto": addr[2], "ip": addr[4][0]} for addr in info],
            "status": "DNS resolution successful"
        }
    except Exception as e:
        return {
            "host": "slaldyilmhmvwvljuywz.pooler.supabase.com",
            "port": 5432,
            "error": str(e),
            "status": "DNS resolution failed"
        }


app.include_router(employees.router, prefix="/api")
app.include_router(attendance.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(health.router, prefix="/api")