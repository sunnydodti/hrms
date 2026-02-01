
from fastapi import APIRouter, Depends
from sqlalchemy import select, func, distinct, desc
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date
from typing import List, Dict, Any

from app.database.connection import db
from app.models.employee_model import Employee
from app.models.attendance_model import Attendance, AttendanceStatus

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/stats")
async def get_dashboard_stats():
    """
    Get dashboard statistics:
    - Total employees
    - Present today
    - Absent today
    - Active departments
    - Recent attendance
    """
    async with db.get_session() as session:
        # Total Employees
        total_employees = await session.execute(select(func.count(Employee.id)))
        total_employees = total_employees.scalar() or 0

        # Attendance Today
        today = date.today()
        
        present_today = await session.execute(
            select(func.count(Attendance.id))
            .where(Attendance.date == today)
            .where(Attendance.status == AttendanceStatus.Present)
        )
        present_today = present_today.scalar() or 0
        
        absent_today = await session.execute(
            select(func.count(Attendance.id))
            .where(Attendance.date == today)
            .where(Attendance.status == AttendanceStatus.Absent)
        )
        absent_today = absent_today.scalar() or 0

        # Active Departments
        active_departments = await session.execute(
            select(func.count(distinct(Employee.department)))
        )
        active_departments = active_departments.scalar() or 0

        # Recent Attendance (Last 5 records with employee details)
        recent_attendance_query = (
            select(Attendance, Employee)
            .join(Employee, Attendance.employee_id == Employee.employee_id)
            .order_by(desc(Attendance.date), desc(Attendance.created_at))
            .limit(5)
        )
        recent_attendance_result = await session.execute(recent_attendance_query)
        recent_attendance_rows = recent_attendance_result.all()
        
        recent_attendance = [
            {
                "id": str(att.id),
                "employeeId": emp.employee_id,
                "employeeName": emp.full_name,
                "department": emp.department,
                "date": att.date,
                "status": att.status.value,
                "createdAt": att.created_at
            }
            for att, emp in recent_attendance_rows
        ]

        return {
            "totalEmployees": total_employees,
            "presentToday": present_today,
            "absentToday": absent_today,
            "activeDepartments": active_departments,
            "recentAttendance": recent_attendance
        }
