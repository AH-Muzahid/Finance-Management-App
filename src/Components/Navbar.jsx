import React, { useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase/firebase.init';
import SimpleThemeToggle from './SimpleThemeToggle';

import { FaBars, FaTimes, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Navbar = () => {
    const [user] = useAuthState(auth);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef(null);


    const handleLogout = async () => {
        setIsDropdownOpen(false);
        await signOut(auth);
        toast.success('Logged out successfully!');
        navigate('/');
    };

    const navLinks = [
        { name: 'Home', path: '/', public: true },
        { name: 'Add Transaction', path: '/add-transaction', public: false },
        { name: 'My Transactions', path: '/transactions', public: false },
        { name: 'Reports', path: '/reports', public: false }
    ];

    return (
        <div className="drawer">
            <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <div className="navbar backdrop-blur-md bg-white dark:bg-black/60 border-b border-gray-200/50 dark:border-gray-700/50 fixed top-0 left-0 right-0 z-50 transition-all px-4 md:px-10">
                    {/* Logo */}
                    <div className="navbar-start">
                        <label htmlFor="mobile-drawer" className="p-2 md:hidden text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                            <FaBars className="h-5 w-5" />
                        </label>
                        <Link to="/" className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">F</span>
                            </div>
                            <span className="text-xl font-bold text-black dark:text-white">FinEase</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="navbar-center hidden md:flex ml-auto mr-4">
                        <ul className="flex space-x-1">
                            {navLinks.filter(link => link.public || user).map(link => (
                                <li key={link.name}>
                                    <Link 
                                        to={link.path} 
                                        className={`rounded-lg px-3 py-2 transition-colors ${
                                            location.pathname === link.path
                                                ? 'text-orange-500 bg-gray-100 dark:bg-gray-800'
                                                : 'text-gray-600 dark:text-gray-300 hover:text-orange-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Auth Section */}
                    <div className="navbar-end flex items-center gap-3">
                        <div className="hidden md:flex">
                            <SimpleThemeToggle />
                        </div>
                        
                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                                >
                                    <div className="w-8 h-8 rounded-full">
                                        {user.photoURL ? (
                                            <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            <div className="bg-blue-500 w-full h-full flex items-center justify-center rounded-full">
                                                <FaUser className="text-white text-sm" />
                                            </div>
                                        )}
                                    </div>
                                </button>
                                {isDropdownOpen && (
                                    <ul className="absolute right-0 mt-2 w-52 p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                                        <li className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                                            <span className="text-black dark:text-white font-medium">{user.displayName || 'User'}</span>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                                        </li>
                                        <li><Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="w-full text-left px-3 py-2 text-orange-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded block">Profile</Link></li>
                                        <li><button onClick={handleLogout} className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">Logout</button></li>
                                    </ul>
                                )}
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Link to="/login" className="bg-white dark:bg-black text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white px-4 py-2 rounded-lg font-semibold transition-colors">Login</Link>
                                <Link to="/register" className="bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-lg font-semibold transition-colors">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile view sidebar */}
            <div className="drawer-side">
                <label htmlFor="mobile-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="min-h-full w-80 p-4 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-700">
                    <li className="mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">F</span>
                            </div>
                            <span className="text-2xl font-bold text-black dark:text-white">FinEase</span>
                        </div>
                    </li>
                    {navLinks.filter(link => link.public || user).map(link => (
                        <li key={link.name} className="mb-1">
                            <Link 
                                to={link.path} 
                                className={`block px-3 py-2 rounded-lg transition-colors ${
                                    location.pathname === link.path
                                        ? 'text-orange-500 bg-gray-100 dark:bg-gray-800'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-orange-500'
                                }`}
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                    <li className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="flex items-center justify-between px-3">
                            <span className="font-medium text-black dark:text-white">Theme</span>
                            <SimpleThemeToggle />
                        </div>
                    </li>
                    {!user && (
                        <>
                            <li className="mt-4">
                                <Link to="/login" className="block bg-orange-500 text-white hover:bg-orange-600 w-full text-center py-2 rounded-lg font-semibold transition-colors">
                                    Login
                                </Link>
                            </li>
                            <li className="mt-2">
                                <Link to="/register" className="block border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white w-full text-center py-2 rounded-lg font-semibold transition-colors">
                                    Sign Up
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Navbar;