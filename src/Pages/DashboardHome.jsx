import React, { useState, useEffect, useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/firebase.init';
import { getTransactions } from '../api/transactions';
import PageSkeleton from '../Components/PageSkeleton';
import {
    FaWallet, FaArrowDown, FaArrowUp, FaChartLine, FaArrowRight,
    FaShoppingBag, FaExclamationCircle, FaCheckCircle, FaLightbulb, FaCalendarDay, FaThumbsUp, FaExclamationTriangle
} from 'react-icons/fa';
import { Link } from 'react-router';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, Cell, PieChart, Pie, AreaChart, Area } from 'recharts';
import { useTheme } from 'next-themes';

const DashboardHome = () => {
    const [user, authLoading] = useAuthState(auth);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState('all');
    const { resolvedTheme } = useTheme();

    const fetchUserTransactions = async () => {
        try {
            setLoading(true);
            const data = await getTransactions(user?.email, 'date', 'desc', 1, 10000);
            if (Array.isArray(data)) {
                setTransactions(data);
            } else if (data.transactions && Array.isArray(data.transactions)) {
                setTransactions(data.transactions);
            } else {
                setTransactions([]);
            }
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

    // --- DATA LOGIC ---

    const currentStats = useMemo(() => {
        let relevantTxns = Array.isArray(transactions) ? transactions : [];
        if (selectedMonth !== 'all') {
            relevantTxns = transactions.filter(t => new Date(t.date).getMonth() === parseInt(selectedMonth));
        }

        const income = relevantTxns.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = relevantTxns.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const balance = income - expenses;
        const savingsRate = income > 0 ? ((income - expenses) / income * 100) : 0;

        // Calculate daily average (approximate)
        const daysInPeriod = selectedMonth === 'all' ? 30 : new Date(new Date().getFullYear(), parseInt(selectedMonth) + 1, 0).getDate();
        const dailyAverage = expenses / (selectedMonth === 'all' ? 30 : Math.min(daysInPeriod, new Date().getDate()));

        // Budget/Forecasting Logic for "Pulse" section
        const todayDate = new Date().getDate();
        const daysRemaining = selectedMonth === 'all' ? 0 : Math.max(1, daysInPeriod - todayDate);
        const safeDailySpend = (income - expenses) > 0 ? (income - expenses) / (selectedMonth === 'all' ? 30 : daysRemaining) : 0;
        const projectedSavings = (income - expenses); // Simple projection

        return {
            transactions: relevantTxns,
            income,
            expenses,
            balance,
            savingsRate,
            dailyAverage,
            daysRemaining,
            safeDailySpend,
            projectedSavings
        };
    }, [selectedMonth, transactions]);

    // --- HEALTH SCORE & INSIGHTS ---

    // Calculate Receivable and Payable for health score context
    const additionalStats = useMemo(() => {
        const receivable = currentStats.transactions.filter(t => t.type === 'receivable').reduce((sum, t) => sum + t.amount, 0);
        const payable = currentStats.transactions.filter(t => t.type === 'payable').reduce((sum, t) => sum + t.amount, 0);
        return { receivable, payable };
    }, [currentStats]);

    // Financial health score (0-100)
    const healthScore = useMemo(() => {
        let score = 50;
        const { savingsRate, expenses, income } = currentStats;

        if (savingsRate > 20) score += 30;
        else if (savingsRate > 10) score += 20;
        else if (savingsRate > 0) score += 10;
        else score -= 20;

        // Deduction for excessive undefined/high expenses relative to income could go here
        // Bonus for having diversity or staying within budget (simplified proxy)

        return Math.max(0, Math.min(100, score));
    }, [currentStats]);





    const expensesByCategory = useMemo(() => {
        return currentStats.transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {});
    }, [currentStats]);

    const pieData = useMemo(() => {
        return Object.entries(expensesByCategory)
            .map(([category, amount]) => ({ name: category, value: amount }))
            .sort((a, b) => b.value - a.value);
    }, [expensesByCategory]);

    const monthlyData = useMemo(() => {
        const stats = {};

        // If sorting by month (all), we want to ensure order Jan -> Dec. 
        // If sorting by day (specific month), order by date naturally follows ingestion if sorted, but map ensures keys.

        currentStats.transactions.forEach(t => {
            let key;
            // Determine grouping key
            if (selectedMonth === 'all') {
                // Group by Month (e.g., "Jan", "Feb")
                const date = new Date(t.date);
                key = date.toLocaleDateString('en-US', { month: 'short' });
                // We add a sortable index to help Recharts or sorting logic if needed, 
                // but usually Recharts renders in array order. We'll handle sorting below.
            } else {
                // Group by Day (e.g., "Jan 01")
                key = new Date(t.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
            }

            if (!stats[key]) {
                stats[key] = {
                    name: key,
                    income: 0,
                    expenses: 0,
                    // Store a timestamp or month index for sorting
                    sortValue: selectedMonth === 'all' ? new Date(t.date).getMonth() : new Date(t.date).getTime()
                };
            }

            if (t.type === 'income') stats[key].income += t.amount;
            else if (t.type === 'expense') stats[key].expenses += t.amount;
        });

        // Convert to array and sort
        const result = Object.values(stats);

        if (selectedMonth === 'all') {
            // Sort by Month Index (Jan=0, Feb=1...)
            const monthOrder = { "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5, "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11 };
            result.sort((a, b) => monthOrder[a.name] - monthOrder[b.name]);
        } else {
            // Sort by Date (Day 1 < Day 30)
            result.sort((a, b) => a.sortValue - b.sortValue);
        }

        return result;
    }, [currentStats, selectedMonth]);

    const weeklyData = useMemo(() => {
        const weeklyStats = {};
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => { weeklyStats[day] = { day, amount: 0 }; });
        currentStats.transactions.filter(t => t.type === 'expense').forEach(t => {
            const dayName = days[new Date(t.date).getDay()];
            weeklyStats[dayName].amount += t.amount;
        });
        return Object.values(weeklyStats);
    }, [currentStats]);

    // --- INSIGHTS ---
    const insights = useMemo(() => {
        const result = [];
        const { savingsRate, income, expenses } = currentStats;

        // Savings Health
        if (savingsRate > 30) result.push({ type: 'success', icon: FaCheckCircle, title: 'Excellent Savings', text: 'You are saving more than 30% of your income!' });
        else if (savingsRate > 10) result.push({ type: 'info', icon: FaLightbulb, title: 'Good Start', text: 'Try to bump your savings to 20% for better stability.' });

        // Budget Alert
        if (expenses > income * 0.9) result.push({ type: 'warning', icon: FaExclamationCircle, title: 'High Spending', text: 'You have spent over 90% of your income this period.' });
        if (expenses > income) result.push({ type: 'error', icon: FaExclamationCircle, title: 'Over Budget', text: 'Expenses have exceeded your income.' });

        // Category Spike
        if (pieData.length > 0) {
            const topCat = pieData[0];
            const percent = ((topCat.value / expenses) * 100).toFixed(0);
            result.push({ type: 'neutral', icon: FaShoppingBag, title: 'Top Category', text: `${topCat.name} accounts for ${percent}% of your spending.` });
        }

        return result.slice(0, 3);
    }, [currentStats, pieData]);


    const months = [
        { value: 'all', label: 'All Time' },
        { value: '0', label: 'January' }, { value: '1', label: 'February' }, { value: '2', label: 'March' },
        { value: '3', label: 'April' }, { value: '4', label: 'May' }, { value: '5', label: 'June' },
        { value: '6', label: 'July' }, { value: '7', label: 'August' }, { value: '8', label: 'September' },
        { value: '9', label: 'October' }, { value: '10', label: 'November' }, { value: '11', label: 'December' }
    ];

    const CHART_COLORS = [
        '#F97316', // Primary 500
        '#6366F1', // Secondary 500
        '#10B981', // Accent 500
        '#FB923C', // Primary 400
        '#818CF8', // Secondary 400
        '#34D399', // Accent 400
        '#EA580C', // Primary 600
        '#4F46E5', // Secondary 600
        '#059669'  // Accent 600
    ];

    const recentTransactions = currentStats.transactions.slice(0, 5);

    if (loading || authLoading) return <PageSkeleton />;

    // --- COMPONENTS ---

    const GradientCard = ({ title, amount, subtext, icon: Icon, gradient, textColor = "text-white" }) => (
        <div className={`relative overflow-hidden rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg transition-transform hover:scale-[1.02] duration-300 group`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-100 dark:opacity-90`}></div>
            {/* Decorative Circle */}
            <div className="absolute -right-6 -top-6 w-20 h-20 md:w-24 md:h-24 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

            <div className={`relative z-10 ${textColor}`}>
                <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg shadow-inner">
                        <Icon className="text-lg md:text-xl" />
                    </div>
                    <div className="flex flex-col items-end">
                        <p className="opacity-90 text-[10px] md:text-xs font-semibold uppercase tracking-wider">{title}</p>
                    </div>
                </div>
                <div>
                    <h3 className="text-xl md:text-2xl font-black tracking-tight mb-0.5">
                        {amount}
                    </h3>
                    <p className="text-[10px] md:text-xs opacity-80 font-medium flex items-center gap-1">
                        {subtext}
                    </p>
                </div>
            </div>
        </div>
    );

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/95 dark:bg-base-300/95 backdrop-blur-sm p-4 border border-gray-100 dark:border-base-200 shadow-xl rounded-2xl">
                    <p className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-2 pb-2 border-b border-gray-100 dark:border-base-200">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }}></div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize min-w-[60px]">{entry.name}:</span>
                            <span className="font-bold text-gray-900 dark:text-gray-100 text-xs">BDT {entry.value.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen font-sans bg-gray-50/50 dark:bg-base-100 pb-6">
            <div className="max-w-[1600px] mx-auto p-2 md:p-4 md:space-y-5">
                {/* Header Section */}
                <div className="flex justify-between items-center gap-4 mb-2">
                    <div>
                        <h1 className="text-md font-bold tracking-tight text-gray-900 dark:text-gray-100">Dashboard</h1>
                    </div>
                    <div className="relative group w-auto md:w-56">
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="appearance-none px-3 py-2 md:px-5 md:py-3 bg-white dark:bg-base-200 border border-gray-100 dark:border-base-300 rounded-xl text-gray-700 dark:text-gray-200 text-xs md:text-sm font-semibold focus:ring-4 focus:ring-primary-500/10 cursor-pointer transition-all outline-none shadow-sm hover:shadow-md"
                        >
                            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                        </select>
                    </div>
                </div>

                {/* Hero Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2 md:gap-4">
                    {/* Secondary Color: Indigo -> Balance (Stability) */}
                    <GradientCard
                        title="Total Balance"
                        amount={`BDT ${currentStats.balance.toLocaleString()}`}
                        subtext={`${currentStats.income > 0 ? ((currentStats.balance / currentStats.income) * 100).toFixed(0) : 0}% saved`}
                        icon={FaWallet}
                        gradient="from-indigo-600 to-blue-600"
                    />
                    {/* Accent Color: Emerald -> Income (Growth) */}
                    <GradientCard
                        title="Total Income"
                        amount={`BDT ${currentStats.income.toLocaleString()}`}
                        subtext="Earnings this period"
                        icon={FaArrowDown}
                        gradient="from-emerald-500 to-teal-500"
                    />
                    {/* Primary Color: Orange -> Expenses (Activity/Alert) */}
                    <GradientCard
                        title="Total Expenses"
                        amount={`BDT ${currentStats.expenses.toLocaleString()}`}
                        subtext={`~BDT ${currentStats.dailyAverage.toFixed(0)} daily avg`}
                        icon={FaArrowUp}
                        gradient="from-orange-500 to-red-500"
                    />
                    {/* Neutral Color: Dark -> Savings (Vault/Premium) */}
                    <GradientCard
                        title="Net Savings"
                        amount={`${currentStats.savingsRate.toFixed(1)}%`}
                        subtext={currentStats.savingsRate > 20 ? "Healthy status" : "Needs attention"}
                        icon={FaChartLine}
                        gradient="from-[#F97316] to-[#F97316]"
                    />
                </div>

                {/* Extra Stats Row (Today's Pulse) */}


                {/* Main Content Split */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

                    {/* Left Column (Charts) - spans 8/12 on XL */}
                    <div className="xl:col-span-8 flex flex-col gap-2 md:gap-4">

                        {/* Area Chart Card */}
                        <div className="bg-white dark:bg-base-200 rounded-xl md:rounded-[2rem] p-3 md:p-6 shadow-sm border border-gray-100 dark:border-base-300">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 md:mb-6 gap-2">
                                <div>
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Cash Flow Analytics</h3>
                                    <p className="text-xs md:text-sm text-gray-500">Income vs Expenses over time</p>
                                </div>
                                <div className="flex gap-4 text-xs md:text-sm font-medium">
                                    <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800/30">
                                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500"></span>
                                        <span className="text-emerald-700 dark:text-emerald-400">Income</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-orange-100 dark:border-orange-800/30">
                                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-orange-500"></span>
                                        <span className="text-orange-700 dark:text-orange-400">Expense</span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-[250px] md:h-[400px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={monthlyData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={resolvedTheme === 'dark' ? '#374151' : '#F3F4F6'} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }} tickFormatter={(val) => `${val / 1000}k`} />
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Area type="monotone" dataKey="income" stroke="#10B981" strokeWidth={4} fillOpacity={1} fill="url(#colorIncome)" activeDot={{ r: 8, strokeWidth: 0 }} />
                                        <Area type="monotone" dataKey="expenses" stroke="#F97316" strokeWidth={4} fillOpacity={1} fill="url(#colorExpense)" activeDot={{ r: 8, strokeWidth: 0 }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Split: Weekly Bar & Budget Goals */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">

                            {/* Weekly Spending */}
                            <div className="bg-white dark:bg-base-200 rounded-xl md:rounded-[2rem] p-3 md:p-6 shadow-sm border border-gray-100 dark:border-base-300">
                                <h3 className="text-base md:text-xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4 flex items-center gap-2">
                                    <FaCalendarDay className="text-primary-500" /> Weekly Activity
                                </h3>
                                <div className="h-[200px] md:h-[250px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={weeklyData} barSize={32}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={resolvedTheme === 'dark' ? '#374151' : '#F3F4F6'} />
                                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF', fontWeight: 600 }} dy={10} />
                                            <RechartsTooltip cursor={{ fill: resolvedTheme === 'dark' ? '#374151' : '#F9FAFB', radius: 8 }} content={<CustomTooltip />} />
                                            <Bar dataKey="amount" radius={[8, 8, 8, 8]}>
                                                {weeklyData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.amount > currentStats.dailyAverage ? '#F97316' : '#FB923C80'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Smart Insights & Budget */}
                            <div className="bg-white dark:bg-base-200 rounded-xl md:rounded-[2rem] p-3 md:p-6 shadow-sm border border-gray-100 dark:border-base-300 flex flex-col">
                                <h3 className="text-base md:text-xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4 flex items-center gap-2">
                                    <FaLightbulb className="text-yellow-500" /> Financial Health
                                </h3>

                                {/* Health Score Bar */}
                                <div className="mb-4">
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</span>
                                        <span className={`text-xl font-black ${healthScore >= 80 ? 'text-green-500' : healthScore >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>{healthScore}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-1000 ease-out ${healthScore >= 80 ? 'bg-green-500' : healthScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                            style={{ width: `${healthScore}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1 text-right">{healthScore >= 80 ? 'Excellent' : healthScore >= 50 ? 'Good' : 'Needs attention'}</p>
                                </div>

                                <div className="flex-1 space-y-2 md:space-y-3 overflow-y-auto max-h-[200px] custom-scrollbar pr-1">
                                    {insights.length > 0 ? insights.map((insight, idx) => (
                                        <div key={idx} className={`p-3 rounded-lg md:rounded-xl border flex gap-2 md:gap-3 ${insight.type === 'success' ? 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-800/30' :
                                            insight.type === 'warning' ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-800/30' :
                                                insight.type === 'error' ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800/30' :
                                                    'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700'
                                            }`}>
                                            <div className={`mt-0.5 md:mt-1 text-base md:text-lg ${insight.type === 'success' ? 'text-green-600' :
                                                insight.type === 'warning' ? 'text-orange-500' :
                                                    insight.type === 'error' ? 'text-red-500' :
                                                        'text-gray-500'
                                                }`}>
                                                <insight.icon />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white text-xs md:text-sm">{insight.title}</h4>
                                                <p className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400 mt-0.5 md:mt-1 leading-relaxed">{insight.text}</p>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center p-4 opacity-50">
                                            <p className="text-sm">No significant changes.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Monthly Budget Pulse (New Section to fill space) */}
                            <div className="col-span-1 md:col-span-2 bg-white dark:bg-base-200 rounded-xl md:rounded-[2rem] p-4 md:p-6 shadow-sm border border-gray-100 dark:border-base-300">
                                <h3 className="text-base md:text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <FaWallet className="text-blue-500" /> Monthly Budget Pulse
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="p-4 bg-gray-50 dark:bg-base-300 rounded-2xl border border-gray-100 dark:border-base-100 relative overflow-hidden">
                                        <div className="absolute right-0 top-0 p-3 opacity-5">
                                            <FaCalendarDay className="text-5xl" />
                                        </div>
                                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Daily Safe Spend</p>
                                        <p className="text-xl md:text-2xl font-black text-blue-600 dark:text-blue-400">
                                            BDT {currentStats.safeDailySpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </p>
                                        <p className="text-[10px] md:text-xs text-gray-400 mt-1">
                                            {selectedMonth === 'all' ? 'Avg. daily limit' : `For the next ${currentStats.daysRemaining} days`}
                                        </p>
                                    </div>

                                    <div className="p-4 bg-gray-50 dark:bg-base-300 rounded-2xl border border-gray-100 dark:border-base-100 relative overflow-hidden">
                                        <div className="absolute right-0 top-0 p-3 opacity-5">
                                            <FaThumbsUp className="text-5xl" />
                                        </div>
                                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Projected Savings</p>
                                        <p className={`text-xl md:text-2xl font-black ${currentStats.projectedSavings >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                                            BDT {currentStats.projectedSavings.toLocaleString()}
                                        </p>
                                        <p className="text-[10px] md:text-xs text-gray-400 mt-1">Based on current flow</p>
                                    </div>

                                    <div className="p-4 bg-gray-50 dark:bg-base-300 rounded-2xl border border-gray-100 dark:border-base-100 relative overflow-hidden">
                                        <div className="absolute right-0 top-0 p-3 opacity-5">
                                            <FaChartLine className="text-5xl" />
                                        </div>
                                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Spend Velocity</p>
                                        <p className="text-xl md:text-2xl font-black text-orange-500">
                                            {((currentStats.expenses / Math.max(1, currentStats.income)) * 100).toFixed(0)}%
                                        </p>
                                        <p className="text-[10px] md:text-xs text-gray-400 mt-1">Of total income used</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Right Column (Sidebar Widgets) - spans 4/12 on XL */}
                    <div className="xl:col-span-4 space-y-2 md:space-y-4">

                        {/* Debt & Claims (Receivable/Payable) */}
                        <div className="grid grid-cols-2 gap-2 md:gap-4">
                            <div className="bg-white dark:bg-base-200 rounded-xl md:rounded-[1.5rem] p-4 shadow-sm border border-gray-100 dark:border-base-300 relative overflow-hidden group">
                                <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <FaExclamationCircle className="text-4xl text-orange-500" />
                                </div>
                                <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">You Owe</p>
                                <p className="text-lg md:text-xl font-black text-orange-500">BDT {additionalStats.payable.toLocaleString()}</p>
                                <p className="text-[10px] text-gray-400 mt-1">Payable</p>
                            </div>
                            <div className="bg-white dark:bg-base-200 rounded-xl md:rounded-[1.5rem] p-4 shadow-sm border border-gray-100 dark:border-base-300 relative overflow-hidden group">
                                <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <FaCheckCircle className="text-4xl text-emerald-500" />
                                </div>
                                <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Owed to You</p>
                                <p className="text-lg md:text-xl font-black text-emerald-500">BDT {additionalStats.receivable.toLocaleString()}</p>
                                <p className="text-[10px] text-gray-400 mt-1">Receivable</p>
                            </div>
                        </div>

                        {/* Spending Distribution */}
                        <div className="bg-white dark:bg-base-200 rounded-xl md:rounded-[2rem] p-3 md:p-6 shadow-sm border border-gray-100 dark:border-base-300">
                            <div className="flex justify-between items-center mb-3 md:mb-4">
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Spending</h3>
                                <button className="text-[10px] md:text-xs font-bold text-primary-500 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full">DETAILS</button>
                            </div>

                            <div className="relative h-[250px] w-full flex justify-center ">
                                {pieData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={5}
                                                dataKey="value"
                                                cornerRadius={8}
                                                stroke="none"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center text-gray-400">No data</div>
                                )}
                                {/* Center Stat */}
                                {pieData.length > 0 && (
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                        <p className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">{pieData.length}</p>
                                        <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider">Categories</p>
                                    </div>
                                )}
                            </div>

                            {/* Styled List */}
                            <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {pieData.slice(0, 6).map((entry, index) => (
                                    <div key={entry.name} className="flex items-center justify-between px-2 rounded-xl md:rounded-2xl hover:bg-gray-50 dark:hover:bg-base-100 transition-colors group cursor-default">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}>
                                                <FaShoppingBag className="text-xs md:text-sm" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white text-xs md:text-sm capitalize">{entry.name}</p>
                                                <p className="text-[10px] md:text-xs text-gray-400">
                                                    {((entry.value / currentStats.expenses) * 100).toFixed(1)}%
                                                </p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-gray-900 dark:text-white text-xs md:text-sm">
                                            {entry.value.toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Transactions Mini-List */}
                        <div className="bg-white dark:bg-base-200 rounded-xl md:rounded-[2rem] p-3 md:p-6 shadow-sm border border-gray-100 dark:border-base-300">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                                <Link to="/dashboard/my-transactions" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-base-300 text-gray-400 hover:text-primary-500 hover:bg-primary-50 transition-colors">
                                    <FaArrowRight className="text-xs" />
                                </Link>
                            </div>

                            <div className="relative border-l-2 border-dashed border-gray-200 dark:border-gray-700 ml-2 py-1">
                                {recentTransactions.length > 0 ? recentTransactions.map((txn, i) => (
                                    <div key={txn._id || i} className="relative pl-6 group mb-3 last:mb-0">
                                        {/* Timeline Dot */}
                                        <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white dark:border-base-200 ${txn.type === 'income' ? 'bg-emerald-500' : 'bg-red-500'
                                            } group-hover:scale-125 transition-transform shadow-sm`}></div>

                                        <div className="flex justify-between items-start">
                                            <div className='flex flex-col '>
                                                <p className="font-bold text-gray-900 dark:text-white text-xs md:text-sm capitalize">{txn.category}</p>
                                                <p className="text-[10px] md:text-xs text-gray-500">{new Date(txn.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                                            </div>
                                            <span className={`text-xs md:text-sm font-bold ${txn.type === 'income' ? 'text-emerald-500' : 'text-gray-900 dark:text-white'}`}>
                                                {txn.type === 'income' ? '+' : '-'} {txn.amount.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="pl-8 text-sm text-gray-400">No recent transactions.</p>
                                )}
                            </div>
                        </div>



                    </div>

                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
