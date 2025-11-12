import React, { useState, useEffect, useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/firebase.init';
import { Link, useLocation } from 'react-router';
import toast from 'react-hot-toast';
import LoadingSpinner from '../Components/LoadingSpinner';
import { getTransactions, deleteTransaction, updateTransaction, getCategories } from '../api/transactions';
import { FaEdit, FaTrash, FaEye, FaCalendarAlt, FaTag, FaDollarSign, FaTimes, FaSave } from 'react-icons/fa';
import Swal from 'sweetalert2';

const MyTransaction = () => {
    const [user, authLoading] = useAuthState(auth);
    const location = useLocation();
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [searchTerm, setSearchTerm] = useState('');
    const [editModal, setEditModal] = useState({ isOpen: false, transaction: null });
    const [categories, setCategories] = useState([]);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        document.title = 'My Transactions - Finance Management';
        if (!authLoading && user) {
            fetchUserTransactions();
            fetchCategories();
        }
    }, [authLoading, user, fetchUserTransactions, fetchCategories]);

    useEffect(() => {
        if (location.state?.editTransaction) {
            const transaction = location.state.editTransaction;
            setEditForm({
                type: transaction.type,
                category: transaction.category,
                amount: transaction.amount,
                description: transaction.description,
                date: transaction.date
            });
            setEditModal({ isOpen: true, transaction });
        }
    }, [location.state]);

    const fetchUserTransactions = useCallback(async () => {
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
    }, [user]);

    const fetchCategories = useCallback(async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }, []);

    const handleEditClick = (transaction) => {
        setEditForm({
            type: transaction.type,
            category: transaction.category,
            amount: transaction.amount,
            description: transaction.description,
            date: transaction.date
        });
        setEditModal({ isOpen: true, transaction });
    };

    const handleEditSave = async () => {
        try {
            await updateTransaction(editModal.transaction._id, editForm);
            
            const updatedTransactions = transactions.map(t => 
                t._id === editModal.transaction._id ? { ...t, ...editForm } : t
            );
            setTransactions(updatedTransactions);
            
            setEditModal({ isOpen: false, transaction: null });
            
            Swal.fire({
                title: 'Updated!',
                text: 'Transaction has been updated.',
                icon: 'success',
                confirmButtonColor: '#f97316'
            });
        } catch (error) {
            console.error('Error updating transaction:', error);
            
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update transaction',
                icon: 'error',
                confirmButtonColor: '#f97316'
            });
        }
    };

    useEffect(() => {
        let filtered = transactions;

        if (filter !== 'all') {
            filtered = filtered.filter(t => t.type === filter);
        }

        if (searchTerm) {
            filtered = filtered.filter(t => 
                t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

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

                {/* Transactions Cards */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-base-content mb-6">
                        Transactions ({filteredTransactions.length})
                    </h3>
                    
                    {filteredTransactions.length === 0 ? (
                        <div className="bg-white dark:bg-base-200 rounded-xl p-8 text-center shadow-lg border border-gray-100 dark:border-base-300">
                            <p className="text-base-content/70 mb-4">No transactions found</p>
                            <Link 
                                to="/add-transaction"
                                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors inline-block"
                            >
                                Add Your First Transaction
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTransactions.map(transaction => (
                                <div key={transaction._id} className="bg-white dark:bg-base-200 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-base-300 hover:shadow-xl transition-shadow">
                                    {/* Transaction Type Badge */}
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            transaction.type === 'income' 
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                        }`}>
                                            {transaction.type.toUpperCase()}
                                        </span>
                                        <span className={`text-2xl font-bold ${
                                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                                        </span>
                                    </div>

                                    {/* Transaction Details */}
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-2 text-base-content/70">
                                            <FaTag className="text-orange-500" />
                                            <span className="font-medium">{transaction.category}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-base-content/70">
                                            <FaCalendarAlt className="text-orange-500" />
                                            <span>{new Date(transaction.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="text-base-content">
                                            <p className="font-semibold mb-1">{transaction.description}</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/transaction/${transaction._id}`}
                                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                                        >
                                            <FaEye /> View
                                        </Link>
                                        <button
                                            onClick={() => handleEditClick(transaction)}
                                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                                        >
                                            <FaEdit /> Update
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTransaction(transaction._id)}
                                            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Edit Modal */}
                {editModal.isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-base-200 rounded-xl p-6 w-full max-w-md">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-base-content">Edit Transaction</h3>
                                <button
                                    onClick={() => setEditModal({ isOpen: false, transaction: null })}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-2">Type</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="editType"
                                                value="expense"
                                                checked={editForm.type === 'expense'}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value }))}
                                                className="radio radio-error"
                                            />
                                            <span className="text-red-600">Expense</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="editType"
                                                value="income"
                                                checked={editForm.type === 'income'}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value }))}
                                                className="radio radio-success"
                                            />
                                            <span className="text-green-600">Income</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-2">Amount</label>
                                    <input
                                        type="number"
                                        value={editForm.amount}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-2">Category</label>
                                    <select
                                        value={editForm.category}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                                    >
                                        {categories
                                            .filter(cat => cat.type === editForm.type)
                                            .map(category => (
                                                <option key={category._id} value={category.name.toLowerCase()}>
                                                    {category.name}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-2">Date</label>
                                    <input
                                        type="date"
                                        value={editForm.date}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-2">Description</label>
                                    <textarea
                                        value={editForm.description}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none resize-none"
                                        rows="3"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={handleEditSave}
                                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaSave /> Save Changes
                                    </button>
                                    <button
                                        onClick={() => setEditModal({ isOpen: false, transaction: null })}
                                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyTransaction;