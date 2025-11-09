import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/firebase.init';
import LoadingSpinner from '../Components/LoadingSpinner';

const Reports = () => {
    const [user, authLoading] = useAuthState(auth);
    const [dataLoading, setDataLoading] = useState(true);
    const [transactions] = useState([
        { id: 1, type: 'expense', category: 'Food & Dining', amount: 250, date: '2024-01-15' },
        { id: 2, type: 'income', category: 'Salary', amount: 3000, date: '2024-01-01' },
        { id: 3, type: 'expense', category: 'Transportation', amount: 120, date: '2024-01-10' },
        { id: 4, type: 'expense', category: 'Entertainment', amount: 80, date: '2024-01-12' },
        { id: 5, type: 'income', category: 'Freelance', amount: 500, date: '2024-01-08' },
        { id: 6, type: 'expense', category: 'Bills & Utilities', amount: 200, date: '2024-01-05' }
    ]);

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

    const monthlyData = [
        { month: 'Jan', income: 3500, expenses: 650 },
        { month: 'Feb', income: 3200, expenses: 800 },
        { month: 'Mar', income: 2800, expenses: 750 },
        { month: 'Apr', income: 3500, expenses: 900 }
    ];

    const COLORS = ['#f97316', '#10B981', '#EF4444', '#3B82F6', '#8B5CF6'];

    useEffect(() => {
        if (!authLoading) {
            setTimeout(() => {
                setDataLoading(false);
            }, 800);
        }
    }, [authLoading]);

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