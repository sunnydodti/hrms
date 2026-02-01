import React from 'react';
import { Header } from './Header';
import { ToastContainer } from '../common/ToastContainer';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <Header />
            <main className="main-layout">
                {children}
            </main>
            <ToastContainer />
        </div>
    );
};