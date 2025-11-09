import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase/firebase.init';
import { useTheme } from '../contexts/ThemeContext';
import { FaBars, FaTimes, FaUser, FaSun, FaMoon } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Navbar = () => {
    const [user] = useAuthState(auth);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success('Logged out successfully!');
            navigate('/');
        } catch (error) {
            toast.error('Failed to log out');
        }
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
                <div className={`navbar shadow-xl sticky top-0 z-50 transition-colors duration-300 ${
                    isDark 
                        ? 'bg-linear-to-r from-gray-800 to-gray-900 text-white' 
                        : 'bg-linear-to-r from-blue-600 to-purple-700 text-white'
                }`}>
                    {/* Logo */}
                    <div className="navbar-start">
                        <label htmlFor="mobile-drawer" className="btn btn-ghost lg:hidden text-white hover:bg-white/20">
                            <FaBars className="h-5 w-5" />
                        </label>
                        <Link to="/" className="btn btn-ghost navbar-logo text-white hover:bg-white/20">
                            <div className="navbar-logo-icon">
                                <span className="text-white font-bold text-lg">F</span>
                            </div>
                            FinEase
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal px-1">
                            {navLinks.map(link => (
                                <li key={link.name}>
                                    <Link to={link.path} className="text-white hover:bg-white/20 rounded-lg">{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Auth Section */}
                    <div className="navbar-end flex items-center gap-3">
                        {user ? (
                            <div className="dropdown dropdown-end" ref={dropdownRef}>
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar hover:bg-white/20">
                                    <div className="w-10 rounded-full ring-2 ring-white/30">
                                        {user.photoURL ? (
                                            <img src={user.photoURL} alt="Profile" className="rounded-full" />
                                        ) : (
                                            <div className="bg-white/20 w-full h-full flex items-center justify-center rounded-full">
                                                <FaUser className="text-white" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <ul tabIndex={0} className={`menu menu-sm dropdown-content rounded-box z-1 mt-3 w-52 p-2 shadow-xl ${
                                    isDark ? 'bg-gray-800' : 'bg-white'
                                }`}>
                                    <li className="menu-title">
                                        <span className={isDark ? 'text-white' : 'text-gray-700'}>{user.displayName || 'User'}</span>
                                        <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>{user.email}</span>
                                    </li>
                                    <li><button onClick={handleLogout} className={`text-red-600 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-red-50'}`}>Logout</button></li>
                                </ul>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Link to="/login" className="btn btn-sm btn-secondary">Login</Link>
                                <Link to="/register" className="btn btn-sm btn-outline">Signup</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile view sidebar */}
            <div className="drawer-side">
                <label htmlFor="mobile-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className={`menu min-h-full w-80 p-4 ${
                    isDark ? 'bg-gray-800 text-white' : 'bg-base-200'
                }`}>
                    <li className="mb-4">
                        <div className="navbar-logo">
                            <div className="navbar-logo-icon w-10 h-10">
                                <span className="text-white font-bold text-xl">F</span>
                            </div>
                            <span className="text-2xl font-bold">FinEase</span>
                        </div>
                    </li>
                    {navLinks.map(link => (
                        <li key={link.name}>
                            <Link to={link.path} className={isDark ? 'text-white hover:bg-gray-700' : 'hover:bg-blue-50'}>
                                {link.name}
                            </Link>
                        </li>
                    ))}
                    <li className="mt-6 border-t pt-4">
                        <div className="flex items-center justify-between">
                            <span className={`font-medium ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>Theme</span>
                            <label className="swap swap-rotate">
                                <input 
                                    type="checkbox" 
                                    checked={isDark}
                                    onChange={toggleTheme}
                                />
                                <FaSun className="swap-off h-5 w-5 text-yellow-500" />
                                <FaMoon className="swap-on h-5 w-5 text-blue-500" />
                            </label>
                        </div>
                    </li>
                    {!user && (
                        <>
                            <li className="mt-4">
                                <Link to="/login" className="btn-primary w-full text-center">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="btn-outline w-full text-center">
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