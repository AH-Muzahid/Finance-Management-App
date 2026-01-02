import React, { useState, Suspense } from 'react';
import { Outlet } from 'react-router';
import Sidebar from '../Components/Sidebar';
import PageSkeleton from '../Components/PageSkeleton';
import { FaBars } from 'react-icons/fa';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-base-100">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar for Mobile */}
                <header className="lg:hidden bg-white dark:bg-base-200 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
                    <button
                        onClick={toggleSidebar}
                        className="text-base-content hover:text-orange-500 transition-colors"
                    >
                        <FaBars className="text-2xl" />
                    </button>
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">F</span>
                        </div>
                        <span className="text-lg font-bold text-base-content">FinEase</span>
                    </div>
                    <div className="w-8"></div> {/* Spacer for centering */}
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
