import React from 'react';

const HomeSkeleton = () => {
    return (
        <div className="bg-gray-50 dark:bg-base-100 py-15">
            <div className="max-w-[1220px] mx-auto px-6">
                <div className="text-center mb-16">
                    <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-4 animate-pulse"></div>
                    <div className="h-6 w-96 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto animate-pulse"></div>
                </div>

                {/* Additional Metrics Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="relative overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800 p-4 shadow-md animate-pulse h-32">
                            <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                            <div className="h-8 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        </div>
                    ))}
                </div>

                {/* Financial Summary Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="rounded-xl p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-base-200 animate-pulse h-48">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                            <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    ))}
                </div>

                {/* Recent Transactions & Quick Actions Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Recent Transactions Skeleton */}
                    <div className="lg:col-span-2 bg-white dark:bg-base-200 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-base-300 h-[400px] animate-pulse">
                        <div className="flex items-center justify-between mb-6">
                            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div key={item} className="flex items-center justify-between p-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                        <div>
                                            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions & Summary Skeleton */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-base-200 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-base-300 h-64 animate-pulse">
                            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                            <div className="space-y-3">
                                <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-base-200 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-base-300 h-48 animate-pulse">
                            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeSkeleton;
