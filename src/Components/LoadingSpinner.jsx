import React from 'react';

const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    };

    const spinner = (
        <div className={`animate-spin rounded-full border-4 border-gray-200 dark:border-gray-700 border-t-orange-500 ${sizeClasses[size]}`}></div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-linear-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-black dark:to-gray-800 flex items-center justify-center z-50">
                <div className="text-center">
                    <div className="relative mb-8">
                        <div className="w-20 h-20 bg-linear-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                            <span className="text-white font-bold text-3xl">F</span>
                        </div>
                        <div className="absolute inset-0 w-20 h-20 border-4 border-orange-300 rounded-full animate-ping mx-auto"></div>
                    </div>
                    <div className="flex justify-center space-x-1 mb-4">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                    <p className="text-base-content text-xl font-semibold animate-pulse">Loading...</p>
                    <p className="text-base-content/60 text-sm mt-2">Please wait while we prepare your wallet</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-4">
            {spinner}
        </div>
    );
};

export default LoadingSpinner;