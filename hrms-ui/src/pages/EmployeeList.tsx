import React from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';

export const EmployeeList: React.FC = () => {
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
                    <p style={{ color: '#6b7280' }}>
                        Employee list will be implemented in the next step
                    </p>
                </div>
            </Card>
        </div>
    );
};