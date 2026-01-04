import React, { useState, Suspense } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import Sidebar from '../Components/Sidebar';
import PageSkeleton from '../Components/PageSkeleton';
import { FaBars, FaUser, FaBell, FaSearch } from 'react-icons/fa';
import useUser from '../hooks/useUser';
import SimpleThemeToggle from '../Components/SimpleThemeToggle';
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase/firebase.init';
import toast from 'react-hot-toast';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user] = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    // Notifications State
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    // Helper to get page title based on path
    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/dashboard') return 'Overview';
        if (path.includes('my-transactions')) return 'Transactions';
        if (path.includes('add-transaction')) return 'Add Transaction';
        if (path.includes('profile')) return 'My Profile';
        return 'Dashboard';
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            navigate(`/dashboard/my-transactions?search=${searchQuery}`);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-base-100">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Modern Glassmorphism Header */}
                <header className="px-6 py-4 flex items-center justify-between sticky top-0 z-30 bg-white/80 dark:bg-base-200/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800 transition-all duration-300">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-2 rounded-xl text-base-content hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <FaBars className="text-xl" />
                        </button>

                        <div>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white leading-tight hidden md:block">
                                {getPageTitle()}
                            </h2>
                            <Link to="/" className="text-lg font-bold text-orange-500 dark:text-orange-400 leading-tight md:hidden">
                                FinEase
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Functional Search Bar */}
                        <div className="hidden md:flex items-center bg-gray-100 dark:bg-base-100 px-4 py-2 rounded-xl border border-transparent focus-within:border-primary-500/50 focus-within:ring-2 focus-within:ring-primary-500/10 transition-all w-64">
                            <FaSearch className="text-gray-400 mr-2 text-sm" />
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                className="bg-transparent border-none outline-none text-sm w-full text-base-content placeholder-gray-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                        </div>

                        <SimpleThemeToggle />

                        {/* Notification Bell */}
                        <div className="relative">
                            <button
                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                                className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-500 transition-all relative"
                            >
                                <FaBell className="text-lg" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-base-200"></span>
                            </button>

                            {isNotifOpen && (
                                <div className="absolute md:right-0 -right-13 mt-2 w-80 bg-white dark:bg-base-200 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in-up">
                                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                        <h3 className="font-bold text-base-content">Notifications</h3>
                                        <span className="text-xs text-primary-500 font-semibold cursor-pointer" onClick={() => setIsNotifOpen(false)}>Mark all read</span>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        <div className="p-4 hover:bg-gray-50 dark:hover:bg-base-300 transition-colors border-b border-gray-50 dark:border-gray-700/50 cursor-pointer">
                                            <div className="flex gap-3">
                                                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                                                <div>
                                                    <p className="text-sm font-semibold text-base-content">Welcome to FinEase!</p>
                                                    <p className="text-xs text-gray-500 mt-1">Start tracking your expenses effectively today.</p>
                                                    <p className="text-[10px] text-gray-400 mt-1">2 hours ago</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 hover:bg-gray-50 dark:hover:bg-base-300 transition-colors cursor-pointer">
                                            <div className="flex gap-3">
                                                <div className="w-2 h-2 mt-2 rounded-full bg-orange-500 flex-shrink-0"></div>
                                                <div>
                                                    <p className="text-sm font-semibold text-base-content">New Feature Alert</p>
                                                    <p className="text-xs text-gray-500 mt-1">Check out the new monthly pulse chart on your dashboard.</p>
                                                    <p className="text-[10px] text-gray-400 mt-1">1 day ago</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-base-300/50 text-center border-t border-gray-100 dark:border-gray-700">
                                        <button className="text-xs font-semibold text-base-content/70 hover:text-primary-500 transition-colors">View All Notifications</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Minimal Profile Link */}
                        <Link to="/dashboard/profile" className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 p-1.5 rounded-xl transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-primary-500 p-[2px]">
                                <div className="w-full h-full rounded-full bg-white dark:bg-base-300 overflow-hidden">
                                    {user?.photoURL ? (
                                        <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                                            <FaUser size={12} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
                    <Suspense fallback={<PageSkeleton />}>
                        <Outlet />
                    </Suspense>
                </main>
            </div>
        </div>
    );
};
export default DashboardLayout;
