import React from 'react';
import { Link } from 'react-router';
import { FaHome, FaSearch } from 'react-icons/fa';

const NotFound = () => {
    return (
        <div className="fixed inset-0 bg-gray-50 dark:bg-base-100 flex items-center justify-center p-4 z-50">
            <div className="text-center max-w-md mx-auto">
                <div className="bg-white dark:bg-base-200 rounded-2xl shadow-xl border border-gray-100 dark:border-base-300 p-8">
                    <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-white font-bold text-4xl">404</span>
                    </div>
                    <h1 className="text-3xl font-bold text-base-content mb-4">Page Not Found</h1>
                    <p className="text-base-content/70 mb-8">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                    <div className="space-y-4">
                        <Link 
                            to="/" 
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                            <FaHome /> Back to Home
                        </Link>
                        <button 
                            onClick={() => window.history.back()}
                            className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                            <FaSearch /> Go Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;