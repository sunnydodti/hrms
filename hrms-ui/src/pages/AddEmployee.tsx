import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Link, useNavigate } from 'react-router-dom';
import { employeeService } from '../services/employeeService';
import { type EmployeeCreate } from '../types/employee';
import { useToast } from '../context/ToastContext';
import { UserPlus, ArrowLeft, Mail, Briefcase, Hash } from 'lucide-react';

export const AddEmployee: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<EmployeeCreate>({
        employeeId: '',
        fullName: '',
        email: '',
        department: ''
    });
    const [errors, setErrors] = useState<Partial<EmployeeCreate>>({});

    const departments = [
        'Engineering',
        'Marketing',
        'Sales',
        'Human Resources',
        'Finance',
        'Operations',
        'Customer Support',
        'Product Management'
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name as keyof EmployeeCreate]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<EmployeeCreate> = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.department) {
            newErrors.department = 'Department is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            await employeeService.createEmployee(formData);
            showToast('success', 'Employee added successfully');
            navigate('/employees');
        } catch (err: any) {
            const message = err.response?.data?.detail || 'Failed to add employee';
            showToast('error', message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Link to="/employees" className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Add Employee
                    </h1>
                    <p className="text-gray-400 mt-1">
                        Create a new record in the HR system
                    </p>
                </div>
            </div>

            <Card className="p-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                        <label htmlFor="employeeId" className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">
                            <Hash size={14} />
                            Employee ID (Optional)
                        </label>
                        <input
                            type="text"
                            id="employeeId"
                            name="employeeId"
                            value={formData.employeeId}
                            onChange={handleInputChange}
                            className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-md px-4 py-2.5 focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all placeholder:text-gray-600"
                            placeholder="Auto-generated (e.g., EMP001)"
                        />
                        <p className="text-xs text-gray-500 mt-2 italic">Leave empty to use next available ID</p>
                    </div>

                    <div>
                        <label htmlFor="fullName" className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">
                            <UserPlus size={14} />
                            Full Name *
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className={`w-full bg-[#111111] border ${errors.fullName ? 'border-red-500/50' : 'border-[#2A2A2A]'} text-white rounded-md px-4 py-2.5 focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all placeholder:text-gray-600`}
                            placeholder="e.g. Jane Smith"
                            required
                        />
                        {errors.fullName && (
                            <p className="text-red-500 text-xs mt-2 font-medium">
                                {errors.fullName}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email" className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">
                            <Mail size={14} />
                            Email Address *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full bg-[#111111] border ${errors.email ? 'border-red-500/50' : 'border-[#2A2A2A]'} text-white rounded-md px-4 py-2.5 focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all placeholder:text-gray-600`}
                            placeholder="jane@company.com"
                            required
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-2 font-medium">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="department" className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">
                            <Briefcase size={14} />
                            Department *
                        </label>
                        <select
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            className={`w-full bg-[#111111] border ${errors.department ? 'border-red-500/50' : 'border-[#2A2A2A]'} text-white rounded-md px-4 py-2.5 focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all`}
                            required
                        >
                            <option value="">Select a department</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                        {errors.department && (
                            <p className="text-red-500 text-xs mt-2 font-medium">
                                {errors.department}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-4 mt-4 pt-6 border-t border-[#2A2A2A]">
                        <Button type="submit" isLoading={isLoading} className="flex-1 py-3">
                            Add Employee
                        </Button>
                        <Link to="/employees" className="flex-1">
                            <Button variant="secondary" type="button" className="w-full py-3">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </form>
            </Card>
        </div>
    );
};