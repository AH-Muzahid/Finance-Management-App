import React, { useState, useEffect, useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/firebase.init';
import { Link } from 'react-router';

import { FaPlus, FaDollarSign, FaCreditCard, FaChartLine, FaLightbulb, FaBullseye, FaCheck, FaEye, FaFileInvoiceDollar, FaCalendarAlt, FaTag, FaArrowRight } from 'react-icons/fa';
import LoadingSpinner from '../Components/LoadingSpinner';
import { getTransactions } from '../api/transactions';

const Home = () => {
    const [user, authLoading] = useAuthState(auth);
    const [transactions, setTransactions] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);


    const fetchUserTransactions = useCallback(async () => {
        try {
            setDataLoading(true);
            const data = await getTransactions(user?.email);
            setTransactions(data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setTransactions([]);
        } finally {
            setDataLoading(false);
        }
    }, [user?.email]);

    useEffect(() => {
        document.title = 'FinEase - Personal Finance Management';
        if (!authLoading && user) {
            fetchUserTransactions();
        } else if (!authLoading && !user) {
            setDataLoading(false);
        }
    }, [authLoading, user, fetchUserTransactions]);

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;

    // Recent transactions (last 5)
    const recentTransactions = transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    // Today's data
    const today = new Date();
    const todayDateString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    const todayTransactions = transactions.filter(t => {
        const transactionDateString = new Date(t.date).toISOString().split('T')[0]; // Format: YYYY-MM-DD
        return transactionDateString === todayDateString;
    });

    const todayIncome = todayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const todayExpenses = todayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const todayBalance = todayIncome - todayExpenses;

    // This month's data
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
    });

    const thisMonthIncome = thisMonthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const thisMonthExpenses = thisMonthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    if (authLoading || dataLoading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-base-100 pt-16">
            {/* Hero Section */}
            <div className="bg-linear-to-br from-orange-400 via-orange-500 to-red-500 dark:bg-linear-to-br dark:from-orange-600 dark:via-orange-700 dark:to-red-700 py-20">
                <div className="max-w-[1220px] mx-auto px-6 text-center">
                    <h1 className="text-5xl font-bold text-white mb-6">Take Control of Your Money</h1>
                    <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">Track, manage, and grow your wealth with FinEase - your personal finance companion</p>
                    <Link to="/add-transaction" className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors shadow-lg">
                        Start Managing Your Money
                    </Link>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gray-50 dark:bg-base-100 py-15">
                <div className="max-w-[1220px] mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-base-content mb-4">Financial Overview</h2>
                        <p className="text-xl text-base-content/70 max-w-2xl mx-auto">Get a comprehensive view of your financial health with real-time insights and analytics</p>
                    </div>

                    {/* Additional Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                        {/* Total Transactions */}
                        <div className="relative overflow-hidden rounded-lg bg-linear-to-br from-purple-500 via-purple-600 to-purple-700 p-4 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                            <div className="absolute -right-2 -top-2 h-12 w-12 rounded-full bg-white/10"></div>
                            <div className="absolute -right-1 -top-1 h-6 w-6 rounded-full bg-white/10"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="rounded-full bg-white/20 p-1.5">
                                        <FaFileInvoiceDollar className="h-3 w-3" />
                                    </div>
                                </div>
                                <h4 className="text-purple-100 text-xs font-medium mb-1">Transactions</h4>
                                <p className="text-xl font-bold">{transactions.length}</p>
                            </div>
                        </div>

                        {/* Average Expense */}
                        <div className="relative overflow-hidden rounded-lg bg-linear-to-br from-orange-500 via-orange-600 to-red-500 p-4 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                            <div className="absolute -right-2 -top-2 h-12 w-12 rounded-full bg-white/10"></div>
                            <div className="absolute -right-1 -top-1 h-6 w-6 rounded-full bg-white/10"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="rounded-full bg-white/20 p-1.5">
                                        <FaDollarSign className="h-3 w-3" />
                                    </div>
                                </div>
                                <h4 className="text-orange-100 text-xs font-medium mb-1">Avg. Expense</h4>
                                <p className="text-lg font-bold">
                                    BDT  {transactions.filter(t => t.type === 'expense').length > 0
                                        ? Math.round(totalExpenses / transactions.filter(t => t.type === 'expense').length).toLocaleString()
                                        : '0'}
                                </p>
                            </div>
                        </div>

                        {/* Savings Rate */}
                        <div className="relative overflow-hidden rounded-lg bg-linear-to-br from-teal-500 via-teal-600 to-cyan-600 p-4 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                            <div className="absolute -right-2 -top-2 h-12 w-12 rounded-full bg-white/10"></div>
                            <div className="absolute -right-1 -top-1 h-6 w-6 rounded-full bg-white/10"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="rounded-full bg-white/20 p-1.5">
                                        <FaChartLine className="h-3 w-3" />
                                    </div>
                                </div>
                                <h4 className="text-teal-100 text-xs font-medium mb-1">Savings Rate</h4>
                                <p className="text-xl font-bold">
                                    {totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0}%
                                </p>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="relative overflow-hidden rounded-lg bg-linear-to-br from-indigo-500 via-indigo-600 to-blue-600 p-4 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                            <div className="absolute -right-2 -top-2 h-12 w-12 rounded-full bg-white/10"></div>
                            <div className="absolute -right-1 -top-1 h-6 w-6 rounded-full bg-white/10"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="rounded-full bg-white/20 p-1.5">
                                        <FaTag className="h-3 w-3" />
                                    </div>
                                </div>
                                <h4 className="text-indigo-100 text-xs font-medium mb-1">Categories</h4>
                                <p className="text-xl font-bold">
                                    {[...new Set(transactions.map(t => t.category))].length}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Financial Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {/* Today Income */}
                        <div className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-xl p-6 border border-green-200 dark:border-green-700">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                                    <FaDollarSign className="text-white text-xl" />
                                </div>
                                <span className="text-green-600 dark:text-green-400 text-sm font-medium">TODAY INCOME</span>
                            </div>
                            <h3 className="text-3xl font-bold text-green-700 dark:text-green-300 mb-2">
                                BDT  {todayIncome.toLocaleString()}
                            </h3>
                            <p className="text-green-600 dark:text-green-400 text-sm">
                                {todayTransactions.filter(t => t.type === 'income').length} transactions today
                            </p>
                        </div>

                        {/* Today Expenses */}
                        <div className="bg-linear-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 rounded-xl p-6 border border-red-200 dark:border-red-700">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                                    <FaDollarSign className="text-white text-xl" />
                                </div>
                                <span className="text-red-600 dark:text-red-400 text-sm font-medium">TODAY EXPENSES</span>
                            </div>
                            <h3 className="text-3xl font-bold text-red-700 dark:text-red-300 mb-2">
                                BDT  {todayExpenses.toLocaleString()}
                            </h3>
                            <p className="text-red-600 dark:text-red-400 text-sm">
                                {todayTransactions.filter(t => t.type === 'expense').length} transactions today
                            </p>
                        </div>

                        {/* Today Net Balance */}
                        <div className={`bg-linear-to-br rounded-xl p-6 border ${todayBalance >= 0
                                ? 'from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-blue-200 dark:border-blue-700'
                                : 'from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 border-orange-200 dark:border-orange-700'
                            }`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${todayBalance >= 0 ? 'bg-blue-500' : 'bg-orange-500'
                                    }`}>
                                    <FaDollarSign className="text-white text-xl" />
                                </div>
                                <span className={`text-sm font-medium ${todayBalance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'
                                    }`}>TODAY NET</span>
                            </div>
                            <h3 className={`text-3xl font-bold mb-2 ${todayBalance >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-orange-700 dark:text-orange-300'
                                }`}>
                                BDT  {todayBalance.toLocaleString()}
                            </h3>
                            <p className={`text-sm ${todayBalance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'
                                }`}>
                                {todayBalance >= 0 ? 'Positive balance' : 'Negative balance'}
                            </p>
                        </div>
                    </div>

                    {/* Recent Transactions & Quick Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        {/* Recent Transactions */}
                        <div className="lg:col-span-2 bg-white dark:bg-base-200 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-base-300">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-base-content">Recent Transactions</h3>
                                <Link
                                    to="/my-transactions"
                                    className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-1"
                                >
                                    View All <FaArrowRight className="text-xs" />
                                </Link>
                            </div>

                            {recentTransactions.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-base-content/70 mb-4">No transactions yet</p>
                                    <Link
                                        to="/add-transaction"
                                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors inline-block"
                                    >
                                        Add Your First Transaction
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recentTransactions.map(transaction => (
                                        <div key={transaction._id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'income'
                                                        ? 'bg-green-100 dark:bg-green-900'
                                                        : 'bg-red-100 dark:bg-red-900'
                                                    }`}>
                                                    <FaDollarSign className={`text-sm ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                                        }`} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-base-content text-sm">{transaction.description}</p>
                                                    <div className="flex items-center gap-2 text-xs text-base-content/70">
                                                        <FaTag className="text-orange-500" />
                                                        <span className="capitalize">{transaction.category}</span>
                                                        <span>•</span>
                                                        <span>{new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                    {transaction.type === 'income' ? '+' : '-'}BDT  {transaction.amount.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quick Actions & This Month Summary */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <div className="bg-white dark:bg-base-200 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-base-300">
                                <h3 className="text-lg font-bold text-base-content mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <Link
                                        to="/add-transaction"
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaPlus /> Add Transaction
                                    </Link>
                                    <Link
                                        to="/my-transactions"
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaEye /> View Transactions
                                    </Link>
                                    <Link
                                        to="/reports"
                                        className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaChartLine /> View Reports
                                    </Link>
                                </div>
                            </div>

                            {/* This Month Summary */}
                            <div className="bg-white dark:bg-base-200 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-base-300">
                                <h3 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
                                    <FaCalendarAlt className="text-orange-500" />
                                    This Month
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-base-content/70 text-sm">Income</span>
                                        <span className="font-semibold text-green-600">BDT  {thisMonthIncome.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-base-content/70 text-sm">Expenses</span>
                                        <span className="font-semibold text-red-600">BDT  {thisMonthExpenses.toLocaleString()}</span>
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-base-content font-medium text-sm">Net</span>
                                            <span className={`font-bold ${(thisMonthIncome - thisMonthExpenses) >= 0 ? 'text-blue-600' : 'text-orange-600'
                                                }`}>
                                                BDT  {(thisMonthIncome - thisMonthExpenses).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-center pt-2">
                                        <span className="text-xs text-base-content/60">
                                            {thisMonthTransactions.length} transactions this month
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Total Summary */}
                            <div className="bg-white dark:bg-base-200 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-base-300">
                                <h3 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
                                    <FaCalendarAlt className="text-purple-500" />
                                    Total
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-base-content/70 text-sm">Income</span>
                                        <span className="font-semibold text-green-600">BDT  {totalIncome.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-base-content/70 text-sm">Expenses</span>
                                        <span className="font-semibold text-red-600">BDT  {totalExpenses.toLocaleString()}</span>
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-base-content font-medium text-sm">Net</span>
                                            <span className={`font-bold ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'
                                                }`}>
                                                BDT  {balance.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-center pt-2">
                                        <span className="text-xs text-base-content/60">
                                            {transactions.length} total transactions
                                        </span>
                                    </div>
                                </div>
                            </div>
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