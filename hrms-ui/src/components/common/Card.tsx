import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
    return (
        <div className={`bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg overflow-hidden ${className}`}>
            {title && (
                <div className="px-6 py-4 border-b border-[#2A2A2A]">
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                </div>
            )}
            <div>{children}</div>
        </div>
    );
};