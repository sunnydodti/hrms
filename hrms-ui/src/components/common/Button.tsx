import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    children: React.ReactNode;
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    children,
    isLoading = false,
    className = '',
    disabled,
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center px-4 py-2 rounded-md transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm',
        secondary: 'bg-[#1F2937] hover:bg-[#374151] text-gray-300 ring-1 ring-[#374151]',
        danger: 'bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-sm',
    };

    return (
        <button
            className={`${baseClasses} ${variants[variant]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Loading...</span>
                </div>
            ) : (
                children
            )}
        </button>
    );
};