import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/firebase.init';
import { Link } from 'react-router';
import toast from 'react-hot-toast';

const MyTransaction = () => {
    const [user] = useAuthState(auth);
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
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
        setTransactions(mockTransactions);
        setFilteredTransactions(mockTransactions);
    }, []);

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
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            setTransactions(prev => prev.filter(t => t.id !== id));
            toast.success('Transaction deleted successfully!');
        }
    };

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">My Transactions</h1>
                        <p className="text-gray-300">Manage your financial transactions</p>
                    </div>
                    <Link 
                        to="/add-transaction"
                        className="bg-linear-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all transform hover:scale-105"
                    >
                        + Add Transaction
                    </Link>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-linear-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                        <h3 className="text-lg font-semibold mb-2">Total Income</h3>
                        <p className="text-2xl font-bold">${totalIncome.toLocaleString()}</p>
                    </div>
                    <div className="bg-linear-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
                        <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
                        <p className="text-2xl font-bold">${totalExpenses.toLocaleString()}</p>
                    </div>
                    <div className="bg-linear-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                        <h3 className="text-lg font-semibold mb-2">Net Balance</h3>
                        <p className="text-2xl font-bold">${balance.toLocaleString()}</p>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-white font-semibold mb-2">Search</label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search transactions..."
                                className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            />
                        </div>

                        {/* Filter by Type */}
                        <div>
                            <label className="block text-white font-semibold mb-2">Filter by Type</label>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            >
                                <option value="all" className="bg-gray-800">All Transactions</option>
                                <option value="income" className="bg-gray-800">Income Only</option>
                                <option value="expense" className="bg-gray-800">Expenses Only</option>
                            </select>
                        </div>

                        {/* Sort by */}
                        <div>
                            <label className="block text-white font-semibold mb-2">Sort by</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            >
                                <option value="date" className="bg-gray-800">Date (Newest First)</option>
                                <option value="amount" className="bg-gray-800">Amount (Highest First)</option>
                                <option value="category" className="bg-gray-800">Category (A-Z)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Transactions List */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-4">
                            Transactions ({filteredTransactions.length})
                        </h3>
                    </div>
                    
                    {filteredTransactions.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-400 text-lg">No transactions found</p>
                            <Link 
                                to="/add-transaction"
                                className="inline-block mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all"
                            >
                                Add Your First Transaction
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/10">
                            {filteredTransactions.map(transaction => (
                                <div key={transaction.id} className="p-6 hover:bg-white/5 transition-colors">
                                    <div className="flex justify-between items-center">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    transaction.type === 'income' 
                                                        ? 'bg-green-500/20 text-green-400' 
                                                        : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                    {transaction.type.toUpperCase()}
                                                </span>
                                                <span className="text-gray-400 text-sm">{transaction.category}</span>
                                            </div>
                                            <h4 className="text-white font-semibold text-lg">{transaction.description}</h4>
                                            <p className="text-gray-400 text-sm">{transaction.date}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`text-2xl font-bold ${
                                                transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                                            </span>
                                            <button
                                                onClick={() => handleDeleteTransaction(transaction.id)}
                                                className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/20 rounded-lg transition-all"
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