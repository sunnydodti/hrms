import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';
import { Link } from 'react-router-dom';
import { employeeService } from '../services/employeeService';
import { type Employee } from '../types/employee';
import { useToast } from '../context/ToastContext';

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
            setEmployees(data);
        } catch (err) {
            setError('Failed to load employees');
            showToast('error', 'Failed to load employees');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEmployee = async (employeeId: string) => {
        if (!window.confirm('Are you sure you want to delete this employee?')) {
            return;
        }

        try {
            await employeeService.deleteEmployee(employeeId);
            setEmployees(employees.filter(emp => emp.id !== employeeId));
            showToast('success', 'Employee deleted successfully');
        } catch (err) {
            showToast('error', 'Failed to delete employee');
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                <Loading size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>
                            Employees
                        </h1>
                        <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                            Manage employee records
                        </p>
                    </div>

                    <Link to="/employees/add">
                        <Button>Add Employee</Button>
                    </Link>
                </div>

                <Card>
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</p>
                        <Button onClick={fetchEmployees}>Try Again</Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>
                        Employees
                    </h1>
                    <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                        Manage employee records ({employees.length} total)
                    </p>
                </div>

                <Link to="/employees/add">
                    <Button>Add Employee</Button>
                </Link>
            </div>

            <Card>
                {employees.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                            No employees found
                        </p>
                        <Link to="/employees/add">
                            <Button>Add First Employee</Button>
                        </Link>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="table" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Employee ID</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Department</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((employee) => (
                                    <tr key={employee.id}>
                                        <td style={{ fontWeight: '500' }}>{employee.employeeId}</td>
                                        <td>{employee.fullName}</td>
                                        <td>
                                            <a href={`mailto:${employee.email}`} style={{ color: '#2563eb' }}>
                                                {employee.email}
                                            </a>
                                        </td>
                                        <td>
                                            <span style={{
                                                backgroundColor: '#f3f4f6',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '0.25rem',
                                                fontSize: '0.875rem'
                                            }}>
                                                {employee.department}
                                            </span>
                                        </td>
                                        <td style={{ color: '#6b7280' }}>
                                            {new Date(employee.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleDeleteEmployee(employee.id)}
                                                >
                                                    Delete
                                                </Button>
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