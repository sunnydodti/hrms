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
                <Card className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Employees</div>
                        </div>
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 ring-1 ring-blue-500/20">
                            <Users size={20} />
                        </div>
                    </div>
                    <div className="text-4xl font-bold text-white mb-1">{stats.totalEmployees}</div>
                    <div className="text-sm text-gray-400">Active employees</div>
                </Card>

                <Card className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Present Today</div>
                        </div>
                        <div className="p-2 bg-[#064E3B]/20 rounded-lg text-[#A7F3D0] ring-1 ring-[#064E3B]/50">
                            <CheckCircle size={20} />
                        </div>
                    </div>
                    <div className="text-4xl font-bold text-white mb-1">{stats.presentToday}</div>
                    <div className="text-sm text-gray-400">
                        {stats.totalEmployees > 0
                            ? `${Math.round((stats.presentToday / stats.totalEmployees) * 100)}% attendance`
                            : '0% attendance'}
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Absent Today</div>
                        </div>
                        <div className="p-2 bg-[#451A1A]/20 rounded-lg text-[#FECACA] ring-1 ring-[#451A1A]/50">
                            <XCircle size={20} />
                        </div>
                    </div>
                    <div className="text-4xl font-bold text-white mb-1">{stats.absentToday}</div>
                    <div className="text-sm text-gray-400">
                        {stats.totalEmployees > 0
                            ? `${Math.round((stats.absentToday / stats.totalEmployees) * 100)}% absent`
                            : '0% absent'}
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Departments</div>
                        </div>
                        <div className="p-2 bg-[#453006]/20 rounded-lg text-[#FDE68A] ring-1 ring-[#453006]/50">
                            <Building2 size={20} />
                        </div>
                    </div>
                    <div className="text-4xl font-bold text-white mb-1">{stats.activeDepartments}</div>
                    <div className="text-sm text-gray-400">Active departments</div>
                </Card>
            </div>

            <Card title="Today's Attendance">
                {!stats.recentAttendance || stats.recentAttendance.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No recent attendance records
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-[#111111]">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Employee ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Employee Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Department</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2A2A2A]">
                                {(stats.recentAttendance || []).map((record) => (
                                    <tr key={record.id} className="hover:bg-white/[0.02] transition-colors">
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
