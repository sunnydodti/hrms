import React from 'react';
import { Button } from '../components/common/Button';
import { ShieldCheck, Users, Calendar, LayoutDashboard } from 'lucide-react';

interface WelcomeProps {
    onContinue: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onContinue }) => {
    return (
        <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center p-4 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-[#111111] to-[#111111]">
            <div className="max-w-3xl w-full text-center space-y-8">
                {/* Logo & Intro */}
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex p-3 rounded-2xl bg-blue-600/10 text-blue-500 ring-1 ring-blue-500/20 mb-2">
                        <Users size={32} />
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
                        HRMS <span className="text-blue-500">Lite</span>
                    </h1>
                    <p className="text-lg text-gray-400 max-w-xl mx-auto">
                        A modern, streamlined Human Resource Management System for the next generation of teams.
                    </p>
                </div>

                {/* Features Grid - Hidden on mobile for better CTA visibility */}
                <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-left space-y-2">
                        <LayoutDashboard className="text-blue-500" size={20} />
                        <h3 className="text-white font-bold text-sm">Analytics</h3>
                        <p className="text-[13px] text-gray-500 leading-relaxed text-pretty">Real-time insights into your workforce distribution and trends.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-left space-y-2">
                        <Users className="text-blue-500" size={20} />
                        <h3 className="text-white font-bold text-sm">Management</h3>
                        <p className="text-[13px] text-gray-500 leading-relaxed text-pretty">Manage profiles, departments, and secure digital records.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-left space-y-2">
                        <Calendar className="text-blue-500" size={20} />
                        <h3 className="text-white font-bold text-sm">Attendance</h3>
                        <p className="text-[13px] text-gray-500 leading-relaxed text-pretty">Track daily attendance with high-precision history logs.</p>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="pt-2 animate-in fade-in zoom-in-95 duration-700 delay-500">
                    <Button
                        onClick={onContinue}
                        size="lg"
                        className="px-10 py-4 text-base rounded-xl flex items-center gap-3 mx-auto shadow-2xl shadow-blue-500/20"
                    >
                        <ShieldCheck size={20} />
                        Continue as Admin
                    </Button>
                    <p className="mt-4 text-[12px] text-gray-500 flex items-center justify-center gap-2 italic">
                        By continuing, you gain full administrative access to HRMS Lite.
                    </p>
                </div>
            </div>

            {/* Subtle background detail */}
            <div className="fixed bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        </div>
    );
};
