import React from 'react';
import { Card } from '../components/common/Card';

export const AddEmployee: React.FC = () => {
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
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: '#6b7280' }}>
                        Add employee form will be implemented in the next step
                    </p>
                </div>
            </Card>
        </div>
    );
};