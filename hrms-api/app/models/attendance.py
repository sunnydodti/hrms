from pydantic import BaseModel, Field
from typing import Literal
from datetime import date as DateType, datetime


class AttendanceBase(BaseModel):
    employeeId: str = Field(..., description="Employee identifier")
    date: DateType = Field(..., description="Attendance date")
    status: Literal["Present", "Absent"] = Field(..., description="Attendance status")


class AttendanceCreate(AttendanceBase):
    """Schema for creating attendance record"""
    pass


class AttendanceResponse(AttendanceBase):
    """Schema for attendance response"""
    id: str = Field(..., description="Database ID")
    createdAt: datetime = Field(..., description="Creation timestamp")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439012",
                "employeeId": "EMP001",
                "date": "2026-02-01",
                "status": "Present",
                "createdAt": "2026-02-01T10:35:00Z"
            }
        }
