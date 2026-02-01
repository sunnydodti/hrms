import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Link, useNavigate } from 'react-router-dom';
import { employeeService } from '../services/employeeService';
import { type EmployeeCreate } from '../types/employee';
import { useToast } from '../context/ToastContext';

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
        // Clear error when user starts typing
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
        } catch (err) {
            showToast('error', 'Failed to add employee');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>
                    Add Employee
                </h1>
                <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                    Create a new employee record
                </p>
            </div>

            <Card>
                <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="employeeId">
                                Employee ID (Optional)
                            </label>
                            <input
                                type="text"
                                id="employeeId"
                                name="employeeId"
                                className="form-input"
                                value={formData.employeeId}
                                onChange={handleInputChange}
                                placeholder="Auto-generated if left empty"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="fullName">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                className="form-input"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="Enter full name"
                                required
                            />
                            {errors.fullName && (
                                <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                    {errors.fullName}
                                </p>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="email">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-input"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter email address"
                                required
                            />
                            {errors.email && (
                                <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="department">
                                Department *
                            </label>
                            <select
                                id="department"
                                name="department"
                                className="form-input"
                                value={formData.department}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select a department</option>
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                            {errors.department && (
                                <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                    {errors.department}
                                </p>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <Button type="submit" isLoading={isLoading}>
                                {isLoading ? 'Adding...' : 'Add Employee'}
                            </Button>
                            <Link to="/employees">
                                <Button variant="secondary" type="button">
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </div>
                </form>
            </Card>
        </div>
    );
};