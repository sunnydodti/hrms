from pydantic import BaseModel
from datetime import datetime


class HealthResponse(BaseModel):
    """Schema for health check response"""
    status: str
    timestamp: datetime

    class Config:
        json_schema_extra = {
            "example": {
                "status": "healthy",
                "timestamp": "2026-02-01T10:40:00Z"
            }
        }


class ErrorResponse(BaseModel):
    """Schema for error responses"""
    detail: str
    type: str

    class Config:
        json_schema_extra = {
            "example": {
                "detail": "Resource not found",
                "type": "not_found"
            }
        }
