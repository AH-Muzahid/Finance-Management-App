import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/firebase.init';
import { Link } from 'react-router';

import { FaPlus, FaDollarSign, FaCreditCard, FaChartLine, FaLightbulb, FaBullseye, FaCheck } from 'react-icons/fa';
import LoadingSpinner from '../Components/LoadingSpinner';

const Home = () => {
    const [user, authLoading] = useAuthState(auth);
    const [transactions, setTransactions] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);

    
    // Mock data - replace with Firebase data
    const mockTransactions = [
        { id: 1, type: 'expense', category: 'Food', amount: 250, date: '2024-01-15', description: 'Groceries' },
        { id: 2, type: 'income', category: 'Salary', amount: 3000, date: '2024-01-01', description: 'Monthly salary' },
        { id: 3, type: 'expense', category: 'Transport', amount: 120, date: '2024-01-10', description: 'Gas' },
        { id: 4, type: 'expense', category: 'Entertainment', amount: 80, date: '2024-01-12', description: 'Movie tickets' }
    ];

    useEffect(() => {
        if (!authLoading) {
            setTimeout(() => {
                setTransactions(mockTransactions);
                setDataLoading(false);
            }, 800);
        }
    }, [authLoading]);

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;

    if (authLoading || dataLoading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-base-100 pt-16">
            {/* Hero Section */}
            <div className="bg-linear-to-br from-orange-400 via-orange-500 to-red-500 dark:bg-linear-to-br dark:from-orange-600 dark:via-orange-700 dark:to-red-700 py-20">
                <div className="max-w-[1220px] mx-auto px-6 text-center">
                    <h1 className="text-5xl font-bold text-white mb-6">Take Control of Your Finances</h1>
                    <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">Track, manage, and grow your wealth with FinEase - your personal finance companion</p>
                    <Link to="/add-transaction" className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors shadow-lg">
                        Start Managing Your Money
                    </Link>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gray-50 dark:bg-base-100 py-20">
                <div className="max-w-[1220px] mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-base-content mb-4">Financial Overview</h2>
                        <p className="text-xl text-base-content/70 max-w-2xl mx-auto">Get a comprehensive view of your financial health with real-time insights and analytics</p>
                    </div>
                
                    {/* Main Stats */}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
{/* Additional Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="bg-white dark:bg-base-200 rounded-lg p-6 text-center border border-gray-100 dark:border-base-300">
                            <h4 className="text-sm font-medium text-base-content/70 mb-2">Transactions</h4>
                            <p className="text-2xl font-bold text-base-content">{transactions.length}</p>
                        </div>
                        <div className="bg-white dark:bg-base-200 rounded-lg p-6 text-center border border-gray-100 dark:border-base-300">
                            <h4 className="text-sm font-medium text-base-content/70 mb-2">Avg. Expense</h4>
                            <p className="text-2xl font-bold text-base-content">
                                ${transactions.filter(t => t.type === 'expense').length > 0 
                                    ? Math.round(totalExpenses / transactions.filter(t => t.type === 'expense').length).toLocaleString() 
                                    : '0'}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-base-200 rounded-lg p-6 text-center border border-gray-100 dark:border-base-300">
                            <h4 className="text-sm font-medium text-base-content/70 mb-2">Savings Rate</h4>
                            <p className="text-2xl font-bold text-base-content">
                                {totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0}%
                            </p>
                        </div>
                        <div className="bg-white dark:bg-base-200 rounded-lg p-6 text-center border border-gray-100 dark:border-base-300">
                            <h4 className="text-sm font-medium text-base-content/70 mb-2">Categories</h4>
                            <p className="text-2xl font-bold text-base-content">
                                {[...new Set(transactions.map(t => t.category))].length}
                            </p>
                        </div>
                    </div>

                        <div className="bg-white dark:bg-base-200 rounded-xl p-8 text-center shadow-lg dark:shadow-none border border-gray-100 dark:border-base-300 hover:shadow-xl transition-shadow">
                            <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaDollarSign className="text-3xl text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-base-content mb-2">Total Income</h3>
                            <p className="text-4xl font-bold text-green-600 mb-2">${totalIncome.toLocaleString()}</p>
                            <p className="text-sm text-base-content/60">This month</p>
                        </div>
                        
                        <div className="bg-white dark:bg-base-200 rounded-xl p-8 text-center shadow-lg dark:shadow-none border border-gray-100 dark:border-base-300 hover:shadow-xl transition-shadow">
                            <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaCreditCard className="text-3xl text-red-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-base-content mb-2">Total Expenses</h3>
                            <p className="text-4xl font-bold text-red-600 mb-2">${totalExpenses.toLocaleString()}</p>
                            <p className="text-sm text-base-content/60">This month</p>
                        </div>
                        
                        <div className="bg-white dark:bg-base-200 rounded-xl p-8 text-center shadow-lg dark:shadow-none border border-gray-100 dark:border-base-300 hover:shadow-xl transition-shadow">
                            <div className="w-20 h-20 bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaChartLine className="text-3xl text-orange-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-base-content mb-2">Net Balance</h3>
                            <p className={`text-4xl font-bold mb-2 ${balance >= 0 ? 'text-orange-600' : 'text-red-600'}`}>
                                ${balance.toLocaleString()}
                            </p>
                            <p className={`text-sm ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {balance >= 0 ? '↗ Positive' : '↘ Negative'} Balance
                            </p>
                        </div>
                    </div>

                    
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
            
            {/* FAB Button */}
            {user && (
                <Link 
                    to="/add-transaction"
                    className="md:hidden fixed bottom-6 right-6 w-16 h-16 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-40"
                >
                    <FaPlus className="text-xl" />
                </Link>
            )}
        </div>
    );
};

export default Home;