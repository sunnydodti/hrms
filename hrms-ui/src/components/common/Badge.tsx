
import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'success' | 'error' | 'warning' | 'default';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default' }) => {
    let baseStyles = "px-3 py-1 rounded-full text-xs font-medium inline-flex items-center justify-center";
    let variantStyles = "";

    switch (variant) {
        case 'success':
            variantStyles = "bg-green-100 text-green-800 border border-green-200";
            break;
        case 'error':
            variantStyles = "bg-red-100 text-red-800 border border-red-200";
            break;
        case 'warning':
            variantStyles = "bg-yellow-100 text-yellow-800 border border-yellow-200";
            break;
        default:
            variantStyles = "bg-gray-100 text-gray-800 border border-gray-200";
    }

    return (
        <span className={`${baseStyles} ${variantStyles}`}>
            {children}
        </span>
    );
};
