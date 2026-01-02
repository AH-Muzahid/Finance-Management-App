import React from 'react';

const PageSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-base-100 pt-20 p-4 animate-pulse">
            <div className="max-w-[1220px] mx-auto">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>

                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white dark:bg-base-200 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-base-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    ))}
                </div>

                {/* Content Area Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-base-200 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-base-300 h-96"></div>
                        <div className="bg-white dark:bg-base-200 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-base-300 h-64"></div>
                    </div>

                    {/* Sidebar Content */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-base-200 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-base-300 h-64"></div>
                        <div className="bg-white dark:bg-base-200 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-base-300 h-48"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageSkeleton;
