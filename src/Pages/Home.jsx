import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/firebase.init';
import { Link } from 'react-router';
import { FaLightbulb, FaBullseye, FaCheck, FaPlus } from 'react-icons/fa';

const Home = () => {
    const [user] = useAuthState(auth);


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-base-100 pt-16">
            {/* Hero Section - Always Visible */}
            <div className="bg-gradient-to-br from-primary-500 via-purple-500 to-secondary-500 py-20">
                <div className="max-w-[1220px] mx-auto px-6 text-center">
                    <h1 className="text-5xl font-bold text-white mb-6">Take Control of Your Money</h1>
                    <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">Track, manage, and grow your wealth with FinEase - your personal finance companion</p>
                    <Link to="/add-transaction" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors shadow-lg">
                        Start Managing Your Money
                    </Link>
                </div>
            </div>

            {/* Tips Section */}
            <div className="bg-white dark:bg-base-200 py-16">
                <div className="max-w-[1220px] mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Budgeting Tips */}
                        <div className="bg-white dark:bg-base-100 rounded-xl p-8 shadow-lg dark:shadow-none border border-gray-100 dark:border-base-300">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-base-content mb-6 flex items-center">
                                <FaLightbulb className="text-3xl mr-3 text-orange-500" />
                                Budgeting Tips
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <FaCheck className="text-orange-500 text-lg mt-1" />
                                    <p className="text-gray-700 dark:text-base-content/80">Follow the 50/30/20 rule: 50% needs, 30% wants, 20% savings</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FaCheck className="text-orange-500 text-lg mt-1" />
                                    <p className="text-gray-700 dark:text-base-content/80">Track every expense to identify spending patterns</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FaCheck className="text-orange-500 text-lg mt-1" />
                                    <p className="text-gray-700 dark:text-base-content/80">Set realistic monthly budgets for each category</p>
                                </div>
                            </div>
                        </div>

                        {/* Why Track Finances */}
                        <div className="bg-white dark:bg-base-100 rounded-xl p-8 shadow-lg dark:shadow-none border border-gray-100 dark:border-base-300">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-base-content mb-6 flex items-center">
                                <FaBullseye className="text-3xl mr-3 text-orange-500" />
                                Why Track Finances?
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <FaCheck className="text-orange-500 text-lg mt-1" />
                                    <p className="text-gray-700 dark:text-base-content/80">Build an emergency fund for unexpected expenses</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FaCheck className="text-orange-500 text-lg mt-1" />
                                    <p className="text-gray-700 dark:text-base-content/80">Achieve long-term financial goals and dreams</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FaCheck className="text-orange-500 text-lg mt-1" />
                                    <p className="text-gray-700 dark:text-base-content/80">Reduce financial stress and anxiety</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAB Button
            {user && (
                <Link
                    to="/add-transaction"
                    className="md:hidden fixed bottom-6 right-6 w-16 h-16 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-40"
                >
                    <FaPlus className="text-xl" />
                </Link>
            )} */}
        </div>
    );
};

export default Home;