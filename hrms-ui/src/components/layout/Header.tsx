import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { path: '/', label: 'Dashboard' },
        { path: '/employees', label: 'Employees' },
        { path: '/attendance', label: 'Attendance' },
    ];

    return (
        <header className="bg-[#2563EB] shadow-md">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0 flex items-center gap-4">
                        <div>
                            <h1 className="text-xl font-bold text-white leading-tight">
                                HRMS Lite
                            </h1>
                            <p className="text-[10px] text-blue-100 uppercase tracking-widest opacity-80 font-semibold">
                                System Management
                            </p>
                        </div>
                        <div className="px-2 py-1 bg-white/10 border border-white/20 rounded-md">
                            <span className="text-[10px] font-bold text-white tracking-widest">ADMIN</span>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <ul className="flex items-center space-x-8">
                            {navItems.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`text-sm font-medium transition-colors duration-200 ${location.pathname === item.path
                                            ? 'text-white bg-blue-700 px-3 py-2 rounded-md'
                                            : 'text-blue-100 hover:text-white hover:bg-blue-500 px-3 py-2 rounded-md'
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-white hover:text-blue-100 focus:outline-none p-2"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div className="md:hidden pb-4">
                        <ul className="flex flex-col space-y-2">
                            {navItems.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`block text-sm font-medium px-3 py-2 rounded-md ${location.pathname === item.path
                                            ? 'text-white bg-blue-700'
                                            : 'text-blue-100 hover:text-white hover:bg-blue-500'
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </nav>
        </header>
    );
};