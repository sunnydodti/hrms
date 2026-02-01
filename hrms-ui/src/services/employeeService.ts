import { api } from './api';
import { type Employee, type EmployeeCreate, type EmployeeResponse, type EmployeeDeleteResponse } from '../types/employee';

export const employeeService = {
    // Get all employees
    async getAllEmployees(): Promise<Employee[]> {
        const response = await api.get('/api/employees');
        return response.data;
    },

    // Get employee by ID
    async getEmployeeById(employeeId: string): Promise<Employee> {
        const response = await api.get(`/api/employees/${employeeId}`);
        return response.data;
    },

    // Create new employee
    async createEmployee(employee: EmployeeCreate): Promise<EmployeeResponse> {
        const response = await api.post('/api/employees', employee);
        return response.data;
    },

    // Delete employee
    async deleteEmployee(employeeId: string): Promise<EmployeeDeleteResponse> {
        const response = await api.delete(`/api/employees/${employeeId}`);
        return response.data;
    },
};