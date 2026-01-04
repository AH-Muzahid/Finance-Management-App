import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar, Area, AreaChart, RadialBarChart, RadialBar, Legend } from 'recharts';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/firebase.init';

import PageSkeleton from '../Components/PageSkeleton';
import { getTransactions } from '../api/transactions';
import { FaDollarSign, FaChartLine, FaExclamationTriangle, FaCheck, FaWallet, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const Reports = () => {
    const [user, authLoading] = useAuthState(auth);
    const [dataLoading, setDataLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('all');

    // Filter transactions by selected month
    const filteredTransactions = useMemo(() => {
        const safeTransactions = Array.isArray(transactions) ? transactions : [];
        return selectedMonth === 'all'
            ? safeTransactions
            : safeTransactions.filter(t => {
                const transactionMonth = new Date(t.date).getMonth();
                return transactionMonth === parseInt(selectedMonth);
            });
    }, [selectedMonth, transactions]);

    const expensesByCategory = useMemo(() => {
        return filteredTransactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {});
    }, [filteredTransactions]);

    const pieData = useMemo(() => {
        return Object.entries(expensesByCategory).map(([category, amount]) => ({
            name: category,
            value: amount
        }));
    }, [expensesByCategory]);

    // Generate monthly data from transactions
    const monthlyData = useMemo(() => {
        const monthlyStats = {};

        filteredTransactions.forEach(t => {
            const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short' });
            if (!monthlyStats[month]) {
                monthlyStats[month] = { month, income: 0, expenses: 0, payable: 0, receivable: 0 };
            }

            if (t.type === 'income') {
                monthlyStats[month].income += t.amount;
            } else {
                monthlyStats[month].expenses += t.amount;
            }
            if (t.type === 'payable') {
                monthlyStats[month].payable += t.amount;
            } else {
                monthlyStats[month].receivable += t.amount;
            }
        });

        return Object.values(monthlyStats);
    }, [filteredTransactions]);

    const COLORS = ['#f97316', '#10B981', '#EF4444', '#3B82F6', '#8B5CF6'];

    // Calculate financial metrics first
    const { totalIncome, totalExpenses, netBalance, savingsRate } = useMemo(() => {
        const income = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const receivable = filteredTransactions.filter(t => t.type === 'receivable').reduce((sum, t) => sum + t.amount, 0);
        const payable = filteredTransactions.filter(t => t.type === 'payable').reduce((sum, t) => sum + t.amount, 0);
        const balance = income - expenses;
        const rate = income > 0 ? ((income - expenses) / income * 100) : 0;
        return { totalIncome: income, totalExpenses: expenses, netBalance: balance, savingsRate: rate };
    }, [filteredTransactions]);

    // Generate weekly data
    const weeklyData = useMemo(() => {
        const weeklyStats = {};
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Initialize all days
        days.forEach(day => {
            weeklyStats[day] = { day, amount: 0, count: 0 };
        });

        filteredTransactions.filter(t => t.type === 'expense').forEach(t => {
            const dayName = days[new Date(t.date).getDay()];
            weeklyStats[dayName].amount += t.amount;
            weeklyStats[dayName].count += 1;
        });

        return Object.values(weeklyStats);
    }, [filteredTransactions]);

    // Income vs Expense comparison data
    const comparisonData = useMemo(() => [
        { name: 'Income', value: totalIncome, fill: '#10B981' },
        { name: 'Expenses', value: totalExpenses, fill: '#EF4444' }
    ], [totalIncome, totalExpenses]);

    // Donut chart data for savings
    const savingsData = useMemo(() => [
        { name: 'Saved', value: Math.max(0, netBalance), fill: '#10B981' },
        { name: 'Spent', value: totalExpenses, fill: '#EF4444' }
    ], [netBalance, totalExpenses]);

    // Top spending categories
    const topCategories = useMemo(() => {
        return Object.entries(expensesByCategory)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3);
    }, [expensesByCategory]);

    // Average transaction amount
    const avgTransaction = useMemo(() => {
        return filteredTransactions.length > 0
            ? filteredTransactions.reduce((sum, t) => sum + t.amount, 0) / filteredTransactions.length
            : 0;
    }, [filteredTransactions]);

    // Financial health score (0-100)
    const healthScore = useMemo(() => {
        let score = 50;
        if (savingsRate > 20) score += 30;
        else if (savingsRate > 10) score += 20;
        else if (savingsRate > 0) score += 10;
        else score -= 20;

        if (totalExpenses > 0 && expensesByCategory) {
            const categoryCount = Object.keys(expensesByCategory).length;
            if (categoryCount > 5) score += 10;
        }

        return Math.max(0, Math.min(100, score));
    }, [savingsRate, totalExpenses, expensesByCategory]);

    // Get financial insights
    const insights = useMemo(() => {
        const result = [];

        if (savingsRate > 20) {
            result.push({ type: 'success', text: 'Excellent savings rate! You are saving over 20% of your income.' });
        } else if (savingsRate < 0) {
            result.push({ type: 'warning', text: 'You are spending more than you earn. Consider reducing expenses.' });
        }

        if (topCategories.length > 0) {
            const topCategory = topCategories[0];
            const percentage = ((topCategory[1] / totalExpenses) * 100).toFixed(1);
            result.push({
                type: 'info',
                text: `${topCategory[0]} is your largest expense category (${percentage}% of total expenses).`
            });
        }

        if (avgTransaction > 500) {
            result.push({ type: 'info', text: 'You tend to make high-value transactions. Consider budgeting for large expenses.' });
        }

        return result;
    }, [savingsRate, topCategories, totalExpenses, avgTransaction]);

    const fetchUserTransactions = useCallback(async () => {
        try {
            setDataLoading(true);
            const data = await getTransactions(user?.email, 'date', 'desc');
            if (Array.isArray(data)) {
                setTransactions(data);
            } else if (data && Array.isArray(data.transactions)) {
                setTransactions(data.transactions);
            } else {
                setTransactions([]);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setTransactions([]);
        } finally {
            setDataLoading(false);
        }
    }, [user?.email]);

    useEffect(() => {
        document.title = 'Reports - Finance Management';
        if (!authLoading && user) {
            fetchUserTransactions();
        } else if (!authLoading && !user) {
            // Clear transactions when user logs out
            setTransactions([]);
            setDataLoading(false);
        }
    }, [authLoading, user, fetchUserTransactions]);

    const months = [
        { value: 'all', label: 'All Months' },
        { value: '0', label: 'January' },
        { value: '1', label: 'February' },
        { value: '2', label: 'March' },
        { value: '3', label: 'April' },
        { value: '4', label: 'May' },
        { value: '5', label: 'June' },
        { value: '6', label: 'July' },
        { value: '7', label: 'August' },
        { value: '8', label: 'September' },
        { value: '9', label: 'October' },
        { value: '10', label: 'November' },
        { value: '11', label: 'December' }
    ];

    const totalReceivable = filteredTransactions.filter(t => t.type === 'receivable').reduce((sum, t) => sum + t.amount, 0);
    const totalPayable = filteredTransactions.filter(t => t.type === 'payable').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;




    return (
        <div className="min-h-screen bg-gray-50 dark:bg-base-100 pt-20 p-4">
            <div className="max-w-[1220px] mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-base-content mb-2">Financial Reports</h1>
                        <p className="text-base-content/70">Analyze your financial data with charts and insights</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-base-content">Filter by Month:</label>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                        >
                            {months.map(month => (
                                <option key={month.value} value={month.value}>
                                    {month.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Summary Cards */}
                {dataLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 animate-pulse">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-base-200 rounded-xl p-6 h-32 shadow-lg border border-gray-100 dark:border-base-300">
                                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4"></div>
                                <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                        <div className="bg-white dark:bg-base-200 rounded-xl p-6 text-center shadow-lg border border-gray-100 dark:border-base-300">
                            <h3 className="text-base font-semibold text-base-content mb-2">Total Income</h3>
                            <p className="text-2xl font-bold text-green-600">BDT {totalIncome.toLocaleString()}</p>
                        </div>
                        <div className="bg-white dark:bg-base-200 rounded-xl p-6 text-center shadow-lg border border-gray-100 dark:border-base-300">
                            <h3 className="text-base font-semibold text-base-content mb-2">Total Expenses</h3>
                            <p className="text-2xl font-bold text-red-600">BDT {totalExpenses.toLocaleString()}</p>
                        </div>
                        <div className="bg-white dark:bg-base-200 rounded-xl p-6 text-center shadow-lg border border-gray-100 dark:border-base-300">
                            <h3 className="text-base font-semibold text-base-content mb-2">Receivable</h3>
                            <p className="text-2xl font-bold text-blue-600">BDT {totalReceivable.toLocaleString()}</p>
                        </div>
                        <div className="bg-white dark:bg-base-200 rounded-xl p-6 text-center shadow-lg border border-gray-100 dark:border-base-300">
                            <h3 className="text-base font-semibold text-base-content mb-2">Payable</h3>
                            <p className="text-2xl font-bold text-orange-600">BDT {totalPayable.toLocaleString()}</p>
                        </div>
                        <div className="bg-white dark:bg-base-200 rounded-xl p-6 text-center shadow-lg border border-gray-100 dark:border-base-300">
                            <h3 className="text-base font-semibold text-base-content mb-2">Net Balance</h3>
                            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>BDT {balance.toLocaleString()}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Expense Categories */}
                    <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-6">
                        <h3 className="text-lg font-semibold text-base-content mb-6">Expenses by Category</h3>
                        {dataLoading ? (
                            <div className="h-[300px] flex items-center justify-center animate-pulse">
                                <div className="h-64 w-64 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        innerRadius={40}
                                        fill="#8884d8"
                                        dataKey="value"
                                        stroke="#ffffff"
                                        strokeWidth={2}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#f97316',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: 'white'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Monthly Trends - Area Chart */}
                    <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-6">
                        <h3 className="text-lg font-semibold text-base-content mb-6">Monthly Income vs Expenses</h3>
                        {dataLoading ? (
                            <div className="h-[300px] w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={monthlyData}>
                                    <defs>
                                        <linearlinear id="incomelinear" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                        </linearlinear>
                                        <linearlinear id="expenselinear" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                        </linearlinear>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 12 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#f97316',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: 'white'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="income"
                                        stroke="#10B981"
                                        strokeWidth={2}
                                        fill="url(#incomelinear)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="expenses"
                                        stroke="#EF4444"
                                        strokeWidth={2}
                                        fill="url(#expenselinear)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Additional Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Weekly Spending Pattern */}
                    <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-6">
                        <h3 className="text-lg font-semibold text-base-content mb-6">Weekly Spending Pattern</h3>
                        {dataLoading ? (
                            <div className="h-[300px] w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={weeklyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 12 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#f97316',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: 'white'
                                        }}
                                        formatter={(value) => [`BDT  ${value.toLocaleString()}`, 'Amount']}
                                    />
                                    <Bar
                                        dataKey="amount"
                                        fill="#f97316"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Savings Donut Chart */}
                    {dataLoading ? (
                        <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-6 mb-8 animate-pulse">
                            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
                            <div className="h-[300px] flex items-center justify-center">
                                <div className="h-64 w-64 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                            </div>
                        </div>
                    ) : (
                        netBalance > 0 && (
                            <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-6 mb-8">
                                <h3 className="text-lg font-semibold text-base-content mb-6">Savings Overview</h3>
                                <div className="flex items-center justify-center">
                                    <ResponsiveContainer width={400} height={300}>
                                        <PieChart>
                                            <Pie
                                                data={savingsData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={80}
                                                outerRadius={120}
                                                paddingAngle={5}
                                                dataKey="value"
                                                startAngle={90}
                                                endAngle={450}
                                            >
                                                {savingsData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#f97316',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    color: 'white'
                                                }}
                                                formatter={(value) => [`BDT  ${value.toLocaleString()}`, 'Amount']}
                                            />
                                            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-current text-base-content text-lg font-bold">
                                                {savingsRate.toFixed(1)}%
                                            </text>
                                            <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="fill-current text-base-content/70 text-sm">
                                                Saved
                                            </text>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )
                    )}
                </div>

                {/* Financial Health Score */}
                <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-6 mb-8">
                    <h3 className="text-lg font-semibold text-base-content mb-4 flex items-center gap-2">
                        <FaChartLine className="text-orange-500" />
                        Financial Health Score
                    </h3>
                    {dataLoading ? (
                        <div className="flex items-center gap-4 animate-pulse">
                            <div className="flex-1">
                                <div className="flex justify-between mb-2">
                                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3"></div>
                            </div>
                            <div className="text-right">
                                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full ml-auto mb-1"></div>
                                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded ml-auto"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-base-content/70">Health Score</span>
                                    <span className="text-sm font-semibold">{healthScore}/100</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                    <div
                                        className={`h-3 rounded-full transition-all duration-500 ${healthScore >= 80 ? 'bg-green-500' :
                                            healthScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                        style={{ width: `${healthScore}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="text-right">
                                {healthScore >= 80 ? (
                                    <FaCheck className="text-green-500 text-2xl" />
                                ) : healthScore >= 60 ? (
                                    <FaCheck className="text-yellow-500 text-2xl" />
                                ) : (
                                    <FaExclamationTriangle className="text-red-500 text-2xl" />
                                )}
                                <p className="text-xs text-base-content/70 mt-1">
                                    {healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : 'Needs Attention'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Key Metrics */}
                {dataLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-pulse">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl p-6 h-24"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-linear-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm">Savings Rate</p>
                                    <p className="text-2xl font-bold">{savingsRate.toFixed(1)}%</p>
                                </div>
                                <FaCheck className="text-3xl text-green-200" />
                            </div>
                        </div>

                        <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm">Avg Transaction</p>
                                    <p className="text-2xl font-bold">BDT  {avgTransaction.toFixed(0)}</p>
                                </div>
                                <FaDollarSign className="text-3xl text-blue-200" />
                            </div>
                        </div>

                        <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm">Total Transactions</p>
                                    <p className="text-2xl font-bold">{filteredTransactions.length}</p>
                                </div>
                                <FaChartLine className="text-3xl text-purple-200" />
                            </div>
                        </div>

                        <div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-orange-100 text-sm">Categories</p>
                                    <p className="text-2xl font-bold">{Object.keys(expensesByCategory).length}</p>
                                </div>
                                <FaChartLine className="text-3xl text-orange-200" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Top Spending Categories */}
                {dataLoading ? (
                    <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-6 mb-8 animate-pulse">
                        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    </div>
                                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    topCategories.length > 0 && (
                        <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-6 mb-8">
                            <h3 className="text-lg font-semibold text-base-content mb-4">Top Spending Categories</h3>
                            <div className="space-y-4">
                                {topCategories.map(([category, amount], index) => {
                                    const percentage = ((amount / totalExpenses) * 100).toFixed(1);
                                    return (
                                        <div key={category} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-4 h-4 rounded-full"
                                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                ></div>
                                                <span className="font-medium text-base-content">{category}</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-base-content">BDT  {amount.toLocaleString()}</p>
                                                <p className="text-sm text-base-content/70">{percentage}%</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )
                )}

                {/* Financial Insights */}
                {dataLoading ? (
                    <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-6 mb-8 animate-pulse">
                        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                        <div className="space-y-3">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 h-16"></div>
                            ))}
                        </div>
                    </div>
                ) : (
                    insights.length > 0 && (
                        <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-6 mb-8">
                            <h3 className="text-lg font-semibold text-base-content mb-4">Financial Insights</h3>
                            <div className="space-y-3">
                                {insights.map((insight, index) => (
                                    <div
                                        key={index}
                                        className={`p-4 rounded-lg border-l-4 ${insight.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-green-500' :
                                            insight.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500' :
                                                'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                                            }`}
                                    >
                                        <p className="text-sm text-base-content">{insight.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                )}

                {/* Quick Stats Grid */}
                {dataLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-4 h-24"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-4 text-center">
                            <div className="text-2xl font-bold text-orange-500 mb-1">{filteredTransactions.length}</div>
                            <div className="text-sm text-base-content/70">Total Transactions</div>
                        </div>
                        <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-4 text-center">
                            <div className="text-2xl font-bold text-blue-500 mb-1">BDT  {avgTransaction.toFixed(0)}</div>
                            <div className="text-sm text-base-content/70">Avg Transaction</div>
                        </div>
                        <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-4 text-center">
                            <div className="text-2xl font-bold text-purple-500 mb-1">{Object.keys(expensesByCategory).length}</div>
                            <div className="text-sm text-base-content/70">Categories Used</div>
                        </div>
                        <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-4 text-center">
                            <div className={`text-2xl font-bold mb-1 ${healthScore >= 80 ? 'text-green-500' :
                                healthScore >= 60 ? 'text-yellow-500' : 'text-red-500'
                                }`}>{healthScore}/100</div>
                            <div className="text-sm text-base-content/70">Health Score</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;