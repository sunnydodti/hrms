"""
Employee routes
Defines all employee-related API endpoints
"""

from fastapi import APIRouter, HTTPException, status
from typing import List

from app.models.employee import EmployeeCreate, EmployeeResponse, EmployeeDeleteResponse
from app.services.employee_service import employee_service

router = APIRouter(
    prefix="/employees",
    tags=["Employees"]
)


@router.post(
    "",
    response_model=EmployeeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new employee",
    description="Create a new employee (employee ID is auto-generated if not provided)"
)
async def create_employee(employee: EmployeeCreate):
    """
    Create a new employee with the following information:
    
    - **employeeId**: (Optional) Unique employee identifier (auto-generated as EMP001, EMP002, etc. if not provided)
    - **fullName**: Employee's full name
    - **email**: Valid email address
    - **department**: Department name
    
    Returns the created employee with database ID and timestamp.
    """
    try:
        result = await employee_service.create_employee(employee)
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get(
    "",
    response_model=List[EmployeeResponse],
    summary="Get all employees",
    description="Retrieve a list of all employees"
)
async def get_all_employees():
    """
    Get all employees in the system.
    
    Returns an empty array if no employees exist.
    """
    result = await employee_service.get_all_employees()
    return result


@router.get(
    "/{employee_id}",
    response_model=EmployeeResponse,
    summary="Get employee by ID",
    description="Retrieve a specific employee by their employee ID (e.g., EMP001)"
)
async def get_employee(employee_id: str):
    """
    Get a specific employee by their employee ID.
    
    - **employee_id**: Employee ID (e.g., EMP001)
    
    Returns 404 if employee not found.
    """
    try:
        result = await employee_service.get_employee_by_id(employee_id)
        return result
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {employee_id} not found"
        )


@router.delete(
    "/{employee_id}",
    response_model=EmployeeDeleteResponse,
    summary="Delete an employee",
    description="Delete an employee by their employee ID (e.g., EMP001)"
)
async def delete_employee(employee_id: str):
    """
    Delete an employee from the system.
    
    - **employee_id**: Employee ID (e.g., EMP001) to delete
    
    Returns confirmation message with employee ID.
    Returns 404 if employee not found.
    """
    try:
        result = await employee_service.delete_employee(employee_id)
        return result
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {employee_id} not found"
        )
