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
import { Calendar, User, CheckCircle2, XCircle } from 'lucide-react';

export const Attendance: React.FC = () => {
    const { showToast } = useToast();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<string>('');
    const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
    const [loadingEmployees, setLoadingEmployees] = useState(true);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [submitting, setSubmitting] = useState(false);

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
            fetchAttendanceHistory(selectedEmployee);
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to mark attendance';
            showToast('error', errorMessage);
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
                <h1 className="text-3xl font-bold text-white">
                    Attendance
                </h1>
                <p className="text-gray-400 mt-2">
                    Mark and view employee attendance records
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card title="Mark Attendance">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6">
                            <div>
                                <label htmlFor="employee" className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">
                                    <User size={14} />
                                    Employee
                                </label>
                                <select
                                    id="employee"
                                    value={selectedEmployee}
                                    onChange={handleEmployeeChange}
                                    className="w-full bg-[#111111] border-[#2A2A2A] text-white rounded-md px-4 py-2 focus:ring-2 focus:ring-[#2563EB] outline-none"
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
                                <label htmlFor="date" className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">
                                    <Calendar size={14} />
                                    Date
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#111111] border-[#2A2A2A] text-white rounded-md px-4 py-2 focus:ring-2 focus:ring-[#2563EB] outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">
                                    Status
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, status: 'Present' }))}
                                        className={`flex items-center justify-center gap-2 py-3 rounded-md transition-all ${formData.status === 'Present'
                                                ? 'bg-[#064E3B] text-[#A7F3D0] ring-1 ring-[#A7F3D0]'
                                                : 'bg-[#111111] text-gray-500 ring-1 ring-[#2A2A2A]'
                                            }`}
                                    >
                                        <CheckCircle2 size={18} />
                                        Present
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, status: 'Absent' }))}
                                        className={`flex items-center justify-center gap-2 py-3 rounded-md transition-all ${formData.status === 'Absent'
                                                ? 'bg-[#451A1A] text-[#FECACA] ring-1 ring-[#FECACA]'
                                                : 'bg-[#111111] text-gray-500 ring-1 ring-[#2A2A2A]'
                                            }`}
                                    >
                                        <XCircle size={18} />
                                        Absent
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                isLoading={submitting}
                                className="w-full mt-2"
                                disabled={!selectedEmployee}
                            >
                                Mark Attendance
                            </Button>
                        </form>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card title="Attendance History">
                        {!selectedEmployee ? (
                            <div className="flex flex-col items-center justify-center py-24 text-gray-500">
                                <User size={48} className="opacity-20 mb-4" />
                                <p>Select an employee to view history</p>
                            </div>
                        ) : loadingHistory ? (
                            <div className="flex justify-center py-24">
                                <Loading />
                            </div>
                        ) : (!attendanceHistory || attendanceHistory.length === 0) ? (
                            <div className="text-center py-24 text-gray-500">
                                <p>No records found for this employee</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-[#111111]">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Logged At</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#2A2A2A]">
                                        {(attendanceHistory || []).map((record) => (
                                            <tr key={record.id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
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