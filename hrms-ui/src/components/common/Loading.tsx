import React from 'react';

interface LoadingProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Loading: React.FC<LoadingProps> = ({ size = 'md', className = '' }) => {
    const sizeStyles = {
        sm: { width: '1rem', height: '1rem' },
        md: { width: '2rem', height: '2rem' },
        lg: { width: '3rem', height: '3rem' },
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className={className}>
            <div
                style={{
                    ...sizeStyles[size],
                    border: '2px solid #2563eb',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                }}
            ></div>
        </div>
    );
};