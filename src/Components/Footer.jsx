import React from 'react';
import { Link } from 'react-router';

import { FaFacebook, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {

    return (
        <footer className="bg-linear-to-br from-orange-500 via-red-500 to-pink-600 dark:bg-linear-to-br dark:from-orange-700 dark:via-red-700 dark:to-pink-800 text-white">
            <div className="max-w-[1220px] mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo & Description */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">F</span>
                            </div>
                            <span className="text-2xl font-bold">FinEase</span>
                        </div>
                        <p className="mb-4 max-w-md text-white/80">
                            Your trusted personal finance management platform. Take control of your finances with ease and confidence.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://www.facebook.com/ah.muzahid.2025/" className="text-white/60 hover:text-white transition-colors">
                                <FaFacebook size={20} />
                            </a>
                            <a href="#" className="text-white/60 hover:text-white transition-colors">
                                <FaXTwitter size={20} />
                            </a>
                            <a href="#" className="text-white/60 hover:text-white transition-colors">
                                <FaInstagram size={20} />
                            </a>
                            <a href="#" className="text-white/60 hover:text-white transition-colors">
                                <FaLinkedin size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <FaEnvelope className="text-white" />
                                <span className="text-white/80">support@finease.com</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FaPhone className="text-white" />
                                <span className="text-white/80">+88 01312009084</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FaMapMarkerAlt className="text-white" />
                                <span className="text-white/80">Rajshahi, Bangladesh</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <div className="space-y-2">
                            <Link to="/" className="block text-white/80 hover:text-white transition-colors">
                                Home
                            </Link>
                            <Link to="/about" className="block text-white/80 hover:text-white transition-colors">
                                About Us
                            </Link>
                            <Link to="/privacy" className="block text-white/80 hover:text-white transition-colors">
                                Privacy Policy
                            </Link>
                            <Link to="/terms" className="block text-white/80 hover:text-white transition-colors">
                                Terms & Conditions
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/20 my-3 text-center">
                    <p className="text-sm text-white/70 pt-5">
                        © 2024 FinEase. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;