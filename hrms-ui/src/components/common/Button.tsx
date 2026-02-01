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
    const baseClasses = 'btn';
    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        danger: 'btn-danger',
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

    return (
        <button
            className={classes}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                        style={{
                            width: '1rem',
                            height: '1rem',
                            border: '2px solid white',
                            borderTop: '2px solid transparent',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            marginRight: '0.5rem'
                        }}
                    ></div>
                    Loading...
                </div>
            ) : (
                children
            )}
        </button>
    );
};