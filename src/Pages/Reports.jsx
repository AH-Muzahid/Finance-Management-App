import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/firebase.init';

const Reports = () => {
    const [user] = useAuthState(auth);
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

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Financial Reports</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Expense Categories */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4">Expenses by Category</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Monthly Trends */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4">Monthly Trends</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} />
                                <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Income vs Expenses Bar Chart */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Income vs Expenses Comparison</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="income" fill="#10B981" />
                            <Bar dataKey="expenses" fill="#EF4444" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Reports;