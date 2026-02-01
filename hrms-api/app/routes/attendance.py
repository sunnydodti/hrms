"""
Attendance routes
Defines all attendance-related API endpoints
"""

from fastapi import APIRouter, HTTPException, status
from typing import List

from app.models.attendance import AttendanceCreate, AttendanceResponse
from app.services.attendance_service import attendance_service

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)


@router.post(
    "",
    response_model=AttendanceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Mark attendance",
    description="Mark attendance for an employee on a specific date"
)
async def mark_attendance(attendance: AttendanceCreate):
    """
    Mark attendance for an employee.
    
    - **employeeId**: Employee identifier
    - **date**: Date of attendance (YYYY-MM-DD)
    - **status**: Either "Present" or "Absent"
    
    Returns the created attendance record.
    
    Raises:
    - 404: If employee not found
    - 409: If attendance already marked for this date
    """
    try:
        result = await attendance_service.mark_attendance(attendance)
        return result
    except ValueError as e:
        error_msg = str(e)
        if "not found" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=error_msg
            )
        elif "already exists" in error_msg.lower() or "duplicate" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=error_msg
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_msg
            )


@router.get(
    "/{employee_id}",
    response_model=List[AttendanceResponse],
    summary="Get attendance records",
    description="Get all attendance records for a specific employee"
)
async def get_attendance(employee_id: str):
    """
    Get all attendance records for an employee.
    
    - **employee_id**: Employee identifier
    
    Returns a list of attendance records sorted by date (most recent first).
    Returns an empty array if no attendance records exist.
    
    Raises:
    - 404: If employee not found
    """
    try:
        result = await attendance_service.get_attendance_by_employee(employee_id)
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
