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
        <div className={`navbar shadow-xl sticky top-0 z-50 transition-colors duration-300 ${
            isDark 
                ? 'bg-linear-to-r from-gray-800 to-gray-900 text-white' 
                : 'bg-linear-to-r from-blue-600 to-purple-700 text-white'
        }`}>
            {/* Logo */}
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden text-white hover:bg-white/20">
                        <FaBars className="h-5 w-5" />
                    </div>
                    <ul tabIndex={0} className={`menu menu-sm dropdown-content rounded-box z-[1] mt-3 w-52 p-2 shadow-xl ${
                        isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'
                    }`}>
                        {navLinks.map(link => (
                            <li key={link.name}>
                                <Link to={link.path} className={isDark ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}>{link.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost text-xl text-white hover:bg-white/20">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-2">
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

            {/* Theme Toggle & Auth Section */}
            <div className="navbar-end flex items-center gap-3">
                <label className="swap swap-rotate">
                    <input 
                        type="checkbox" 
                        checked={isDark}
                        onChange={toggleTheme}
                    />
                    <FaSun className="swap-off h-5 w-5 text-yellow-300" />
                    <FaMoon className="swap-on h-5 w-5 text-blue-200" />
                </label>
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
                        <Link to="/login" className="btn btn-sm bg-white text-blue-600 hover:bg-blue-50 border-none">Login</Link>
                        <Link to="/register" className="btn btn-sm btn-outline border-white text-white hover:bg-white hover:text-blue-600">Signup</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;