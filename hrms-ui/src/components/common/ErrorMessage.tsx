import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
    className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
    message,
    onRetry,
    className = ''
}) => {
    return (
        <div className={`flex flex-col items-center justify-center p-8 text-center bg-[#111111]/50 border border-white/5 rounded-xl animate-in fade-in zoom-in-95 duration-300 ${className}`}>
            <div className="p-3 bg-red-500/10 rounded-full text-red-500 mb-4 ring-1 ring-red-500/20">
                <AlertCircle size={32} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Something went wrong</h3>
            <p className="text-red-400 mb-6 max-w-sm mx-auto leading-relaxed">
                {message}
            </p>
            {onRetry && (
                <Button
                    variant="secondary"
                    onClick={onRetry}
                    className="flex items-center gap-2 px-6"
                >
                    <RefreshCw size={16} />
                    Try Again
                </Button>
            )}
        </div>
    );
};
