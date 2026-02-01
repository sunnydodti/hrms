from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class EmployeeBase(BaseModel):
    employeeId: str = Field(..., description="Unique employee identifier")
    fullName: str = Field(..., min_length=1, description="Employee full name")
    email: EmailStr = Field(..., description="Employee email address")
    department: str = Field(..., min_length=1, description="Department name")


class EmployeeCreate(BaseModel):
    """Schema for creating a new employee"""
    fullName: str = Field(..., min_length=1, description="Employee full name")
    email: EmailStr = Field(..., description="Employee email address")
    department: str = Field(..., min_length=1, description="Department name")
    employeeId: Optional[str] = Field(None, description="Optional employee identifier (auto-generated if not provided)")


class EmployeeResponse(EmployeeBase):
    """Schema for employee response"""
    id: str = Field(..., description="Database ID")
    createdAt: datetime = Field(..., description="Creation timestamp")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "employeeId": "EMP001",
                "fullName": "John Doe",
                "email": "john.doe@company.com",
                "department": "Engineering",
                "createdAt": "2026-02-01T10:30:00Z"
            }
        }


class EmployeeDeleteResponse(BaseModel):
    """Schema for employee deletion response"""
    message: str
    employeeId: str

    class Config:
        json_schema_extra = {
            "example": {
                "message": "Employee deleted successfully",
                "employeeId": "EMP001"
            }
        }
