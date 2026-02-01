// API endpoints
export const API_ENDPOINTS = {
    HEALTH: '/api/health',
    EMPLOYEES: '/api/employees',
    ATTENDANCE: '/api/attendance',
};

// Departments list
export const DEPARTMENTS = [
    'Engineering',
    'Marketing',
    'Sales',
    'HR',
    'Finance',
    'Operations',
];

// Attendance status options
export const ATTENDANCE_STATUS = [
    { value: 'Present', label: 'Present' },
    { value: 'Absent', label: 'Absent' },
] as const;