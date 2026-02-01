import React from 'react';
import { Card } from '../components/common/Card';

export const Dashboard: React.FC = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>
                    Dashboard
                </h1>
                <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                    Welcome to HRMS Lite
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem'
            }}>
                <Card>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>0</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Employees</div>
                    </div>
                </Card>

                <Card>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>0</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Present Today</div>
                    </div>
                </Card>

                <Card>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}>0</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Absent Today</div>
                    </div>
                </Card>

                <Card>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>0</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Departments</div>
                    </div>
                </Card>
            </div>

            <Card title="Quick Actions">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1rem'
                }}>
                    <a
                        href="/employees"
                        style={{
                            display: 'block',
                            padding: '1rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            textDecoration: 'none',
                            color: 'inherit',
                        }}
                    >
                        <h3 style={{ fontWeight: '600', color: '#111827', margin: '0 0 0.5rem 0' }}>
                            Manage Employees
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                            Add, view, and manage employee records
                        </p>
                    </a>

                    <a
                        href="/attendance"
                        style={{
                            display: 'block',
                            padding: '1rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            textDecoration: 'none',
                            color: 'inherit',
                        }}
                    >
                        <h3 style={{ fontWeight: '600', color: '#111827', margin: '0 0 0.5rem 0' }}>
                            Track Attendance
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                            Mark and view employee attendance
                        </p>
                    </a>
                </div>
            </Card>
        </div>
    );
};