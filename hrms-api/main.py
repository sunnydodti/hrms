import asyncio
import os

# Disable uvloop on Render/PaaS platforms to avoid networking issues
# uvloop can cause IPv6 connectivity problems on cloud platforms
if os.getenv("RENDER") or os.getenv("DYNO"):  # Render or Heroku detection
    asyncio.set_event_loop_policy(asyncio.DefaultEventLoopPolicy())

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.routes import employees, attendance, health
from app.database.connection import db

# Lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await db.connect()
    print("✅ Application started successfully")
    yield
    # Shutdown
    await db.disconnect()
    print("👋 Application shutdown")

# Initialize FastAPI app
app = FastAPI(
    title="HRMS Lite API",
    description="Lightweight Human Resource Management System API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Update with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint - API information"""
    return {
        "message": "Welcome to HRMS Lite API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/health"
    }

# Debug endpoint for network connectivity testing (remove in production)
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


# Include routers with /api prefix
app.include_router(employees.router, prefix="/api")
app.include_router(attendance.router, prefix="/api")
app.include_router(health.router, prefix="/api")