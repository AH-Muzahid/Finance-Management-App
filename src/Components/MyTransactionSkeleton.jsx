import React from 'react';

const MyTransactionSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-base-100 pt-20 p-4">
            <div className="max-w-[1220px] mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                </div>

                {/* Filters and Search Skeleton */}
                <div className="bg-white dark:bg-base-200 rounded-xl p-6 mb-8 shadow-lg border border-gray-100 dark:border-base-300 animate-pulse">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i}>
                                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Transactions Table Skeleton */}
                <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 overflow-hidden animate-pulse">
                    <div className="p-6 border-b border-gray-100 dark:border-base-300 flex justify-between items-center">
                        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>

                    <div className="overflow-x-auto">
                        <div className="w-full">
                            {/* Table Header */}
                            <div className="flex bg-gray-50 dark:bg-base-300 p-4">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded mx-2"></div>
                                ))}
                            </div>

                            {/* Table Rows */}
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex p-4 border-b border-gray-100 dark:border-base-300">
                                    <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded mx-2"></div>
                                    <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded mx-2"></div>
                                    <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded mx-2"></div>
                                    <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded mx-2"></div>
                                    <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded mx-2"></div>
                                    <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded mx-2"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyTransactionSkeleton;
