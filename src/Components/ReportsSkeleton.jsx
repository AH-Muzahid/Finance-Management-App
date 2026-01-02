import React from 'react';

const ReportsSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-base-100 pt-20 p-4">
            <div className="max-w-[1220px] mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                        <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 animate-pulse">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-base-200 rounded-xl p-6 h-32 shadow-lg border border-gray-100 dark:border-base-300">
                            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4"></div>
                            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Expense Categories */}
                    <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-6">
                        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse"></div>
                        <div className="h-[300px] flex items-center justify-center animate-pulse">
                            <div className="h-64 w-64 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        </div>
                    </div>

                    {/* Monthly Trends */}
                    <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-6">
                        <div className="h-6 w-56 bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse"></div>
                        <div className="h-[300px] w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    </div>
                </div>

                {/* Additional Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Weekly Spending Pattern */}
                    <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-6">
                        <div className="h-6 w-56 bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse"></div>
                        <div className="h-[300px] w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    </div>

                    {/* Savings Donut Chart */}
                    <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-6 mb-8 animate-pulse">
                        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
                        <div className="h-[300px] flex items-center justify-center">
                            <div className="h-64 w-64 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        </div>
                    </div>
                </div>

                {/* Financial Health Score */}
                <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-6 mb-8">
                    <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
                    <div className="flex items-center gap-4 animate-pulse">
                        <div className="flex-1">
                            <div className="flex justify-between mb-2">
                                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3"></div>
                        </div>
                        <div className="text-right">
                            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full ml-auto mb-1"></div>
                            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded ml-auto"></div>
                        </div>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-pulse">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl p-6 h-24"></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReportsSkeleton;
