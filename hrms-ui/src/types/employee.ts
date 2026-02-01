export interface Employee {
    id: string;
    employeeId: string;
    fullName: string;
    email: string;
    department: string;
    createdAt: string;
    presentCount?: number;
}

export interface EmployeeCreate {
    employeeId?: string;
    fullName: string;
    email: string;
    department: string;
}

export interface EmployeeResponse extends Employee { }

export interface EmployeeDeleteResponse {
    message: string;
    employeeId: string;
}