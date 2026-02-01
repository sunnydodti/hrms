import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Dashboard' },
        { path: '/employees', label: 'Employees' },
        { path: '/attendance', label: 'Attendance' },
    ];

    return (
        <header>
            <nav style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '1rem 2rem'
            }}>
                <div style={{
                    maxWidth: '80rem',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            HRMS Lite
                        </h1>
                        <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                            Human Resource Management System
                        </p>
                    </div>

                    <ul style={{
                        listStyle: 'none',
                        display: 'flex',
                        gap: '2rem',
                        margin: 0,
                        padding: 0
                    }}>
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    style={{
                                        color: 'white',
                                        textDecoration: 'none',
                                        opacity: location.pathname === item.path ? 1 : 0.9,
                                        fontWeight: location.pathname === item.path ? 600 : 400,
                                    }}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </header>
    );
};