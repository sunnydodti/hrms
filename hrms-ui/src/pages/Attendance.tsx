import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Loading } from '../components/common/Loading';
import { employeeService } from '../services/employeeService';
import { attendanceService } from '../services/attendanceService';
import { type Employee } from '../types/employee';
import { type Attendance as AttendanceRecord, type AttendanceCreate } from '../types/attendance';
import { useToast } from '../context/ToastContext';

export const Attendance: React.FC = () => {
    const { showToast } = useToast();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<string>('');
    const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
    const [loadingEmployees, setLoadingEmployees] = useState(true);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState<Omit<AttendanceCreate, 'employeeId'>>({
        date: new Date().toISOString().split('T')[0],
        status: 'Present'
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        if (selectedEmployee) {
            fetchAttendanceHistory(selectedEmployee);
        } else {
            setAttendanceHistory([]);
        }
    }, [selectedEmployee]);

    const fetchEmployees = async () => {
        try {
            setLoadingEmployees(true);
            const data = await employeeService.getAllEmployees();
            setEmployees(Array.isArray(data) ? data : []);
        } catch (err) {
            showToast('error', 'Failed to load employees');
        } finally {
            setLoadingEmployees(false);
        }
    };

    const fetchAttendanceHistory = async (employeeId: string) => {
        try {
            setLoadingHistory(true);
            const data = await attendanceService.getAttendanceByEmployee(employeeId);
            setAttendanceHistory(Array.isArray(data) ? data : []);
        } catch (err) {
            showToast('error', 'Failed to load attendance history');
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleEmployeeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedEmployee(e.target.value);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedEmployee) {
            showToast('error', 'Please select an employee');
            return;
        }

        setSubmitting(true);
        try {
            await attendanceService.markAttendance({
                employeeId: selectedEmployee,
                ...formData
            } as AttendanceCreate);

            showToast('success', 'Attendance marked successfully');
            // Refresh history
            fetchAttendanceHistory(selectedEmployee);
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to mark attendance';
            if (errorMessage.includes('already exists')) {
                showToast('error', 'Attendance already marked for this date');
            } else {
                showToast('error', errorMessage);
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingEmployees) {
        return (
            <div className="flex justify-center p-12">
                <Loading size="lg" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Attendance
                </h1>
                <p className="text-gray-500 mt-2">
                    Mark and view employee attendance records
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Mark Attendance Form */}
                <div className="lg:col-span-1">
                    <Card title="Mark Attendance">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div>
                                <label htmlFor="employee" className="block text-sm font-medium text-gray-700 mb-2">
                                    Employee <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="employee"
                                    value={selectedEmployee}
                                    onChange={handleEmployeeChange}
                                    className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select employee</option>
                                    {(employees || []).map(emp => (
                                        <option key={emp.employeeId} value={emp.employeeId}>
                                            {emp.employeeId} - {emp.fullName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                                    Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-6 mt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="Present"
                                            checked={formData.status === 'Present'}
                                            onChange={handleInputChange}
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <span>Present</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="Absent"
                                            checked={formData.status === 'Absent'}
                                            onChange={handleInputChange}
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <span>Absent</span>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    isLoading={submitting}
                                    className="w-full"
                                    disabled={!selectedEmployee}
                                >
                                    Mark Attendance
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>

                {/* Right Column: Attendance History */}
                <div className="lg:col-span-2">
                    <Card title={selectedEmployee ? `Attendance History` : "Attendance History"}>
                        {!selectedEmployee ? (
                            <div className="text-center py-12 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <p>Select an employee to view their attendance history</p>
                            </div>
                        ) : loadingHistory ? (
                            <div className="flex justify-center py-12">
                                <Loading />
                            </div>
                        ) : (!attendanceHistory || attendanceHistory.length === 0) ? (
                            <div className="text-center py-12 text-gray-500">
                                <p>No attendance records found for this employee</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logged At</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {(attendanceHistory || []).map((record) => (
                                            <tr key={record.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                    {new Date(record.date).toLocaleDateString(undefined, {
                                                        weekday: 'short',
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Badge variant={record.status === 'Present' ? 'success' : 'error'}>
                                                        {record.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(record.createdAt).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};