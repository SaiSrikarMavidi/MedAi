import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Pill, Apple, Activity, LogOut, Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navigation = () => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { path: '/chat', icon: MessageSquare, label: 'Chat' },
        { path: '/doctors', icon: Users, label: 'Doctors' },
        { path: '/reminders', icon: Pill, label: 'Reminders' },
        { path: '/food', icon: Apple, label: 'Food Advisor' },
        { path: '/tracking', icon: Activity, label: 'Tracking' },
    ];

    const handleLogout = () => {
        // TODO: Implement logout logic
        navigate('/login');
    };

    return (
        <>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex fixed left-0 top-0 h-screen w-20 bg-white border-r border-neutral-200 flex-col items-center py-6 z-50">
                {/* Logo */}
                <div className="mb-8">
                    <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white" fill="white" />
                    </div>
                </div>

                {/* Nav Items */}
                <div className="flex-1 flex flex-col gap-4">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `relative w-12 h-12 rounded-xl flex items-center justify-center transition-all group ${isActive
                                    ? 'bg-primary-100 text-primary-600'
                                    : 'text-neutral-600 hover:bg-neutral-100'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon className="w-6 h-6" />
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className="absolute left-0 w-1 h-8 bg-primary-600 rounded-r-full"
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    {/* Tooltip */}
                                    <div className="absolute left-full ml-4 px-3 py-1.5 bg-neutral-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                        {item.label}
                                    </div>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-neutral-600 hover:bg-red-50 hover:text-red-600 transition-all group"
                >
                    <LogOut className="w-6 h-6" />
                    <div className="absolute left-full ml-4 px-3 py-1.5 bg-neutral-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Logout
                    </div>
                </button>
            </nav>

            {/* Mobile Navigation */}
            <div className="md:hidden">
                {/* Top Bar */}
                <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-4 z-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                            <Heart className="w-5 h-5 text-white" fill="white" />
                        </div>
                        <span className="font-semibold text-lg text-neutral-900">MediAI</span>
                    </div>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-neutral-100"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-16 left-0 right-0 bg-white border-b border-neutral-200 shadow-lg z-40"
                    >
                        <div className="p-4 space-y-2">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                            ? 'bg-primary-100 text-primary-600'
                                            : 'text-neutral-700 hover:bg-neutral-100'
                                        }`
                                    }
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </NavLink>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </>
    );
};

export default Navigation;
