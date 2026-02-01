"""
Employee service layer
Handles business logic for employee operations
"""

from typing import List
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from app.models.employee import EmployeeCreate, EmployeeResponse, EmployeeDeleteResponse
from app.models.employee_model import Employee
from app.database.connection import db


class EmployeeService:
    """Service class for employee operations"""

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
                # Check if employee_id already exists
                existing = await session.execute(
                    select(Employee).where(Employee.employee_id == employee_data.employeeId)
                )
                if existing.scalar_one_or_none():
                    raise HTTPException(status_code=400, detail="Employee ID already exists")

                # Create new employee
                employee = Employee(
                    employee_id=employee_data.employeeId,
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
                raise HTTPException(status_code=400, detail="Employee ID already exists")

    async def get_all_employees(self) -> List[EmployeeResponse]:
        """
        Get all employees

        Returns:
            List of all employees
        """
        async with db.get_session() as session:
            result = await session.execute(select(Employee))
            employees = result.scalars().all()

            return [
                EmployeeResponse(
                    id=str(emp.id),
                    employeeId=emp.employee_id,
                    fullName=emp.full_name,
                    email=emp.email,
                    department=emp.department,
                    createdAt=emp.created_at
                )
                for emp in employees
            ]

    async def get_employee_by_id(self, employee_id: str) -> EmployeeResponse:
        """
        Get employee by ID

        Args:
            employee_id: Employee database ID

        Returns:
            Employee response

        Raises:
            HTTPException: If employee not found
        """
        async with db.get_session() as session:
            employee = await session.get(Employee, employee_id)
            if not employee:
                raise HTTPException(status_code=404, detail="Employee not found")

            return EmployeeResponse(
                id=str(employee.id),
                employeeId=employee.employee_id,
                fullName=employee.full_name,
                email=employee.email,
                department=employee.department,
                createdAt=employee.created_at
            )

    async def delete_employee(self, employee_id: str) -> EmployeeDeleteResponse:
        """
        Delete an employee

        Args:
            employee_id: Employee database ID to delete

        Returns:
            Deletion confirmation

        Raises:
            HTTPException: If employee not found
        """
        async with db.get_session() as session:
            employee = await session.get(Employee, employee_id)
            if not employee:
                raise HTTPException(status_code=404, detail="Employee not found")

            employee_id_str = employee.employee_id
            await session.delete(employee)
            await session.commit()

            return EmployeeDeleteResponse(
                message="Employee deleted successfully",
                employeeId=employee_id_str
            )


# Service instance
employee_service = EmployeeService()
