import React from 'react';
import { Link } from 'react-router';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center section-padding">
            <div className="container-max text-center">
                <div className="card-glass p-12 max-w-2xl mx-auto fade-in">
                    <FaExclamationTriangle className="text-6xl text-yellow-500 mx-auto mb-6" />
                    <h1 className="heading-primary text-white mb-4">404</h1>
                    <h2 className="heading-secondary text-white mb-6">Page Not Found</h2>
                    <p className="text-body text-gray-300 mb-8">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                    <Link to="/" className="btn-primary inline-flex items-center gap-2">
                        <FaHome /> Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;