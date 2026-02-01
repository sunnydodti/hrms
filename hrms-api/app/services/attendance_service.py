"""
Attendance service layer
Handles business logic for attendance operations
"""

from typing import List
from sqlalchemy import select, desc
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from app.models.attendance import AttendanceCreate, AttendanceResponse
from app.models.employee_model import Employee
from app.models.attendance_model import Attendance, AttendanceStatus
from app.database.connection import db


class AttendanceService:
    """Service class for attendance operations"""

    async def mark_attendance(self, attendance_data: AttendanceCreate) -> AttendanceResponse:
        """
        Mark attendance for an employee

        Args:
            attendance_data: Attendance creation data

        Returns:
            Created attendance response

        Raises:
            ValueError: If employee not found or duplicate attendance
        """
        async with db.get_session() as session:
            try:
                # Check if employee exists
                employee = await session.execute(
                    select(Employee).where(Employee.employee_id == attendance_data.employeeId)
                )
                employee = employee.scalar_one_or_none()
                if not employee:
                    raise ValueError("Employee not found")

                attendance = Attendance(
                    employee_id=attendance_data.employeeId,
                    date=attendance_data.date,
                    status=AttendanceStatus(attendance_data.status)
                )

                session.add(attendance)
                await session.commit()
                await session.refresh(attendance)

                return AttendanceResponse(
                    id=str(attendance.id),
                    employeeId=attendance.employee_id,
                    date=attendance.date,
                    status=attendance.status.value,
                    createdAt=attendance.created_at
                )

            except IntegrityError:
                await session.rollback()
                raise ValueError("Attendance already marked for this employee on this date")
            except SQLAlchemyError as e:
                await session.rollback()
                raise ValueError(f"Database error: {str(e)}")

    async def get_attendance_by_employee(self, employee_id: str) -> List[AttendanceResponse]:
        """
        Get all attendance records for an employee

        Args:
            employee_id: Employee identifier

        Returns:
            List of attendance records sorted by date (descending)

        Raises:
            ValueError: If employee not found
        """
        async with db.get_session() as session:
            try:
                # Check if employee exists
                employee = await session.execute(
                    select(Employee).where(Employee.employee_id == employee_id)
                )
                if not employee.scalar_one_or_none():
                    raise ValueError("Employee not found")

                result = await session.execute(
                    select(Attendance)
                    .where(Attendance.employee_id == employee_id)
                    .order_by(desc(Attendance.date))
                )
                attendance_records = result.scalars().all()

                return [
                    AttendanceResponse(
                        id=str(att.id),
                        employeeId=att.employee_id,
                        date=att.date,
                        status=att.status.value,
                        createdAt=att.created_at
                    )
                    for att in attendance_records
                ]
            except SQLAlchemyError as e:
                raise ValueError(f"Database error: {str(e)}")


# Service instance
attendance_service = AttendanceService()
