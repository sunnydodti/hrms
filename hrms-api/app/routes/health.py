"""
Health check routes
Provides API health status
"""

from fastapi import APIRouter
from datetime import datetime

from app.models.common import HealthResponse

router = APIRouter(
    prefix="/health",
    tags=["Health"]
)


@router.get(
    "",
    response_model=HealthResponse,
    summary="Health check",
    description="Check if the API is running"
)
async def health_check():
    """
    Health check endpoint.
    
    Returns the current status and timestamp.
    Use this to verify that the API is running properly.
    """
    return HealthResponse(
        status="healthy",
        timestamp=datetime.utcnow()
    )
