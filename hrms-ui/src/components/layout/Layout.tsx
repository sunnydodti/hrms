import React from 'react';
import { Header } from './Header';
import { ToastContainer } from '../common/ToastContainer';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#111111]">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
            <ToastContainer />
        </div>
    );
};