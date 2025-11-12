import React, { useState, useEffect, useCallback } from 'react';
import { PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar, Area, AreaChart, RadialBarChart, RadialBar, Legend } from 'recharts';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/firebase.init';
import LoadingSpinner from '../Components/LoadingSpinner';
import { getTransactions } from '../api/transactions';
import { FaDollarSign, FaChartLine, FaExclamationTriangle, FaCheck, FaWallet, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const Reports = () => {
    const [user, authLoading] = useAuthState(auth);
    const [dataLoading, setDataLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('all');

    // Filter transactions by selected month
    const filteredTransactions = selectedMonth === 'all' 
        ? transactions 
        : transactions.filter(t => {
            const transactionMonth = new Date(t.date).getMonth();
            return transactionMonth === parseInt(selectedMonth);
        });

    const expensesByCategory = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});

    const pieData = Object.entries(expensesByCategory).map(([category, amount]) => ({
        name: category,
        value: amount
    }));

    // Generate monthly data from transactions
    const generateMonthlyData = (transactions) => {
        const monthlyStats = {};
        
        transactions.forEach(t => {
            const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short' });
            if (!monthlyStats[month]) {
                monthlyStats[month] = { month, income: 0, expenses: 0 };
            }
            
            if (t.type === 'income') {
                monthlyStats[month].income += t.amount;
            } else {
                monthlyStats[month].expenses += t.amount;
            }
        });
        
        return Object.values(monthlyStats);
    };

    const monthlyData = generateMonthlyData(filteredTransactions);
    const COLORS = ['#f97316', '#10B981', '#EF4444', '#3B82F6', '#8B5CF6'];

    // Calculate financial metrics first
    const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const netBalance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;

    // Generate weekly data
    const generateWeeklyData = (transactions) => {
        const weeklyStats = {};
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        // Initialize all days
        days.forEach(day => {
            weeklyStats[day] = { day, amount: 0, count: 0 };
        });
        
        transactions.forEach(t => {
            const dayName = days[new Date(t.date).getDay()];
            weeklyStats[dayName].amount += t.amount;
            weeklyStats[dayName].count += 1;
        });
        
        return Object.values(weeklyStats);
    };

    const weeklyData = generateWeeklyData(filteredTransactions.filter(t => t.type === 'expense'));

    // Income vs Expense comparison data
    const comparisonData = [
        { name: 'Income', value: totalIncome, fill: '#10B981' },
        { name: 'Expenses', value: totalExpenses, fill: '#EF4444' }
    ];

    // Donut chart data for savings
    const savingsData = [
        { name: 'Saved', value: Math.max(0, netBalance), fill: '#10B981' },
        { name: 'Spent', value: totalExpenses, fill: '#EF4444' }
    ];
    
    // Top spending categories
    const topCategories = Object.entries(expensesByCategory)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3);
    
    // Average transaction amount
    const avgTransaction = filteredTransactions.length > 0 
        ? filteredTransactions.reduce((sum, t) => sum + t.amount, 0) / filteredTransactions.length 
        : 0;
    
    // Financial health score (0-100)
    const getFinancialHealthScore = () => {
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
    };
    
    const healthScore = getFinancialHealthScore();
    
    // Get financial insights
    const getFinancialInsights = () => {
        const insights = [];
        
        if (savingsRate > 20) {
            insights.push({ type: 'success', text: 'Excellent savings rate! You are saving over 20% of your income.' });
        } else if (savingsRate < 0) {
            insights.push({ type: 'warning', text: 'You are spending more than you earn. Consider reducing expenses.' });
        }
        
        if (topCategories.length > 0) {
            const topCategory = topCategories[0];
            const percentage = ((topCategory[1] / totalExpenses) * 100).toFixed(1);
            insights.push({ 
                type: 'info', 
                text: `${topCategory[0]} is your largest expense category (${percentage}% of total expenses).` 
            });
        }
        
        if (avgTransaction > 500) {
            insights.push({ type: 'info', text: 'You tend to make high-value transactions. Consider budgeting for large expenses.' });
        }
        
        return insights;
    };
    
    const insights = getFinancialInsights();

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
        document.title = 'Reports - Finance Management';
        if (!authLoading && user) {
            fetchUserTransactions();
        } else if (!authLoading && !user) {
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

    if (authLoading || dataLoading) {
        return <LoadingSpinner fullScreen />;
    }

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

                {/* Beautiful Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Total Income Card */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 via-green-600 to-green-700 p-6 text-white shadow-xl">
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10"></div>
                        <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-white/10"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="rounded-full bg-white/20 p-3">
                                    <FaArrowUp className="h-6 w-6" />
                                </div>
                                <div className="text-right">
                                    <p className="text-green-100 text-sm font-medium">Total Income</p>
                                    <p className="text-2xl font-bold">BDT {totalIncome.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-100 text-sm">
                                    {filteredTransactions.filter(t => t.type === 'income').length} transactions
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Total Expenses Card */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 via-red-600 to-red-700 p-6 text-white shadow-xl">
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10"></div>
                        <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-white/10"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="rounded-full bg-white/20 p-3">
                                    <FaArrowDown className="h-6 w-6" />
                                </div>
                                <div className="text-right">
                                    <p className="text-red-100 text-sm font-medium">Total Expenses</p>
                                    <p className="text-2xl font-bold">BDT {totalExpenses.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-red-100 text-sm">
                                    {filteredTransactions.filter(t => t.type === 'expense').length} transactions
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Net Balance Card */}
                    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${netBalance >= 0 ? 'from-blue-500 via-blue-600 to-blue-700' : 'from-orange-500 via-orange-600 to-orange-700'} p-6 text-white shadow-xl`}>
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10"></div>
                        <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-white/10"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="rounded-full bg-white/20 p-3">
                                    <FaWallet className="h-6 w-6" />
                                </div>
                                <div className="text-right">
                                    <p className={`${netBalance >= 0 ? 'text-blue-100' : 'text-orange-100'} text-sm font-medium`}>Net Balance</p>
                                    <p className="text-2xl font-bold">BDT {netBalance.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`${netBalance >= 0 ? 'text-blue-100' : 'text-orange-100'} text-sm`}>
                                    Savings Rate: {savingsRate.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Expense Categories */}
                    <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-6">
                        <h3 className="text-lg font-semibold text-base-content mb-6">Expenses by Category</h3>
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
                    </div>

                    {/* Monthly Trends - Area Chart */}
                    <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-6">
                        <h3 className="text-lg font-semibold text-base-content mb-6">Monthly Income vs Expenses</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={monthlyData}>
                                <defs>
                                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                                    </linearGradient>
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
                                    fill="url(#incomeGradient)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="expenses"
                                    stroke="#EF4444"
                                    strokeWidth={2}
                                    fill="url(#expenseGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Additional Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Weekly Spending Pattern */}
                    <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-6">
                        <h3 className="text-lg font-semibold text-base-content mb-6">Weekly Spending Pattern</h3>
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
                                    formatter={(value) => [`BDT ${value.toLocaleString()}`, 'Amount']}
                                />
                                <Bar 
                                    dataKey="amount" 
                                    fill="#f97316"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Income vs Expense Donut */}
                    <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-6">
                        <h3 className="text-lg font-semibold text-base-content mb-6">Income vs Expenses</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={comparisonData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {comparisonData.map((entry, index) => (
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
                                    formatter={(value) => [`BDT ${value.toLocaleString()}`, 'Amount']}
                                />
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={36}
                                    iconType="circle"
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Spending Bar Chart */}
                <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-6 mb-8">
                    <h3 className="text-lg font-semibold text-base-content mb-6">Top Expense Categories</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={topCategories.map(([name, value]) => ({ name, value }))} layout="horizontal">
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                                type="number"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                            />
                            <YAxis 
                                type="category"
                                dataKey="name" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                width={100}
                            />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: '#f97316',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: 'white'
                                }}
                                formatter={(value) => [`BDT ${value.toLocaleString()}`, 'Amount']}
                            />
                            <Bar 
                                dataKey="value" 
                                fill="#f97316"
                                radius={[0, 4, 4, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Savings Donut Chart */}
                {netBalance > 0 && (
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
                                        formatter={(value) => [`BDT ${value.toLocaleString()}`, 'Amount']}
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
                )}

                {/* Financial Health Score */}
                <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-6 mb-8">
                    <h3 className="text-lg font-semibold text-base-content mb-4 flex items-center gap-2">
                        <FaChartLine className="text-orange-500" />
                        Financial Health Score
                    </h3>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-base-content/70">Health Score</span>
                                <span className="text-sm font-semibold">{healthScore}/100</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                <div 
                                    className={`h-3 rounded-full transition-all duration-500 ${
                                        healthScore >= 80 ? 'bg-green-500' :
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
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm">Savings Rate</p>
                                <p className="text-2xl font-bold">{savingsRate.toFixed(1)}%</p>
                            </div>
                            <FaCheck className="text-3xl text-green-200" />
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm">Avg Transaction</p>
                                <p className="text-2xl font-bold">BDT {avgTransaction.toFixed(0)}</p>
                            </div>
                            <FaDollarSign className="text-3xl text-blue-200" />
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm">Total Transactions</p>
                                <p className="text-2xl font-bold">{filteredTransactions.length}</p>
                            </div>
                            <FaChartLine className="text-3xl text-purple-200" />
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100 text-sm">Categories</p>
                                <p className="text-2xl font-bold">{Object.keys(expensesByCategory).length}</p>
                            </div>
                            <FaChartLine className="text-3xl text-orange-200" />
                        </div>
                    </div>
                </div>

                {/* Top Spending Categories */}
                {topCategories.length > 0 && (
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
                                            <p className="font-semibold text-base-content">BDT {amount.toLocaleString()}</p>
                                            <p className="text-sm text-base-content/70">{percentage}%</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Financial Insights */}
                {insights.length > 0 && (
                    <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-6 mb-8">
                        <h3 className="text-lg font-semibold text-base-content mb-4">Financial Insights</h3>
                        <div className="space-y-3">
                            {insights.map((insight, index) => (
                                <div 
                                    key={index} 
                                    className={`p-4 rounded-lg border-l-4 ${
                                        insight.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-green-500' :
                                        insight.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500' :
                                        'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                                    }`}
                                >
                                    <p className="text-sm text-base-content">{insight.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-4 text-center">
                        <div className="text-2xl font-bold text-orange-500 mb-1">{filteredTransactions.length}</div>
                        <div className="text-sm text-base-content/70">Total Transactions</div>
                    </div>
                    <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-4 text-center">
                        <div className="text-2xl font-bold text-blue-500 mb-1">BDT {avgTransaction.toFixed(0)}</div>
                        <div className="text-sm text-base-content/70">Avg Transaction</div>
                    </div>
                    <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-4 text-center">
                        <div className="text-2xl font-bold text-purple-500 mb-1">{Object.keys(expensesByCategory).length}</div>
                        <div className="text-sm text-base-content/70">Categories Used</div>
                    </div>
                    <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-4 text-center">
                        <div className={`text-2xl font-bold mb-1 ${
                            healthScore >= 80 ? 'text-green-500' :
                            healthScore >= 60 ? 'text-yellow-500' : 'text-red-500'
                        }`}>{healthScore}/100</div>
                        <div className="text-sm text-base-content/70">Health Score</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;