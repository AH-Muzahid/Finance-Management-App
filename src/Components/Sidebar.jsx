import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { FaHome, FaPlus, FaList, FaChartBar, FaUser, FaTimes, FaBars } from 'react-icons/fa';
import useUser from '../hooks/useUser';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const [user] = useUser();
    const location = useLocation();

    const menuItems = [
        {
            name: 'Dashboard',
            path: '/',
            icon: <FaHome className="text-xl" />
        },
        {
            name: 'Add Transaction',
            path: '/dashboard/add-transaction',
            icon: <FaPlus className="text-xl" />
        },
        {
            name: 'My Transactions',
            path: '/dashboard/my-transactions',
            icon: <FaList className="text-xl" />
        },
        {
            name: 'Reports',
            path: '/dashboard/reports',
            icon: <FaChartBar className="text-xl" />
        },
        {
            name: 'Profile',
            path: '/dashboard/profile',
            icon: <FaUser className="text-xl" />
        }
    ];

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full bg-white dark:bg-base-200 border-r border-gray-200 dark:border-gray-700 z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 lg:static w-64`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <Link to="/" className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/30">
                            <span className="text-white font-bold text-lg">F</span>
                        </div>
                        <span className="text-xl font-bold text-base-content">FinEase</span>
                    </Link>
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden text-base-content hover:text-primary-500 transition-colors"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                {/* User Info */}
                {user && (
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500/20">
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FaUser className="text-primary-500 text-xl" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-base-content truncate">
                                    {user.displayName || 'User'}
                                </p>
                                <p className="text-xs text-base-content/60 truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Menu */}
                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${location.pathname === item.path
                                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30'
                                : 'text-base-content hover:bg-primary-50 dark:hover:bg-primary-900/20'
                                }`}
                        >
                            {item.icon}
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                {/* Footer Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-base-content/60 text-center">
                        © 2024 FinEase
                    </p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
