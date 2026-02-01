import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ToastMessage {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    duration?: number;
}

interface ToastProps {
    toast: ToastMessage;
    onRemove: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onRemove(toast.id);
        }, toast.duration || 5000);

        return () => clearTimeout(timer);
    }, [toast, onRemove]);

    const typeStyles = {
        success: { backgroundColor: '#10b981', color: 'white' },
        error: { backgroundColor: '#dc2626', color: 'white' },
        info: { backgroundColor: '#2563eb', color: 'white' },
        warning: { backgroundColor: '#f59e0b', color: 'white' },
    };

    return (
        <div style={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            zIndex: 50,
            padding: '1rem',
            borderRadius: '0.375rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            maxWidth: '28rem',
            ...typeStyles[toast.type]
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <p style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    margin: 0
                }}>
                    {toast.message}
                </p>
                <button
                    onClick={() => onRemove(toast.id)}
                    style={{
                        marginLeft: '1rem',
                        color: 'white',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0
                    }}
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};