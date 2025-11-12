import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/firebase.init';
import { Link } from 'react-router';
import toast from 'react-hot-toast';
import LoadingSpinner from '../Components/LoadingSpinner';
import { getTransactions, deleteTransaction } from '../api/transactions';
import Swal from 'sweetalert2';

const MyTransaction = () => {
    const [user, authLoading] = useAuthState(auth);
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!authLoading && user) {
            fetchUserTransactions();
        }
    }, [authLoading, user]);

    const fetchUserTransactions = async () => {
        try {
            setDataLoading(true);
            const data = await getTransactions(user.email);
            setTransactions(data);
            setFilteredTransactions(data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            toast.error('Failed to load transactions');
        } finally {
            setDataLoading(false);
        }
    };

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

    const handleDeleteTransaction = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f97316',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await deleteTransaction(id);
                setTransactions(prev => prev.filter(t => t._id !== id));
                
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Transaction has been deleted.',
                    icon: 'success',
                    confirmButtonColor: '#f97316'
                });
            } catch (error) {
                console.error('Error deleting transaction:', error);
                
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete transaction',
                    icon: 'error',
                    confirmButtonColor: '#f97316'
                });
            }
        }
    };

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;

    if (authLoading || dataLoading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-base-100 pt-20 p-4">
            <div className="max-w-[1220px] mx-auto">
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
                                <div key={transaction._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
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
                                                onClick={() => handleDeleteTransaction(transaction._id)}
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