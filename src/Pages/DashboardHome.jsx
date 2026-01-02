import React, { useState, useEffect, useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/firebase.init';
import { getTransactions } from '../api/transactions';
import PageSkeleton from '../Components/PageSkeleton';
import { FaWallet, FaArrowUp, FaArrowDown, FaChartLine, FaHistory } from 'react-icons/fa';
import { Link } from 'react-router';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const DashboardHome = () => {
    const [user, authLoading] = useAuthState(auth);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUserTransactions = async () => {
        try {
            setLoading(true);
            const data = await getTransactions(user?.email, 'date', 'desc');
            setTransactions(data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = 'Dashboard - FinEase';
        if (!authLoading && user) {
            fetchUserTransactions();
        } else if (!authLoading && !user) {
            setTransactions([]);
            setLoading(false);
        }
    }, [authLoading, user]);

    // Calculate Summary Stats
    const { totalIncome, totalExpenses, balance, monthlyData } = useMemo(() => {
        const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

        // Prepare monthly data for chart (last 6 months)
        const monthlyStats = {};
        transactions.forEach(t => {
            const date = new Date(t.date);
            const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
            if (!monthlyStats[monthKey]) {
                monthlyStats[monthKey] = { name: monthKey, income: 0, expense: 0 };
            }
            if (t.type === 'income') monthlyStats[monthKey].income += t.amount;
            else if (t.type === 'expense') monthlyStats[monthKey].expense += t.amount;
        });

        // Sort and take last 6
        const chartData = Object.values(monthlyStats).slice(0, 6).reverse(); // Rough sort, ideally sort by date

        return {
            totalIncome: income,
            totalExpenses: expenses,
            balance: income - expenses,
            monthlyData: chartData
        };
    }, [transactions]);

    const recentTransactions = transactions.slice(0, 5);

    if (loading || authLoading) return <PageSkeleton />;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-base-content">
                        Welcome back, <span className="text-primary-500">{user?.displayName?.split(' ')[0] || 'User'}</span>! 👋
                    </h1>
                    <p className="text-base-content/70 mt-1">Here's what's happening with your finances today.</p>
                </div>
                <Link
                    to="/dashboard/add-transaction"
                    className="mt-4 md:mt-0 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold shadow-lg shadow-primary-500/30 transition-all"
                >
                    Add Transaction
                </Link>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Balance */}
                <div className="bg-white dark:bg-base-200 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-base-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                            <FaWallet className="text-2xl text-primary-500" />
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${balance >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            Total Balance
                        </span>
                    </div>
                    <h2 className="text-3xl font-bold text-base-content mb-1">BDT {balance.toLocaleString()}</h2>
                    <p className="text-sm text-base-content/60">Available funds</p>
                </div>

                {/* Income */}
                <div className="bg-white dark:bg-base-200 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-base-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                            <FaArrowUp className="text-2xl text-green-500" />
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            Income
                        </span>
                    </div>
                    <h2 className="text-3xl font-bold text-base-content mb-1">BDT {totalIncome.toLocaleString()}</h2>
                    <p className="text-sm text-base-content/60">Total earnings</p>
                </div>

                {/* Expenses */}
                <div className="bg-white dark:bg-base-200 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-base-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                            <FaArrowDown className="text-2xl text-red-500" />
                        </div>
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            Expense
                        </span>
                    </div>
                    <h2 className="text-3xl font-bold text-base-content mb-1">BDT {totalExpenses.toLocaleString()}</h2>
                    <p className="text-sm text-base-content/60">Total spending</p>
                </div>
            </div>

            {/* Charts & Recent Transactions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-base-200 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-base-300">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-base-content flex items-center gap-2">
                            <FaChartLine className="text-primary-500" />
                            Financial Overview
                        </h3>
                    </div>
                    <div className="h-[300px] w-full">
                        {monthlyData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        cursor={{ fill: 'transparent' }}
                                    />
                                    <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} name="Income" barSize={20} />
                                    <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} name="Expense" barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-base-content/40">
                                No data available for chart
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-base-200 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-base-300">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-base-content flex items-center gap-2">
                            <FaHistory className="text-primary-500" />
                            Recent Activity
                        </h3>
                        <Link to="/dashboard/my-transactions" className="text-sm text-primary-500 hover:text-primary-600 font-medium">
                            View All
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentTransactions.map((txn, idx) => (
                            <div key={txn._id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-base-300 rounded-xl transition-colors border border-transparent hover:border-gray-100 dark:hover:border-base-100">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${txn.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                        }`}>
                                        {txn.type === 'income' ? <FaArrowUp /> : <FaArrowDown />}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-base-content">{txn.category}</p>
                                        <p className="text-xs text-base-content/60">{new Date(txn.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className={`font-bold ${txn.type === 'income' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {txn.type === 'income' ? '+' : '-'} {txn.amount.toLocaleString()}
                                </span>
                            </div>
                        ))}
                        {recentTransactions.length === 0 && (
                            <div className="text-center py-8 text-base-content/40">
                                No recent transactions
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
