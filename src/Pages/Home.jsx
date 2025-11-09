import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/firebase.init';
import { Link } from 'react-router';
import { useTheme } from '../contexts/ThemeContext';

const Home = () => {
    const [user] = useAuthState(auth);
    const [transactions, setTransactions] = useState([]);
    const { isDark } = useTheme();
    
    // Mock data - replace with Firebase data
    const mockTransactions = [
        { id: 1, type: 'expense', category: 'Food', amount: 250, date: '2024-01-15', description: 'Groceries' },
        { id: 2, type: 'income', category: 'Salary', amount: 3000, date: '2024-01-01', description: 'Monthly salary' },
        { id: 3, type: 'expense', category: 'Transport', amount: 120, date: '2024-01-10', description: 'Gas' },
        { id: 4, type: 'expense', category: 'Entertainment', amount: 80, date: '2024-01-12', description: 'Movie tickets' }
    ];

    useEffect(() => {
        setTransactions(mockTransactions);
    }, []);

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;

    return (
        <div className="min-h-screen bg-base-200">
            {/* Banner Section */}
            <div className="bg-linear-to-r from-cyan-600 to-blue-700 py-20">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h1 className="text-5xl font-bold text-white mb-4">Take Control of Your Finances</h1>
                    <p className="text-xl text-cyan-100 mb-8">Track, manage, and grow your wealth with FinEase - your personal finance companion</p>
                    <Link to="/add-transaction" className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105">
                        Start Managing Your Money
                    </Link>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Overview Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-center text-base-content">Financial Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-linear-to-r from-green-500 to-green-600 rounded-xl p-8 text-white text-center">
                            <h3 className="text-xl font-semibold mb-3">Total Income</h3>
                            <p className="text-4xl font-bold">${totalIncome.toLocaleString()}</p>
                        </div>
                        <div className="bg-linear-to-r from-red-500 to-red-600 rounded-xl p-8 text-white text-center">
                            <h3 className="text-xl font-semibold mb-3">Total Expenses</h3>
                            <p className="text-4xl font-bold">${totalExpenses.toLocaleString()}</p>
                        </div>
                        <div className="bg-linear-to-r from-blue-500 to-blue-600 rounded-xl p-8 text-white text-center">
                            <h3 className="text-xl font-semibold mb-3">Current Balance</h3>
                            <p className="text-4xl font-bold">${balance.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Static Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Budgeting Tips */}
                    <div className="bg-base-100 rounded-xl p-8 shadow-lg">
                        <h2 className="text-2xl font-bold mb-6 text-base-content">Budgeting Tips</h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <span className="text-primary text-xl">💡</span>
                                <p className="text-base-content/70">Follow the 50/30/20 rule: 50% needs, 30% wants, 20% savings</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-primary text-xl">📊</span>
                                <p className="text-base-content/70">Track every expense to identify spending patterns</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-primary text-xl">🎯</span>
                                <p className="text-base-content/70">Set realistic monthly budgets for each category</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-primary text-xl">🔄</span>
                                <p className="text-base-content/70">Review and adjust your budget monthly</p>
                            </div>
                        </div>
                    </div>

                    {/* Why Financial Planning Matters */}
                    <div className="bg-base-100 rounded-xl p-8 shadow-lg">
                        <h2 className="text-2xl font-bold mb-6 text-base-content">Why Financial Planning Matters</h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <span className="text-success text-xl">🛡️</span>
                                <p className="text-base-content/70">Build an emergency fund for unexpected expenses</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-success text-xl">📈</span>
                                <p className="text-base-content/70">Achieve long-term financial goals and dreams</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-success text-xl">😌</span>
                                <p className="text-base-content/70">Reduce financial stress and anxiety</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-success text-xl">🏠</span>
                                <p className="text-base-content/70">Prepare for major life events and purchases</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;