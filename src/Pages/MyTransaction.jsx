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
        <div className="min-h-screen bg-gray-50 dark:bg-base-100 pt-20 p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-base-content mb-2">My Transactions</h1>
                        <p className="text-base-content/70">Manage your financial transactions</p>
                    </div>
                    <Link 
                        to="/add-transaction"
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                        + Add Transaction
                    </Link>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-base-200 rounded-xl p-6 text-center shadow-lg border border-gray-100 dark:border-base-300">
                        <h3 className="text-lg font-semibold text-base-content mb-3">Total Income</h3>
                        <p className="text-3xl font-bold text-green-600">${totalIncome.toLocaleString()}</p>
                    </div>
                    <div className="bg-white dark:bg-base-200 rounded-xl p-6 text-center shadow-lg border border-gray-100 dark:border-base-300">
                        <h3 className="text-lg font-semibold text-base-content mb-3">Total Expenses</h3>
                        <p className="text-3xl font-bold text-red-600">${totalExpenses.toLocaleString()}</p>
                    </div>
                    <div className="bg-white dark:bg-base-200 rounded-xl p-6 text-center shadow-lg border border-gray-100 dark:border-base-300">
                        <h3 className="text-lg font-semibold text-base-content mb-3">Net Balance</h3>
                        <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>${balance.toLocaleString()}</p>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white dark:bg-base-200 rounded-xl p-6 mb-8 shadow-lg border border-gray-100 dark:border-base-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-base-content mb-2">Search</label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search transactions..."
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-black dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all"
                            />
                        </div>

                        {/* Filter by Type */}
                        <div>
                            <label className="block text-sm font-medium text-base-content mb-2">Filter by Type</label>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all"
                            >
                                <option value="all">All Transactions</option>
                                <option value="income">Income Only</option>
                                <option value="expense">Expenses Only</option>
                            </select>
                        </div>

                        {/* Sort by */}
                        <div>
                            <label className="block text-sm font-medium text-base-content mb-2">Sort by</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all"
                            >
                                <option value="date">Date (Newest First)</option>
                                <option value="amount">Amount (Highest First)</option>
                                <option value="category">Category (A-Z)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Transactions List */}
                <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-base-content mb-4">
                            Transactions ({filteredTransactions.length})
                        </h3>
                    </div>
                    
                    {filteredTransactions.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-base-content/70 mb-4">No transactions found</p>
                            <Link 
                                to="/add-transaction"
                                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors inline-block"
                            >
                                Add Your First Transaction
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredTransactions.map(transaction => (
                                <div key={transaction.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    transaction.type === 'income' 
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                }`}>
                                                    {transaction.type.toUpperCase()}
                                                </span>
                                                <span className="text-base-content/70 text-sm">{transaction.category}</span>
                                            </div>
                                            <h4 className="text-base-content font-semibold text-lg mb-1">{transaction.description}</h4>
                                            <p className="text-sm text-base-content/70">{transaction.date}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`text-2xl font-bold ${
                                                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                                            </span>
                                            <button
                                                onClick={() => handleDeleteTransaction(transaction.id)}
                                                className="text-red-500 hover:text-red-600 p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
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