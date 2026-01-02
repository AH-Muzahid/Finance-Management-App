import React, { useEffect } from 'react';
import { Link } from 'react-router';
import { FaFileContract, FaCheckCircle, FaExclamationTriangle, FaUserCheck, FaGavel } from 'react-icons/fa';

const Terms = () => {
    useEffect(() => {
        document.title = 'Terms & Conditions - FinEase';
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-base-100 pt-16">
            {/* Hero Section */}
            <div className="bg-linear-to-br from-purple-500 via-purple-600 to-indigo-600 dark:bg-linear-to-br dark:from-purple-700 dark:via-purple-800 dark:to-indigo-800 py-16">
                <div className="max-w-[1220px] mx-auto px-6 text-center">
                    <div className="flex justify-center mb-4">
                        <FaFileContract className="text-6xl text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">Terms & Conditions</h1>
                    <p className="text-lg text-purple-100 max-w-2xl mx-auto">
                        Please read these terms and conditions carefully before using FinEase.
                    </p>
                    <p className="text-sm text-purple-200 mt-4">Last Updated: January 2, 2026</p>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-base-200 py-16">
                <div className="max-w-[900px] mx-auto px-6">
                    {/* Introduction */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-base-content mb-4">Agreement to Terms</h2>
                        <p className="text-base-content/80 mb-4">
                            By accessing and using FinEase, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms & Conditions, please do not use our service.
                        </p>
                        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-6">
                            <p className="text-base-content/80">
                                <strong>Important:</strong> These terms constitute a legally binding agreement between you and FinEase. Please read them carefully.
                            </p>
                        </div>
                    </section>

                    {/* Use of Service */}
                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <FaUserCheck className="text-3xl text-green-500" />
                            <h2 className="text-3xl font-bold text-base-content">Use of Service</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-gray-50 dark:bg-base-100 p-6 rounded-lg">
                                <h3 className="text-xl font-bold text-base-content mb-3">Eligibility</h3>
                                <p className="text-base-content/80">
                                    You must be at least 18 years old to use FinEase. By using our service, you represent and warrant that you meet this age requirement.
                                </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-base-100 p-6 rounded-lg">
                                <h3 className="text-xl font-bold text-base-content mb-3">Account Registration</h3>
                                <ul className="list-disc list-inside text-base-content/80 space-y-2">
                                    <li>You must provide accurate and complete information</li>
                                    <li>You are responsible for maintaining account security</li>
                                    <li>You must notify us immediately of any unauthorized access</li>
                                    <li>One person may not maintain multiple accounts</li>
                                </ul>
                            </div>
                            <div className="bg-gray-50 dark:bg-base-100 p-6 rounded-lg">
                                <h3 className="text-xl font-bold text-base-content mb-3">Acceptable Use</h3>
                                <p className="text-base-content/80 mb-2">You agree to use FinEase only for lawful purposes. You agree NOT to:</p>
                                <ul className="list-disc list-inside text-base-content/80 space-y-2">
                                    <li>Violate any applicable laws or regulations</li>
                                    <li>Infringe upon the rights of others</li>
                                    <li>Transmit any harmful or malicious code</li>
                                    <li>Attempt to gain unauthorized access to our systems</li>
                                    <li>Use the service for any fraudulent purposes</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* User Content */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-base-content mb-4">User Content and Data</h2>
                        <div className="space-y-4 text-base-content/80">
                            <p>
                                You retain all rights to the financial data and information you input into FinEase. However, by using our service, you grant us a license to use, store, and process your data solely for the purpose of providing our services to you.
                            </p>
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
                                <h3 className="font-bold text-base-content mb-2">Your Responsibilities:</h3>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Ensure accuracy of your financial data</li>
                                    <li>Maintain backups of important information</li>
                                    <li>Do not share sensitive financial information publicly</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Service Availability */}
                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <FaCheckCircle className="text-3xl text-blue-500" />
                            <h2 className="text-3xl font-bold text-base-content">Service Availability</h2>
                        </div>
                        <p className="text-base-content/80 mb-4">
                            While we strive to provide uninterrupted service, we do not guarantee that FinEase will be available at all times. We may:
                        </p>
                        <ul className="list-disc list-inside text-base-content/80 space-y-2 ml-4">
                            <li>Perform scheduled maintenance</li>
                            <li>Make updates and improvements</li>
                            <li>Experience unexpected downtime</li>
                            <li>Modify or discontinue features</li>
                        </ul>
                    </section>

                    {/* Disclaimer */}
                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <FaExclamationTriangle className="text-3xl text-orange-500" />
                            <h2 className="text-3xl font-bold text-base-content">Disclaimer of Warranties</h2>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-6">
                            <p className="text-base-content/80 mb-4">
                                FinEase is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied.
                            </p>
                            <p className="text-base-content/80">
                                <strong>Important:</strong> FinEase is a personal finance tracking tool and should not be considered as professional financial advice. Always consult with qualified financial advisors for important financial decisions.
                            </p>
                        </div>
                    </section>

                    {/* Limitation of Liability */}
                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <FaGavel className="text-3xl text-red-500" />
                            <h2 className="text-3xl font-bold text-base-content">Limitation of Liability</h2>
                        </div>
                        <p className="text-base-content/80 mb-4">
                            To the maximum extent permitted by law, FinEase shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.
                        </p>
                        <div className="bg-gray-50 dark:bg-base-100 p-6 rounded-lg">
                            <p className="text-base-content/80">
                                We are not responsible for:
                            </p>
                            <ul className="list-disc list-inside text-base-content/80 space-y-2 mt-2">
                                <li>Loss of data due to user error or device failure</li>
                                <li>Financial decisions made based on the service</li>
                                <li>Unauthorized access to your account</li>
                                <li>Third-party services or integrations</li>
                            </ul>
                        </div>
                    </section>

                    {/* Termination */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-base-content mb-4">Termination</h2>
                        <p className="text-base-content/80 mb-4">
                            We reserve the right to terminate or suspend your account and access to FinEase immediately, without prior notice, for any reason, including but not limited to:
                        </p>
                        <ul className="list-disc list-inside text-base-content/80 space-y-2 ml-4">
                            <li>Violation of these Terms & Conditions</li>
                            <li>Fraudulent or illegal activity</li>
                            <li>Request by law enforcement</li>
                            <li>Extended period of inactivity</li>
                        </ul>
                    </section>

                    {/* Changes to Terms */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-base-content mb-4">Changes to Terms</h2>
                        <p className="text-base-content/80">
                            We reserve the right to modify these terms at any time. We will notify users of any material changes by updating the "Last Updated" date. Your continued use of FinEase after changes constitutes acceptance of the new terms.
                        </p>
                    </section>

                    {/* Contact */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-base-content mb-4">Contact Information</h2>
                        <p className="text-base-content/80 mb-4">
                            If you have any questions about these Terms & Conditions, please contact us:
                        </p>
                        <div className="bg-gray-50 dark:bg-base-100 p-6 rounded-lg">
                            <p className="text-base-content/80">
                                <strong>Email:</strong> support@finease.com
                            </p>
                            <p className="text-base-content/80 mt-2">
                                <strong>Contact Page:</strong> <Link to="/contact" className="text-purple-500 hover:underline">Visit our contact page</Link>
                            </p>
                        </div>
                    </section>

                    {/* Governing Law */}
                    <section className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-base-content mb-3">Governing Law</h2>
                        <p className="text-base-content/80">
                            These Terms & Conditions shall be governed by and construed in accordance with the laws of Bangladesh, without regard to its conflict of law provisions.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Terms;
