export interface Attendance {
    id: string;
    employeeId: string;
    date: string;
    status: 'Present' | 'Absent';
    createdAt: string;
}

export interface AttendanceCreate {
    employeeId: string;
    date: string;
    status: 'Present' | 'Absent';
}

export interface AttendanceResponse extends Attendance { }