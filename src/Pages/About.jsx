import React, { useEffect } from 'react';
import { Link } from 'react-router';
import { FaChartLine, FaShieldAlt, FaMobileAlt, FaUsers, FaLightbulb, FaRocket, FaHeart, FaCheckCircle } from 'react-icons/fa';

const About = () => {
    useEffect(() => {
        document.title = 'About Us - FinEase';
    }, []);

    const features = [
        {
            icon: <FaChartLine className="text-4xl text-orange-500" />,
            title: "Smart Analytics",
            description: "Get detailed insights into your spending patterns with interactive charts and reports"
        },
        {
            icon: <FaShieldAlt className="text-4xl text-green-500" />,
            title: "Secure & Private",
            description: "Your financial data is encrypted and stored securely with industry-standard security"
        },
        {
            icon: <FaMobileAlt className="text-4xl text-blue-500" />,
            title: "Mobile Friendly",
            description: "Access your finances anywhere, anytime with our responsive mobile-first design"
        },
        {
            icon: <FaUsers className="text-4xl text-purple-500" />,
            title: "User Focused",
            description: "Built with simplicity in mind, making finance management accessible to everyone"
        }
    ];

    const values = [
        {
            icon: <FaLightbulb className="text-3xl text-yellow-500" />,
            title: "Innovation",
            description: "We continuously improve our platform with cutting-edge features"
        },
        {
            icon: <FaHeart className="text-3xl text-red-500" />,
            title: "Empowerment",
            description: "We believe everyone deserves financial freedom and control"
        },
        {
            icon: <FaRocket className="text-3xl text-indigo-500" />,
            title: "Growth",
            description: "We help you grow your wealth through smart financial decisions"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-base-100 pt-16">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 py-20">
                <div className="max-w-[1220px] mx-auto px-6 text-center">
                    <h1 className="text-5xl font-bold text-white mb-6">About FinEase</h1>
                    <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
                        Your trusted companion for personal finance management. We're on a mission to make financial tracking simple, intuitive, and accessible for everyone.
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="bg-white dark:bg-base-200 py-16">
                <div className="max-w-[1220px] mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-base-content mb-6">Our Mission</h2>
                            <p className="text-lg text-base-content/80 mb-4">
                                At FinEase, we believe that everyone deserves to have control over their financial future. Our mission is to provide a powerful yet simple platform that helps you track, manage, and grow your wealth.
                            </p>
                            <p className="text-lg text-base-content/80 mb-4">
                                We understand that managing finances can be overwhelming. That's why we've created an intuitive interface that makes it easy to record transactions, visualize spending patterns, and make informed financial decisions.
                            </p>
                            <p className="text-lg text-base-content/80">
                                Whether you're saving for a dream vacation, paying off debt, or building an emergency fund, FinEase is here to support your financial journey every step of the way.
                            </p>
                        </div>
                        <div className="bg-linear-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-8 border border-orange-200 dark:border-orange-700">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <FaCheckCircle className="text-orange-500 text-2xl mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-base-content mb-1">Track Every Transaction</h3>
                                        <p className="text-base-content/70">Record income and expenses with detailed categorization</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FaCheckCircle className="text-orange-500 text-2xl mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-base-content mb-1">Visualize Your Finances</h3>
                                        <p className="text-base-content/70">Beautiful charts and reports to understand your money flow</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FaCheckCircle className="text-orange-500 text-2xl mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-base-content mb-1">Make Better Decisions</h3>
                                        <p className="text-base-content/70">Data-driven insights to improve your financial health</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-gray-50 dark:bg-base-100 py-16">
                <div className="max-w-[1220px] mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-base-content mb-4">Why Choose FinEase?</h2>
                        <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
                            We've built FinEase with features that make financial management effortless
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-base-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-base-300"
                            >
                                <div className="mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-base-content mb-3">{feature.title}</h3>
                                <p className="text-base-content/70">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="bg-white dark:bg-base-200 py-16">
                <div className="max-w-[1220px] mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-base-content mb-4">Our Core Values</h2>
                        <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
                            The principles that guide everything we do
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 dark:bg-base-100 rounded-xl p-8 text-center hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-base-300"
                            >
                                <div className="flex justify-center mb-4">{value.icon}</div>
                                <h3 className="text-2xl font-bold text-base-content mb-3">{value.title}</h3>
                                <p className="text-base-content/70">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 py-16">
                <div className="max-w-[1220px] mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">Ready to Take Control?</h2>
                    <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of users who are already managing their finances smarter with FinEase
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors shadow-lg"
                        >
                            Get Started Free
                        </Link>
                        <Link
                            to="/contact"
                            className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
