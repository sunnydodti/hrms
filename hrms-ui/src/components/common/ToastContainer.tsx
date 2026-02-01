import React from 'react';
import { useToast } from '../../context/ToastContext';
import { Toast } from './Toast';

export const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToast();

    return (
        <>
            {toasts.map((toast, index) => (
                <Toast
                    key={toast.id}
                    toast={toast}
                    onRemove={removeToast}
                />
            ))}
        </>
    );
};