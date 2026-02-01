import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'success' | 'error' | 'warning' | 'gray';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'gray' }) => {
    const variants = {
        success: 'bg-[#064E3B] text-[#A7F3D0] border border-[#065F46]',
        error: 'bg-[#451A1A] text-[#FECACA] border border-[#7F1D1D]',
        warning: 'bg-[#453006] text-[#FDE68A] border border-[#78350F]',
        gray: 'bg-[#1F2937] text-[#D1D5DB] border border-[#374151]',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
            {children}
        </span>
    );
};
