import React, { useState, Suspense } from 'react';
import { Outlet, Link, useNavigate } from 'react-router';
import Sidebar from '../Components/Sidebar';
import PageSkeleton from '../Components/PageSkeleton';
import { FaBars, FaUser } from 'react-icons/fa';
import useUser from '../hooks/useUser';
import SimpleThemeToggle from '../Components/SimpleThemeToggle';
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase/firebase.init';
import toast from 'react-hot-toast';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user] = useUser();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        setIsDropdownOpen(false);
        localStorage.removeItem('user');
        await signOut(auth);
        toast.success('Logged out successfully!');
        navigate('/');
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-base-100">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white dark:bg-black/60 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden text-base-content hover:text-primary-500 transition-colors"
                        >
                            <FaBars className="text-2xl" />
                        </button>
                        <div className="flex items-center space-x-2 lg:hidden">
                            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/30">
                                <span className="text-white font-bold">F</span>
                            </div>
                            <span className="text-lg font-bold text-base-content">FinEase</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 ml-auto">
                        <SimpleThemeToggle />

                        {user && (
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full ring-2 ring-primary-500/20 overflow-hidden">
                                        {user.photoURL ? (
                                            <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="bg-primary-500 w-full h-full flex items-center justify-center">
                                                <FaUser className="text-white text-xs" />
                                            </div>
                                        )}
                                    </div>
                                    <span className="hidden md:block font-medium text-sm text-base-content">{user.displayName || 'User'}</span>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-base-200 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50">
                                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                            <p className="text-sm font-medium text-base-content">{user.displayName || 'User'}</p>
                                            <p className="text-xs text-base-content/70 truncate">{user.email}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Suspense fallback={<PageSkeleton />}>
                        <Outlet />
                    </Suspense>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
