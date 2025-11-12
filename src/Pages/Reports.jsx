import React, { useState, useEffect, useCallback } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/firebase.init';
import LoadingSpinner from '../Components/LoadingSpinner';
import { getTransactions } from '../api/transactions';

const Reports = () => {
    const [user, authLoading] = useAuthState(auth);
    const [dataLoading, setDataLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);

    const expensesByCategory = transactions
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
    const monthlyData = generateMonthlyData(transactions);

    function generateMonthlyData(transactions) {
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
    }

    const COLORS = ['#f97316', '#10B981', '#EF4444', '#3B82F6', '#8B5CF6'];

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
        if (!authLoading && user) {
            fetchUserTransactions();
        } else if (!authLoading && !user) {
            setDataLoading(false);
        }
    }, [authLoading, user, fetchUserTransactions]);

    if (authLoading || dataLoading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-base-100 pt-20 p-4">
            <div className="max-w-[1220px] mx-auto">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-2xl">R</span>
                    </div>
                    <h1 className="text-3xl font-bold text-base-content mb-2">Financial Reports</h1>
                    <p className="text-base-content/70">Analyze your financial data</p>
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

                    {/* Monthly Trends */}
                    <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-6">
                        <h3 className="text-lg font-semibold text-base-content mb-6">Monthly Trends</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyData}>
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
                                <Line 
                                    type="monotone" 
                                    dataKey="income" 
                                    stroke="#10B981" 
                                    strokeWidth={3}
                                    dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                                    activeDot={{ r: 8, fill: '#10B981' }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="expenses" 
                                    stroke="#EF4444" 
                                    strokeWidth={3}
                                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 6 }}
                                    activeDot={{ r: 8, fill: '#EF4444' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Income vs Expenses Bar Chart */}
                <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-6">
                    <h3 className="text-lg font-semibold text-base-content mb-6">Income vs Expenses Comparison</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={monthlyData} barCategoryGap={20}>
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
                            <Bar 
                                dataKey="income" 
                                fill="#10B981" 
                                radius={[4, 4, 0, 0]}
                                stroke="#ffffff"
                                strokeWidth={1}
                            />
                            <Bar 
                                dataKey="expenses" 
                                fill="#EF4444" 
                                radius={[4, 4, 0, 0]}
                                stroke="#ffffff"
                                strokeWidth={1}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Reports;