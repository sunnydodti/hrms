from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import employees, attendance, health
from app.database.connection import db

# Initialize FastAPI app
app = FastAPI(
    title="HRMS Lite API",
    description="Lightweight Human Resource Management System API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Update with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Startup event
@app.on_event("startup")
async def startup_event():
    """Connect to database on startup"""
    await db.connect()
    print("✅ Application started successfully")


# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Disconnect from database on shutdown"""
    await db.disconnect()
    print("👋 Application shutdown")


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


# Include routers with /api prefix
app.include_router(employees.router, prefix="/api")
app.include_router(attendance.router, prefix="/api")
app.include_router(health.router, prefix="/api")