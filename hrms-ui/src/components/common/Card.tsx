import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
    return (
        <div className={`card ${className}`}>
            {title && (
                <div className="card-header">
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                        {title}
                    </h3>
                </div>
            )}
            <div className="card-body">
                {children}
            </div>
        </div>
    );
};