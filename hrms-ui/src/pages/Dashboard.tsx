import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Loading } from '../components/common/Loading';
import { Badge } from '../components/common/Badge';
import { useToast } from '../context/ToastContext';
import { dashboardService } from '../services/dashboardService';
import { type DashboardStats } from '../types/dashboard';
import { Users, CheckCircle, XCircle, Building2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
    const { showToast } = useToast();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await dashboardService.getStats();
            setStats(data);
        } catch (err) {
            showToast('error', 'Failed to load dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <Loading size="lg" />
            </div>
        );
    }

    if (!stats) {
        return null;
    }

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold text-white">
                    Dashboard
                </h1>
                <p className="text-gray-400 mt-2">
                    Overview of your HRMS statistics
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 bg-[#1f2937] shadow-lg rounded-xl border border-gray-800">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="text-sm font-medium text-gray-400 uppercase tracking-wide">Total Employees</div>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
                            <Users size={24} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.totalEmployees}</div>
                    <div className="text-sm text-gray-500">Active employees</div>
                </Card>

                <Card className="p-6 bg-gray-800 border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="text-sm font-medium text-gray-400 uppercase tracking-wide">Present Today</div>
                        </div>
                        <div className="p-3 bg-green-500/10 rounded-lg text-green-500">
                            <CheckCircle size={24} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.presentToday}</div>
                    <div className="text-sm text-gray-500">
                        {stats.totalEmployees > 0
                            ? `${Math.round((stats.presentToday / stats.totalEmployees) * 100)}% attendance`
                            : '0% attendance'}
                    </div>
                </Card>

                <Card className="p-6 bg-gray-800 border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="text-sm font-medium text-gray-400 uppercase tracking-wide">Absent Today</div>
                        </div>
                        <div className="p-3 bg-red-500/10 rounded-lg text-red-500">
                            <XCircle size={24} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.absentToday}</div>
                    <div className="text-sm text-gray-500">
                        {stats.totalEmployees > 0
                            ? `${Math.round((stats.absentToday / stats.totalEmployees) * 100)}% absent`
                            : '0% absent'}
                    </div>
                </Card>

                <Card className="p-6 bg-gray-800 border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="text-sm font-medium text-gray-400 uppercase tracking-wide">Departments</div>
                        </div>
                        <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-500">
                            <Building2 size={24} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.activeDepartments}</div>
                    <div className="text-sm text-gray-500">Active departments</div>
                </Card>
            </div>

            <Card title="Today's Attendance" className="bg-[#1f2937] shadow-lg rounded-xl border border-gray-800">
                {(!stats.recentAttendance || stats.recentAttendance.length === 0) ? (
                    <div className="text-center py-8 text-gray-500">
                        No recent attendance records
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Employee ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Employee Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Department</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {(stats.recentAttendance || []).map((record) => (
                                    <tr key={record.id} className="hover:bg-gray-700/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {record.employeeId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                            {record.employeeName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {record.department}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant={record.status === 'Present' ? 'success' : 'error'}>
                                                {record.status}
                                            </Badge>
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
