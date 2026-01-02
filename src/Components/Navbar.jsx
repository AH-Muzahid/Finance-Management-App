import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase/firebase.init';
import SimpleThemeToggle from './SimpleThemeToggle';
import useUser from '../hooks/useUser';

import { FaBars, FaTimes, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Navbar = () => {
    const [user] = useUser();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
        setIsMobileMenuOpen(false);
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
                    <div className="md:flex">
                        <SimpleThemeToggle />
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden text-base-content hover:text-orange-500 transition-colors p-2"
                    >
                        {isMobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
                    </button>

                    {/* Desktop Auth */}
                    {user ? (
                        <div className="relative hidden md:block" ref={dropdownRef}>
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
                                    <li><Link to="/dashboard/profile" onClick={() => setIsDropdownOpen(false)} className="w-full text-left px-3 py-2 text-orange-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded block">Profile</Link></li>
                                    <li><button onClick={handleLogout} className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">Logout</button></li>
                                </ul>
                            )}
                        </div>
                    ) : (
                        <div className="hidden md:flex gap-2">
                            <Link to="/login" className="bg-white dark:bg-black text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white px-4 py-2 rounded-lg font-semibold transition-colors">Login</Link>
                            <Link to="/register" className="bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-lg font-semibold transition-colors">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Mobile Menu Sidebar */}
            <div
                className={`fixed top-16 right-0 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-base-200 border-l border-gray-200 dark:border-gray-700 z-30 transform transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="p-4 space-y-2">
                    {/* Navigation Links */}
                    {navLinks.filter(link => link.public || user).map(link => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`block px-4 py-3 rounded-lg transition-colors ${location.pathname === link.path
                                    ? 'bg-orange-500 text-white'
                                    : 'text-base-content hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* Divider */}
                    <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

                    {/* Auth Section */}
                    {user ? (
                        <>
                            <div className="px-4 py-2">
                                <p className="font-semibold text-base-content">{user.displayName || 'User'}</p>
                                <p className="text-xs text-base-content/60">{user.email}</p>
                            </div>
                            <Link
                                to="/dashboard/profile"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-4 py-3 rounded-lg text-orange-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-4 py-3 rounded-lg bg-white dark:bg-black text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white transition-colors text-center font-semibold"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-4 py-3 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors text-center font-semibold"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar;