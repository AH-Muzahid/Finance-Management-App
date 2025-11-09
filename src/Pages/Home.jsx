import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/firebase.init';
import { Link } from 'react-router';
import { useTheme } from '../contexts/ThemeContext';
import { FaPlus } from 'react-icons/fa';
import LoadingSpinner from '../Components/LoadingSpinner';

const Home = () => {
    const [user, authLoading] = useAuthState(auth);
    const [transactions, setTransactions] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const { isDark } = useTheme();
    
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
        <div className="min-h-screen bg-base-200">
            {/* Banner Section */}
            <div className="bg-primary-gradient section-padding">
                <div className="container-max text-center fade-in">
                    <h1 className="heading-primary text-white mb-6">Take Control of Your Finances</h1>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">Track, manage, and grow your wealth with FinEase - your personal finance companion</p>
                    <Link to="/add-transaction" className="btn-secondary hover-lift">
                        Start Managing Your Money
                    </Link>
                </div>
            </div>

            <div className="container-max section-padding">
                {/* Overview Section */}
                <div className="content-spacing-lg">
                    <h2 className="heading-secondary text-center text-base-content mb-12 slide-up">Financial Overview</h2>
                    <div className="grid-responsive slide-up">
                        <div className="bg-success-gradient rounded-xl p-8 text-white text-center card-equal hover-glow">
                            <h3 className="heading-tertiary mb-4">Total Income</h3>
                            <p className="text-4xl font-bold">${totalIncome.toLocaleString()}</p>
                        </div>
                        <div className="bg-danger-gradient rounded-xl p-8 text-white text-center card-equal hover-glow">
                            <h3 className="heading-tertiary mb-4">Total Expenses</h3>
                            <p className="text-4xl font-bold">${totalExpenses.toLocaleString()}</p>
                        </div>
                        <div className="bg-primary-gradient rounded-xl p-8 text-white text-center card-equal hover-glow">
                            <h3 className="heading-tertiary mb-4">Current Balance</h3>
                            <p className="text-4xl font-bold">${balance.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Static Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 content-spacing mt-10 md:mt-5">
                    {/* Budgeting Tips */}
                    <div className="card-base p-8 card-equal hover-glow slide-up">
                        <h2 className="heading-secondary mb-6 text-base-content">Budgeting Tips</h2>
                        <div className="content-spacing">
                            <div className="flex items-start gap-4">
                                <span className="text-primary text-2xl">💡</span>
                                <p className="text-body text-base-content/80">Follow the 50/30/20 rule: 50% needs, 30% wants, 20% savings</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <span className="text-primary text-2xl">📊</span>
                                <p className="text-body text-base-content/80">Track every expense to identify spending patterns</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <span className="text-primary text-2xl">🎯</span>
                                <p className="text-body text-base-content/80">Set realistic monthly budgets for each category</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <span className="text-primary text-2xl">🔄</span>
                                <p className="text-body text-base-content/80">Review and adjust your budget monthly</p>
                            </div>
                        </div>
                    </div>

                    {/* Why Financial Planning Matters */}
                    <div className="card-base p-8 card-equal hover-glow slide-up">
                        <h2 className="heading-secondary mb-6 text-base-content">Why Financial Planning Matters</h2>
                        <div className="content-spacing">
                            <div className="flex items-start gap-4">
                                <span className="text-success text-2xl">🛡️</span>
                                <p className="text-body text-base-content/80">Build an emergency fund for unexpected expenses</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <span className="text-success text-2xl">📈</span>
                                <p className="text-body text-base-content/80">Achieve long-term financial goals and dreams</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <span className="text-success text-2xl">😌</span>
                                <p className="text-body text-base-content/80">Reduce financial stress and anxiety</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <span className="text-success text-2xl">🏠</span>
                                <p className="text-body text-base-content/80">Prepare for major life events and purchases</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* FAB Button */}
            {user && (
                <Link 
                    to="/add-transaction"
                    className="md:hidden fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg flex items-center justify-center bg-primary-gradient hover-lift z-40"
                >
                    <FaPlus className="text-white text-xl" />
                </Link>
            )}
        </div>
    );
};

export default Home;