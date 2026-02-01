import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';
import { Link } from 'react-router-dom';
import { employeeService } from '../services/employeeService';
import { type Employee } from '../types/employee';
import { useToast } from '../context/ToastContext';
import { Plus, Trash2, Mail } from 'lucide-react';

export const EmployeeList: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { showToast } = useToast();

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await employeeService.getAllEmployees();
            setEmployees(Array.isArray(data) ? data : []);
        } catch (err) {
            setError('Failed to load employees');
            showToast('error', 'Failed to load employees');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEmployee = async (employeeId: string) => {
        if (!window.confirm(`Are you sure you want to delete employee ${employeeId}? This action cannot be undone.`)) {
            return;
        }

        try {
            await employeeService.deleteEmployee(employeeId);
            setEmployees(employees.filter(emp => emp.employeeId !== employeeId));
            showToast('success', 'Employee deleted successfully');
        } catch (err) {
            showToast('error', 'Failed to delete employee');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <Loading size="lg" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Employees
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Manage employee records ({(employees || []).length} total)
                    </p>
                </div>

                <Link to="/employees/add">
                    <Button className="flex items-center gap-2">
                        <Plus size={18} />
                        Add Employee
                    </Button>
                </Link>
            </div>

            <Card>
                {(!employees || employees.length === 0) && !error ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400 mb-4">
                            No employees found
                        </p>
                        <Link to="/employees/add">
                            <Button variant="secondary">Add First Employee</Button>
                        </Link>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-red-400 mb-4">{error}</p>
                        <Button onClick={fetchEmployees} variant="secondary">Try Again</Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-[#111111]">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Employee ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Full Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Department</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Present Days</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2A2A2A]">
                                {(employees || []).map((employee) => (
                                    <tr key={employee.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{employee.employeeId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{employee.fullName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            <div className="flex items-center gap-2">
                                                <Mail size={14} className="text-gray-500" />
                                                {employee.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {employee.department}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#064E3B]/20 text-[#A7F3D0] ring-1 ring-[#064E3B]/50">
                                                {employee.presentCount || 0} days
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => handleDeleteEmployee(employee.employeeId)}
                                                    className="text-red-400 hover:text-red-300 transition-colors p-1"
                                                    title="Delete Employee"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
};