import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase/firebase.init';
import SimpleThemeToggle from './SimpleThemeToggle';
import useUser from '../hooks/useUser';

import { FaBars, FaTimes, FaUser, FaHome, FaPlus, FaList, FaChartBar } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Navbar = () => {
    const [user] = useUser();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [, setThemeChangeCounter] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef(null);

    // Detect theme changes
    useEffect(() => {
        const updateTheme = () => {
            setThemeChangeCounter(prev => prev + 1);
        };

        // Listen for theme changes
        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => observer.disconnect();
    }, []);


    const handleLogout = async () => {
        setIsDropdownOpen(false);
        localStorage.removeItem('user');
        await signOut(auth);
        toast.success('Logged out successfully!');
        navigate('/');
    };

    const navLinks = [
        { name: 'Home', path: '/', public: true },
        { name: 'About', path: '/about', public: true },
        { name: 'Contact', path: '/contact', public: true },
        { name: 'Dashboard', path: '/dashboard/add-transaction', public: false }
    ];

    return (
        <>
            {/* Top Navbar - Desktop & Mobile */}
            <div className="navbar backdrop-blur-md bg-white dark:bg-black/60 border-b border-gray-200/50 dark:border-gray-700/50 fixed top-0 left-0 right-0 z-40 transition-all px-6 md:px-10">
                {/* Logo */}
                <div className="navbar-start">
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
                                    className={`rounded-lg px-3 py-2 transition-colors ${location.pathname === link.path
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
                    <div className=" md:flex">
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
                            <Link to="/login" className="bg-white dark:bg-black text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white px-4 py-2 rounded-lg font-semibold transition-colors hidden sm:inline-block">Login</Link>
                            <Link to="/register" className="bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-lg font-semibold transition-colors hidden sm:inline-block">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar;