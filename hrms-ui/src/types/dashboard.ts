
export interface RecentAttendance {
    id: string;
    employeeId: string;
    employeeName: string;
    department: string;
    date: string;
    status: 'Present' | 'Absent';
    createdAt: string;
}

export interface DashboardStats {
    totalEmployees: number;
    presentToday: number;
    absentToday: number;
    activeDepartments: number;
    recentAttendance: RecentAttendance[];
}
