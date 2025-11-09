import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/firebase.init';
import { Link } from 'react-router';
import toast from 'react-hot-toast';
import LoadingSpinner from '../Components/LoadingSpinner';

const MyTransaction = () => {
    const [user, authLoading] = useAuthState(auth);
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data - replace with Firebase data
    const mockTransactions = [
        { id: 1, type: 'expense', category: 'Food & Dining', amount: 250, date: '2024-01-15', description: 'Groceries at Walmart' },
        { id: 2, type: 'income', category: 'Salary', amount: 3000, date: '2024-01-01', description: 'Monthly salary' },
        { id: 3, type: 'expense', category: 'Transportation', amount: 120, date: '2024-01-10', description: 'Gas station' },
        { id: 4, type: 'expense', category: 'Entertainment', amount: 80, date: '2024-01-12', description: 'Movie tickets' },
        { id: 5, type: 'income', category: 'Freelance', amount: 500, date: '2024-01-08', description: 'Web design project' },
        { id: 6, type: 'expense', category: 'Bills & Utilities', amount: 200, date: '2024-01-05', description: 'Electricity bill' },
        { id: 7, type: 'expense', category: 'Shopping', amount: 150, date: '2024-01-14', description: 'Clothing' },
        { id: 8, type: 'income', category: 'Investment', amount: 75, date: '2024-01-11', description: 'Dividend payment' }
    ];

    useEffect(() => {
        if (!authLoading) {
            setTimeout(() => {
                setTransactions(mockTransactions);
                setFilteredTransactions(mockTransactions);
                setDataLoading(false);
            }, 600);
        }
    }, [authLoading]);

    useEffect(() => {
        let filtered = transactions;

        // Filter by type
        if (filter !== 'all') {
            filtered = filtered.filter(t => t.type === filter);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(t => 
                t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort transactions
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return new Date(b.date) - new Date(a.date);
                case 'amount':
                    return b.amount - a.amount;
                case 'category':
                    return a.category.localeCompare(b.category);
                default:
                    return 0;
            }
        });

        setFilteredTransactions(filtered);
    }, [transactions, filter, sortBy, searchTerm]);

    const handleDeleteTransaction = (id) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <p className="font-medium">Delete this transaction?</p>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setTransactions(prev => prev.filter(t => t.id !== id));
                            toast.success('Transaction deleted successfully!');
                            toast.dismiss(t.id);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: 10000,
        });
    };

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;

    if (authLoading || dataLoading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 section-padding">
            <div className="container-max">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                    <div className="fade-in">
                        <h1 className="heading-primary text-white mb-2">My Transactions</h1>
                        <p className="text-body text-gray-300">Manage your financial transactions</p>
                    </div>
                    <Link 
                        to="/add-transaction"
                        className="btn-primary"
                    >
                        + Add Transaction
                    </Link>
                </div>

                {/* Summary Cards */}
                <div className="grid-responsive mb-12 slide-up">
                    <div className="bg-success-gradient rounded-xl p-6 text-white text-center card-equal hover-glow">
                        <h3 className="heading-tertiary mb-3">Total Income</h3>
                        <p className="text-3xl font-bold">${totalIncome.toLocaleString()}</p>
                    </div>
                    <div className="bg-danger-gradient rounded-xl p-6 text-white text-center card-equal hover-glow">
                        <h3 className="heading-tertiary mb-3">Total Expenses</h3>
                        <p className="text-3xl font-bold">${totalExpenses.toLocaleString()}</p>
                    </div>
                    <div className="bg-primary-gradient rounded-xl p-6 text-white text-center card-equal hover-glow">
                        <h3 className="heading-tertiary mb-3">Net Balance</h3>
                        <p className="text-3xl font-bold">${balance.toLocaleString()}</p>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="card-glass p-6 mb-8 slide-up">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Search */}
                        <div>
                            <label className="form-label">Search</label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search transactions..."
                                className="form-input"
                            />
                        </div>

                        {/* Filter by Type */}
                        <div>
                            <label className="form-label">Filter by Type</label>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="form-select"
                            >
                                <option value="all" className="bg-gray-800">All Transactions</option>
                                <option value="income" className="bg-gray-800">Income Only</option>
                                <option value="expense" className="bg-gray-800">Expenses Only</option>
                            </select>
                        </div>

                        {/* Sort by */}
                        <div>
                            <label className="form-label">Sort by</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="form-select"
                            >
                                <option value="date" className="bg-gray-800">Date (Newest First)</option>
                                <option value="amount" className="bg-gray-800">Amount (Highest First)</option>
                                <option value="category" className="bg-gray-800">Category (A-Z)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Transactions List */}
                <div className="card-glass overflow-hidden slide-up">
                    <div className="p-6">
                        <h3 className="heading-tertiary text-white mb-4">
                            Transactions ({filteredTransactions.length})
                        </h3>
                    </div>
                    
                    {filteredTransactions.length === 0 ? (
                        <div className="p-8 text-center content-spacing">
                            <p className="text-body text-gray-400">No transactions found</p>
                            <Link 
                                to="/add-transaction"
                                className="btn-primary inline-block"
                            >
                                Add Your First Transaction
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/10">
                            {filteredTransactions.map(transaction => (
                                <div key={transaction.id} className="p-6 hover:bg-white/5 transition-all duration-300 hover-lift">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    transaction.type === 'income' 
                                                        ? 'bg-green-500/20 text-green-400' 
                                                        : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                    {transaction.type.toUpperCase()}
                                                </span>
                                                <span className="text-gray-400 text-sm">{transaction.category}</span>
                                            </div>
                                            <h4 className="text-white font-semibold text-lg mb-1">{transaction.description}</h4>
                                            <p className="text-small text-gray-400">{transaction.date}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`text-2xl font-bold ${
                                                transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                                            </span>
                                            <button
                                                onClick={() => handleDeleteTransaction(transaction.id)}
                                                className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/20 rounded-lg transition-all duration-300 hover-lift"
                                                title="Delete transaction"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyTransaction;