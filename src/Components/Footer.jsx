import React from 'react';
import { Link } from 'react-router';
import { useTheme } from '../contexts/ThemeContext';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
    const { isDark } = useTheme();

    return (
        <footer className={`transition-colors duration-300 ${
            isDark 
                ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white' 
                : 'bg-gradient-to-r from-slate-900 to-purple-900 text-white'
        }`}>
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo & Description */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                isDark 
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                                    : 'bg-gradient-to-r from-cyan-400 to-blue-500'
                            }`}>
                                <span className="text-white font-bold text-xl">F</span>
                            </div>
                            <span className="text-2xl font-bold">FinEase</span>
                        </div>
                        <p className={`mb-4 max-w-md ${
                            isDark ? 'text-gray-400' : 'text-gray-300'
                        }`}>
                            Your trusted personal finance management platform. Take control of your finances with ease and confidence.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className={`transition-colors ${
                                isDark 
                                    ? 'text-gray-500 hover:text-blue-400' 
                                    : 'text-gray-400 hover:text-cyan-400'
                            }`}>
                                <FaFacebook size={20} />
                            </a>
                            <a href="#" className={`transition-colors ${
                                isDark 
                                    ? 'text-gray-500 hover:text-blue-400' 
                                    : 'text-gray-400 hover:text-cyan-400'
                            }`}>
                                <FaTwitter size={20} />
                            </a>
                            <a href="#" className={`transition-colors ${
                                isDark 
                                    ? 'text-gray-500 hover:text-blue-400' 
                                    : 'text-gray-400 hover:text-cyan-400'
                            }`}>
                                <FaInstagram size={20} />
                            </a>
                            <a href="#" className={`transition-colors ${
                                isDark 
                                    ? 'text-gray-500 hover:text-blue-400' 
                                    : 'text-gray-400 hover:text-cyan-400'
                            }`}>
                                <FaLinkedin size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <FaEnvelope className={isDark ? 'text-blue-400' : 'text-cyan-400'} />
                                <span className={isDark ? 'text-gray-400' : 'text-gray-300'}>support@finease.com</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FaPhone className={isDark ? 'text-blue-400' : 'text-cyan-400'} />
                                <span className={isDark ? 'text-gray-400' : 'text-gray-300'}>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FaMapMarkerAlt className={isDark ? 'text-blue-400' : 'text-cyan-400'} />
                                <span className={isDark ? 'text-gray-400' : 'text-gray-300'}>123 Finance St, Money City</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <div className="space-y-2">
                            <Link to="/" className={`block transition-colors ${
                                isDark 
                                    ? 'text-gray-400 hover:text-blue-400' 
                                    : 'text-gray-300 hover:text-cyan-400'
                            }`}>
                                Home
                            </Link>
                            <Link to="/about" className={`block transition-colors ${
                                isDark 
                                    ? 'text-gray-400 hover:text-blue-400' 
                                    : 'text-gray-300 hover:text-cyan-400'
                            }`}>
                                About Us
                            </Link>
                            <Link to="/privacy" className={`block transition-colors ${
                                isDark 
                                    ? 'text-gray-400 hover:text-blue-400' 
                                    : 'text-gray-300 hover:text-cyan-400'
                            }`}>
                                Privacy Policy
                            </Link>
                            <Link to="/terms" className={`block transition-colors ${
                                isDark 
                                    ? 'text-gray-400 hover:text-blue-400' 
                                    : 'text-gray-300 hover:text-cyan-400'
                            }`}>
                                Terms & Conditions
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className={`border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center ${
                    isDark ? 'border-gray-700' : 'border-gray-700'
                }`}>
                    <p className={`text-sm ${
                        isDark ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                        © 2024 FinEase. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="/terms" className={`text-sm transition-colors ${
                            isDark 
                                ? 'text-gray-500 hover:text-blue-400' 
                                : 'text-gray-400 hover:text-cyan-400'
                        }`}>
                            Terms & Conditions
                        </Link>
                        <Link to="/privacy" className={`text-sm transition-colors ${
                            isDark 
                                ? 'text-gray-500 hover:text-blue-400' 
                                : 'text-gray-400 hover:text-cyan-400'
                        }`}>
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;