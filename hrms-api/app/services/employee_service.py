"""
Employee service layer
Handles business logic for employee operations
"""

from typing import List
from sqlalchemy import select, func, Integer
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from app.models.employee import EmployeeCreate, EmployeeResponse, EmployeeDeleteResponse
from app.models.employee_model import Employee
from app.models.attendance_model import Attendance, AttendanceStatus
from app.database.connection import db


class EmployeeService:
    """Service class for employee operations"""

    async def _generate_employee_id(self, session) -> str:
        """Generate a unique employee ID in format EMP001, EMP002, etc."""
        result = await session.execute(
            select(func.max(func.cast(func.substr(Employee.employee_id, 4), Integer)))
            .where(Employee.employee_id.like('EMP%'))
        )
        max_num = result.scalar() or 0
        next_num = max_num + 1
        return f"EMP{next_num:03d}"

    async def create_employee(self, employee_data: EmployeeCreate) -> EmployeeResponse:
        """
        Create a new employee

        Args:
            employee_data: Employee creation data

        Returns:
            Created employee response
        """
        async with db.get_session() as session:
            try:
                employee_id = employee_data.employeeId
                if not employee_id:
                    employee_id = await self._generate_employee_id(session)

                existing = await session.execute(
                    select(Employee).where(Employee.employee_id == employee_id)
                )
                if existing.scalar_one_or_none():
                    raise ValueError("Employee ID already exists")

                employee = Employee(
                    employee_id=employee_id,
                    full_name=employee_data.fullName,
                    email=employee_data.email,
                    department=employee_data.department
                )

                session.add(employee)
                await session.commit()
                await session.refresh(employee)

                return EmployeeResponse(
                    id=str(employee.id),
                    employeeId=employee.employee_id,
                    fullName=employee.full_name,
                    email=employee.email,
                    department=employee.department,
                    createdAt=employee.created_at
                )

            except IntegrityError:
                await session.rollback()
                raise ValueError("Employee ID already exists")

    async def get_all_employees(self) -> List[EmployeeResponse]:
        """
        Get all employees with their total present days count

        Returns:
            List of all employees
        """
        async with db.get_session() as session:
            # Subquery to count present days
            present_subquery = (
                select(func.count(Attendance.id))
                .where(Attendance.employee_id == Employee.employee_id)
                .where(Attendance.status == AttendanceStatus.Present)
                .label("present_count")
            )

            result = await session.execute(
                select(Employee, present_subquery)
            )
            rows = result.all()

            return [
                EmployeeResponse(
                    id=str(emp.id),
                    employeeId=emp.employee_id,
                    fullName=emp.full_name,
                    email=emp.email,
                    department=emp.department,
                    createdAt=emp.created_at,
                    presentCount=present_count
                )
                for emp, present_count in rows
            ]

    async def get_employee_by_id(self, employee_id: str) -> EmployeeResponse:
        """
        Get employee by employee ID (e.g., EMP001) with present days count
        
        Args:
            employee_id: Employee identifier (e.g., EMP001)
            
        Returns:
            Employee response
            
        Raises:
            ValueError: If employee not found
        """
        async with db.get_session() as session:
            # Subquery to count present days
            present_subquery = (
                select(func.count(Attendance.id))
                .where(Attendance.employee_id == employee_id)
                .where(Attendance.status == AttendanceStatus.Present)
                .label("present_count")
            )

            result = await session.execute(
                select(Employee, present_subquery)
                .where(Employee.employee_id == employee_id)
            )
            row = result.first()
            if not row:
                raise ValueError("Employee not found")

            emp, present_count = row
            return EmployeeResponse(
                id=str(emp.id),
                employeeId=emp.employee_id,
                fullName=emp.full_name,
                email=emp.email,
                department=emp.department,
                createdAt=emp.created_at,
                presentCount=present_count
            )

    async def delete_employee(self, employee_id: str) -> EmployeeDeleteResponse:
        """
        Delete an employee

        Args:
            employee_id: Employee identifier (e.g., EMP001) to delete

        Returns:
            Deletion confirmation

        Raises:
            ValueError: If employee not found
        """
        async with db.get_session() as session:
            employee = await session.execute(
                select(Employee).where(Employee.employee_id == employee_id)
            )
            employee = employee.scalar_one_or_none()
            if not employee:
                raise ValueError("Employee not found")

            employee_id_str = employee.employee_id
            await session.delete(employee)
            await session.commit()

            return EmployeeDeleteResponse(
                message="Employee deleted successfully",
                employeeId=employee_id_str
            )


# Service instance
employee_service = EmployeeService()
