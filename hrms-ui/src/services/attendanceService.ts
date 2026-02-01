import { api } from './api';
import { type Attendance, type AttendanceCreate, type AttendanceResponse } from '../types/attendance';

export const attendanceService = {
    // Mark attendance
    async markAttendance(attendance: AttendanceCreate): Promise<AttendanceResponse> {
        const response = await api.post('/api/attendance', attendance);
        return response.data;
    },

    // Get attendance for employee
    async getAttendanceByEmployee(employeeId: string): Promise<Attendance[]> {
        const response = await api.get(`/api/attendance/${employeeId}`);
        return response.data;
    },
};