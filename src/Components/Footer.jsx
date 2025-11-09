import React from 'react';
import { Link } from 'react-router';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-linear-to-r from-slate-900 to-purple-900 text-white">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo & Description */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-linear-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">F</span>
                            </div>
                            <span className="text-2xl font-bold">FinEase</span>
                        </div>
                        <p className="text-gray-300 mb-4 max-w-md">
                            Your trusted personal finance management platform. Take control of your finances with ease and confidence.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                                <FaFacebook size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                                <FaTwitter size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                                <FaInstagram size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                                <FaLinkedin size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <FaEnvelope className="text-cyan-400" />
                                <span className="text-gray-300">support@finease.com</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FaPhone className="text-cyan-400" />
                                <span className="text-gray-300">+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FaMapMarkerAlt className="text-cyan-400" />
                                <span className="text-gray-300">123 Finance St, Money City</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <div className="space-y-2">
                            <Link to="/" className="block text-gray-300 hover:text-cyan-400 transition-colors">
                                Home
                            </Link>
                            <Link to="/about" className="block text-gray-300 hover:text-cyan-400 transition-colors">
                                About Us
                            </Link>
                            <Link to="/privacy" className="block text-gray-300 hover:text-cyan-400 transition-colors">
                                Privacy Policy
                            </Link>
                            <Link to="/terms" className="block text-gray-300 hover:text-cyan-400 transition-colors">
                                Terms & Conditions
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm">
                        © 2024 FinEase. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="/terms" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">
                            Terms & Conditions
                        </Link>
                        <Link to="/privacy" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;