import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase/firebase.init';
import { FaBars, FaTimes, FaUser, FaSun, FaMoon } from 'react-icons/fa';

import toast from 'react-hot-toast';

const Navbar = () => {
    const [user] = useAuthState(auth);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDark, setIsDark] = useState(() => {
        return document.documentElement.getAttribute('data-theme') === 'dark';
    });

    const toggleTheme = () => {
        const newTheme = isDark ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        setIsDark(!isDark);
    };
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        // Set initial theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        setIsDark(savedTheme === 'dark');

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
        <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
            {/* Logo */}
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <FaBars className="h-5 w-5" />
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        {navLinks.map(link => {
                            if (!link.public && !user) return null;
                            return (
                                <li key={link.name}>
                                    <Link to={link.path}>{link.name}</Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost text-xl">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-2">
                        <span className="text-primary-content font-bold text-lg">F</span>
                    </div>
                    FinEase
                </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {navLinks.map(link => {
                        if (!link.public && !user) return null;
                        return (
                            <li key={link.name}>
                                <Link to={link.path}>{link.name}</Link>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Theme Toggle & Auth Section */}
            <div className="navbar-end flex items-center gap-2">
                <label className="swap swap-rotate">
                    <input 
                        type="checkbox" 
                        checked={isDark}
                        onChange={toggleTheme}
                    />
                    <FaSun className="swap-off h-6 w-6" />
                    <FaMoon className="swap-on h-6 w-6" />
                </label>
                {user ? (
                    <div className="dropdown dropdown-end" ref={dropdownRef}>
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt="Profile" />
                                ) : (
                                    <div className="bg-primary w-full h-full flex items-center justify-center">
                                        <FaUser className="text-primary-content" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            <li className="menu-title">
                                <span>{user.displayName || 'User'}</span>
                                <span className="text-xs opacity-60">{user.email}</span>
                            </li>
                            <li><button onClick={handleLogout} className="text-error">Logout</button></li>
                        </ul>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
                        <Link to="/register" className="btn btn-outline btn-sm">Signup</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;