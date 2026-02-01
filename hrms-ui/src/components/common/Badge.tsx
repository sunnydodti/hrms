import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'success' | 'error' | 'warning' | 'gray';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'gray' }) => {
    const variants = {
        success: 'bg-[#064E3B] text-[#10B981] border border-[#065F46]',
        error: 'bg-[#451A1A] text-[#EF4444] border border-[#7F1D1D]',
        warning: 'bg-[#453006] text-[#F59E0B] border border-[#78350F]',
        gray: 'bg-[#1F2937] text-[#9CA3AF] border border-[#374151]',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
            {children}
        </span>
    );
};
