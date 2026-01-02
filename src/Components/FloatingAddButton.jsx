import React from 'react';
import { Link, useLocation } from 'react-router';
import { FaPlus } from 'react-icons/fa';

const FloatingAddButton = () => {
    const location = useLocation();

    // Don't show on dashboard pages (sidebar handles navigation there)
    if (location.pathname.startsWith('/dashboard')) {
        return null;
    }

    // Don't show on login/register pages
    if (location.pathname === '/login' || location.pathname === '/register') {
        return null;
    }

    return (
        <Link
            to="/dashboard/add-transaction"
            className="md:hidden fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-full shadow-2xl shadow-primary-500/40 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 z-50"
            title="Add Transaction"
        >
            <FaPlus className="text-2xl" />
        </Link>
    );
};

export default FloatingAddButton;
