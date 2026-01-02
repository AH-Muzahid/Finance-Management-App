import React, { useEffect } from 'react';
import { Link } from 'react-router';
import { FaShieldAlt, FaLock, FaUserShield, FaDatabase, FaCookie, FaEnvelope } from 'react-icons/fa';

const Privacy = () => {
    useEffect(() => {
        document.title = 'Privacy Policy - FinEase';
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-base-100 pt-16">
            {/* Hero Section */}
            <div className="bg-linear-to-br from-blue-500 via-blue-600 to-indigo-600 dark:bg-linear-to-br dark:from-blue-700 dark:via-blue-800 dark:to-indigo-800 py-16">
                <div className="max-w-[1220px] mx-auto px-6 text-center">
                    <div className="flex justify-center mb-4">
                        <FaShieldAlt className="text-6xl text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
                    <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                        Your privacy is important to us. Learn how we collect, use, and protect your personal information.
                    </p>
                    <p className="text-sm text-blue-200 mt-4">Last Updated: January 2, 2026</p>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-base-200 py-16">
                <div className="max-w-[900px] mx-auto px-6">
                    {/* Introduction */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-base-content mb-4">Introduction</h2>
                        <p className="text-base-content/80 mb-4">
                            Welcome to FinEase. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights.
                        </p>
                        <p className="text-base-content/80">
                            FinEase is a personal finance management platform that helps you track your income, expenses, and financial goals. We take the security and privacy of your financial data very seriously.
                        </p>
                    </section>

                    {/* Information We Collect */}
                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <FaDatabase className="text-3xl text-blue-500" />
                            <h2 className="text-3xl font-bold text-base-content">Information We Collect</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-gray-50 dark:bg-base-100 p-6 rounded-lg">
                                <h3 className="text-xl font-bold text-base-content mb-2">Personal Information</h3>
                                <ul className="list-disc list-inside text-base-content/80 space-y-2">
                                    <li>Name and email address</li>
                                    <li>Profile photo (optional)</li>
                                    <li>Authentication credentials</li>
                                </ul>
                            </div>
                            <div className="bg-gray-50 dark:bg-base-100 p-6 rounded-lg">
                                <h3 className="text-xl font-bold text-base-content mb-2">Financial Data</h3>
                                <ul className="list-disc list-inside text-base-content/80 space-y-2">
                                    <li>Transaction records (income and expenses)</li>
                                    <li>Transaction categories and descriptions</li>
                                    <li>Financial reports and analytics</li>
                                </ul>
                            </div>
                            <div className="bg-gray-50 dark:bg-base-100 p-6 rounded-lg">
                                <h3 className="text-xl font-bold text-base-content mb-2">Usage Data</h3>
                                <ul className="list-disc list-inside text-base-content/80 space-y-2">
                                    <li>Browser type and version</li>
                                    <li>Pages visited and time spent</li>
                                    <li>Device information</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* How We Use Your Information */}
                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <FaUserShield className="text-3xl text-green-500" />
                            <h2 className="text-3xl font-bold text-base-content">How We Use Your Information</h2>
                        </div>
                        <div className="space-y-3 text-base-content/80">
                            <p>We use your personal information for the following purposes:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>To provide and maintain our service</li>
                                <li>To manage your account and provide customer support</li>
                                <li>To analyze and improve our services</li>
                                <li>To send you important updates and notifications</li>
                                <li>To detect and prevent fraud or abuse</li>
                                <li>To comply with legal obligations</li>
                            </ul>
                        </div>
                    </section>

                    {/* Data Security */}
                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <FaLock className="text-3xl text-orange-500" />
                            <h2 className="text-3xl font-bold text-base-content">Data Security</h2>
                        </div>
                        <p className="text-base-content/80 mb-4">
                            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
                        </p>
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
                            <h3 className="font-bold text-base-content mb-2">Security Measures:</h3>
                            <ul className="list-disc list-inside text-base-content/80 space-y-2">
                                <li>End-to-end encryption for sensitive data</li>
                                <li>Secure authentication with Firebase</li>
                                <li>Regular security audits and updates</li>
                                <li>Secure data storage and backup</li>
                            </ul>
                        </div>
                    </section>

                    {/* Cookies */}
                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <FaCookie className="text-3xl text-yellow-500" />
                            <h2 className="text-3xl font-bold text-base-content">Cookies and Tracking</h2>
                        </div>
                        <p className="text-base-content/80 mb-4">
                            We use cookies and similar tracking technologies to track activity on our service and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                        </p>
                    </section>

                    {/* Your Rights */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-base-content mb-4">Your Privacy Rights</h2>
                        <p className="text-base-content/80 mb-4">You have the right to:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-base-100 p-4 rounded-lg">
                                <h3 className="font-bold text-base-content mb-2">Access</h3>
                                <p className="text-sm text-base-content/70">Request copies of your personal data</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-base-100 p-4 rounded-lg">
                                <h3 className="font-bold text-base-content mb-2">Correction</h3>
                                <p className="text-sm text-base-content/70">Request correction of inaccurate data</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-base-100 p-4 rounded-lg">
                                <h3 className="font-bold text-base-content mb-2">Deletion</h3>
                                <p className="text-sm text-base-content/70">Request deletion of your personal data</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-base-100 p-4 rounded-lg">
                                <h3 className="font-bold text-base-content mb-2">Export</h3>
                                <p className="text-sm text-base-content/70">Request export of your data</p>
                            </div>
                        </div>
                    </section>

                    {/* Contact */}
                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <FaEnvelope className="text-3xl text-purple-500" />
                            <h2 className="text-3xl font-bold text-base-content">Contact Us</h2>
                        </div>
                        <p className="text-base-content/80 mb-4">
                            If you have any questions about this Privacy Policy, please contact us:
                        </p>
                        <div className="bg-gray-50 dark:bg-base-100 p-6 rounded-lg">
                            <p className="text-base-content/80">
                                <strong>Email:</strong> support@finease.com
                            </p>
                            <p className="text-base-content/80 mt-2">
                                <strong>Contact Page:</strong> <Link to="/contact" className="text-blue-500 hover:underline">Visit our contact page</Link>
                            </p>
                        </div>
                    </section>

                    {/* Updates */}
                    <section className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-base-content mb-3">Changes to This Privacy Policy</h2>
                        <p className="text-base-content/80">
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
