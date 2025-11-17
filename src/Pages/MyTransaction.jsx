import React, { useState, useEffect, useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/firebase.init';
import { Link, useLocation, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import LoadingSpinner from '../Components/LoadingSpinner';
import { getTransactions, deleteTransaction, updateTransaction, getCategories } from '../api/transactions';
import { FaEdit, FaTrash, FaEye, FaCalendarAlt, FaTag, FaDollarSign, FaTimes, FaSave, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import Swal from 'sweetalert2';

const MyTransaction = () => {
    const [user, authLoading] = useAuthState(auth);
    const location = useLocation();
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState(''); // Date filter state
    const [editModal, setEditModal] = useState({ isOpen: false, transaction: null });
    const [categories, setCategories] = useState([]);
    const [editForm, setEditForm] = useState({});
    const [paidModal, setPaidModal] = useState({ isOpen: false, transaction: null }); // Paid status modal

    const fetchUserTransactions = useCallback(async () => {
        try {
            setDataLoading(true);
            const data = await getTransactions(user.email, sortBy, sortOrder);
            setTransactions(data);
            setFilteredTransactions(data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            toast.error('Failed to load transactions');
        } finally {
            setDataLoading(false);
        }
    }, [user, sortBy, sortOrder]);

    const fetchCategories = useCallback(async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }, []);

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
                date: transaction.date,
                personName: transaction.personName || ''
            });
            setEditModal({ isOpen: true, transaction });
        }
    }, [location.state]);

    const handleEditClick = (transaction) => {
        setEditForm({
            type: transaction.type,
            category: transaction.category,
            amount: transaction.amount,
            description: transaction.description,
            date: transaction.date,
            personName: transaction.personName || ''
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
            }).then(() => {
                navigate(`/transaction/${editModal.transaction._id}`);
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
                t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (t.personName && t.personName.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Date filter
        if (selectedDate) {
            filtered = filtered.filter(t => {
                const transactionDate = new Date(t.date).toISOString().split('T')[0];
                return transactionDate === selectedDate;
            });
        }

        // Backend sorting is already applied, no need to sort again
        setFilteredTransactions(filtered);
    }, [transactions, filter, searchTerm, selectedDate]);

    // Refetch data when sort changes
    useEffect(() => {
        if (user) {
            fetchUserTransactions();
        }
    }, [sortBy, sortOrder, fetchUserTransactions, user]);

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

    const handleMarkAsPaid = (transaction) => {
        setPaidModal({ isOpen: true, transaction });
    };

    const handlePaidDecision = async (shouldDelete) => {
        try {
            const transaction = paidModal.transaction;
            
            if (shouldDelete) {
                // Delete the transaction
                await deleteTransaction(transaction._id);
                setTransactions(prev => prev.filter(t => t._id !== transaction._id));
                
                Swal.fire({
                    title: 'Deleted!',
                    text: `${transaction.type === 'receivable' ? 'Receivable' : 'Payable'} transaction has been deleted.`,
                    icon: 'success',
                    confirmButtonColor: '#f97316'
                });
            } else {
                // Convert to income/expense based on type
                let updatedData = { ...transaction, isPaid: true };
                
                if (transaction.type === 'receivable') {
                    // Receivable paid = I received money = Income
                    updatedData.type = 'income';
                } else if (transaction.type === 'payable') {
                    // Payable paid = I gave money = Expense
                    updatedData.type = 'expense';
                }
                
                await updateTransaction(transaction._id, updatedData);
                
                const updatedTransactions = transactions.map(t =>
                    t._id === transaction._id ? updatedData : t
                );
                setTransactions(updatedTransactions);
                
                const typeLabel = transaction.type === 'receivable' 
                    ? 'Receivable converted to Income' 
                    : 'Payable converted to Expense';
                
                Swal.fire({
                    title: 'Payment Recorded!',
                    text: typeLabel,
                    icon: 'success',
                    confirmButtonColor: '#f97316'
                });
            }
            
            setPaidModal({ isOpen: false, transaction: null });
        } catch (error) {
            console.error('Error updating transaction status:', error);
            
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update transaction',
                icon: 'error',
                confirmButtonColor: '#f97316'
            });
        }
    };

    const handleRevertPaidFromModal = async () => {
        try {
            const transaction = paidModal.transaction;
            
            let updatedData = { ...transaction, isPaid: false };
            
            // Convert back to receivable/payable based on current type
            if (transaction.type === 'income' && transaction.personName) {
                // Income with personName = came from Receivable, so revert to Receivable
                updatedData.type = 'receivable';
            } else if (transaction.type === 'expense' && transaction.personName) {
                // Expense with personName = came from Payable, so revert to Payable
                updatedData.type = 'payable';
            }
            
            await updateTransaction(transaction._id, updatedData);
            
            const updatedTransactions = transactions.map(t =>
                t._id === transaction._id ? updatedData : t
            );
            setTransactions(updatedTransactions);
            
            Swal.fire({
                title: 'Reverted!',
                text: 'Transaction marked as unpaid.',
                icon: 'success',
                confirmButtonColor: '#f97316'
            });
            
            setPaidModal({ isOpen: false, transaction: null });
        } catch (error) {
            console.error('Error reverting paid status:', error);
            
            Swal.fire({
                title: 'Error!',
                text: 'Failed to revert payment status',
                icon: 'error',
                confirmButtonColor: '#f97316'
            });
        }
    };

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const totalReceivable = transactions.filter(t => t.type === 'receivable').reduce((sum, t) => sum + t.amount, 0);
    const totalPayable = transactions.filter(t => t.type === 'payable').reduce((sum, t) => sum + t.amount, 0);
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    <div className="bg-white dark:bg-base-200 rounded-xl p-6 text-center shadow-lg border border-gray-100 dark:border-base-300">
                        <h3 className="text-base font-semibold text-base-content mb-2">Total Income</h3>
                        <p className="text-2xl font-bold text-green-600">BDT {totalIncome.toLocaleString()}</p>
                    </div>
                    <div className="bg-white dark:bg-base-200 rounded-xl p-6 text-center shadow-lg border border-gray-100 dark:border-base-300">
                        <h3 className="text-base font-semibold text-base-content mb-2">Total Expenses</h3>
                        <p className="text-2xl font-bold text-red-600">BDT {totalExpenses.toLocaleString()}</p>
                    </div>
                    <div className="bg-white dark:bg-base-200 rounded-xl p-6 text-center shadow-lg border border-gray-100 dark:border-base-300">
                        <h3 className="text-base font-semibold text-base-content mb-2">Receivable</h3>
                        <p className="text-2xl font-bold text-blue-600">BDT {totalReceivable.toLocaleString()}</p>
                    </div>
                    <div className="bg-white dark:bg-base-200 rounded-xl p-6 text-center shadow-lg border border-gray-100 dark:border-base-300">
                        <h3 className="text-base font-semibold text-base-content mb-2">Payable</h3>
                        <p className="text-2xl font-bold text-orange-600">BDT {totalPayable.toLocaleString()}</p>
                    </div>
                    <div className="bg-white dark:bg-base-200 rounded-xl p-6 text-center shadow-lg border border-gray-100 dark:border-base-300">
                        <h3 className="text-base font-semibold text-base-content mb-2">Net Balance</h3>
                        <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>BDT {balance.toLocaleString()}</p>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white dark:bg-base-200 rounded-xl p-6 mb-8 shadow-lg border border-gray-100 dark:border-base-300">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                                <option value="receivable">Receivable Only</option>
                                <option value="payable">Payable Only</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-base-content mb-2">Filter by Date</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-base-content mb-2">Sort Transactions</label>
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all text-sm"
                                    >
                                        <option value="date">Date</option>
                                        <option value="amount">Amount</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <select
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value)}
                                        className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all text-sm"
                                    >
                                        <option value="desc">Newest/Highest</option>
                                        <option value="asc">Oldest/Lowest</option>
                                    </select>
                                </div>
                                <div className="flex items-center px-2">
                                    {sortOrder === 'desc' ?
                                        <FaSortAmountDown className="text-orange-500" /> :
                                        <FaSortAmountUp className="text-orange-500" />
                                    }
                                </div>
                            </div>
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
                                <div key={transaction._id} className="bg-white dark:bg-base-200 rounded-2xl p-6 shadow-md hover:shadow-xl border border-gray-100 dark:border-base-300 transition-all duration-300 hover:scale-[1.02]">
                                    {/* Header with Amount and Type */}
                                    <div className="flex justify-between items-center mb-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${transaction.type === 'income'
                                            ? 'bg-green-100 dark:bg-green-900'
                                            : transaction.type === 'expense'
                                                ? 'bg-red-100 dark:bg-red-900'
                                                : transaction.type === 'receivable'
                                                    ? 'bg-blue-100 dark:bg-blue-900'
                                                    : 'bg-orange-100 dark:bg-orange-900'
                                            }`}>
                                            <FaDollarSign className={`text-lg ${transaction.type === 'income' ? 'text-green-600'
                                                : transaction.type === 'expense' ? 'text-red-600'
                                                    : transaction.type === 'receivable' ? 'text-blue-600'
                                                        : 'text-orange-600'
                                                }`} />
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-2xl font-bold ${transaction.type === 'income' ? 'text-green-600'
                                                : transaction.type === 'expense' ? 'text-red-600'
                                                    : transaction.type === 'receivable' ? 'text-blue-600'
                                                        : 'text-orange-600'
                                                }`}>
                                                {transaction.type === 'income' || transaction.type === 'receivable' ? '+' : '-'}BDT {transaction.amount.toLocaleString()}
                                            </span>
                                            <p className={`text-xs font-medium uppercase tracking-wide ${transaction.type === 'income' ? 'text-green-500'
                                                : transaction.type === 'expense' ? 'text-red-500'
                                                    : transaction.type === 'receivable' ? 'text-blue-500'
                                                        : 'text-orange-500'
                                                }`}>
                                                {transaction.type}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Transaction Info */}
                                    <div className="space-y-3 mb-6">
                                        <div>
                                            <h3 className="font-semibold text-base-content text-lg mb-1 truncate">
                                                {transaction.description}
                                            </h3>
                                        </div>

                                        {(transaction.type === 'receivable' || transaction.type === 'payable') && transaction.personName && (
                                            <div className="flex items-center gap-2 text-sm text-base-content/70">
                                                <FaTag className="text-orange-500" />
                                                <span className="font-medium">
                                                    {transaction.type === 'receivable' ? 'From: ' : 'To: '}
                                                    {transaction.personName}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between text-sm text-base-content/70">
                                            <div className="flex items-center gap-2">
                                                <FaTag className="text-orange-500" />
                                                <span className="font-medium capitalize">{transaction.category}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="text-orange-500" />
                                                <span>{new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/transaction/${transaction._id}`}
                                            className="flex-1 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm"
                                            onClick={() => console.log('Navigating to transaction:', transaction._id)}
                                        >
                                            <FaEye className="text-xs" /> View
                                        </Link>
                                        <button
                                            onClick={() => handleEditClick(transaction)}
                                            className="flex-1 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm"
                                        >
                                            <FaEdit className="text-xs" /> Edit
                                        </button>
                                        {(transaction.type === 'receivable' || transaction.type === 'payable') ? (
                                            <button
                                                onClick={() => handleMarkAsPaid(transaction)}
                                                className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm text-white ${
                                                    transaction.isPaid
                                                        ? 'bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
                                                        : 'bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                                                }`}
                                            >
                                                {transaction.isPaid ? '✓ Paid' : 'Mark Paid'}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleDeleteTransaction(transaction._id)}
                                                className="flex-1 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm"
                                            >
                                                <FaTrash className="text-xs" /> Delete
                                            </button>
                                        )}
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
                                    <div className="grid grid-cols-2 gap-2">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="editType"
                                                value="expense"
                                                checked={editForm.type === 'expense'}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value }))}
                                                className="radio radio-error"
                                            />
                                            <span className="text-red-600 text-sm">Expense</span>
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
                                            <span className="text-green-600 text-sm">Income</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="editType"
                                                value="receivable"
                                                checked={editForm.type === 'receivable'}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value }))}
                                                className="radio radio-info"
                                            />
                                            <span className="text-blue-600 text-sm">Receivable</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="editType"
                                                value="payable"
                                                checked={editForm.type === 'payable'}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value }))}
                                                className="radio radio-warning"
                                            />
                                            <span className="text-orange-600 text-sm">Payable</span>
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

                                {(editForm.type === 'receivable' || editForm.type === 'payable') && (
                                    <div>
                                        <label className="block text-sm font-medium text-base-content mb-2">
                                            {editForm.type === 'receivable' ? 'Person Name (Who will pay)' : 'Person Name (To whom you will pay)'}
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.personName || ''}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, personName: e.target.value }))}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                                            placeholder={editForm.type === 'receivable' ? 'Enter debtor name' : 'Enter creditor name'}
                                        />
                                    </div>
                                )}

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

                {/* Paid Status Modal */}
                {paidModal.isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-base-200 rounded-xl p-6 w-full max-w-md">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-base-content">Mark as Paid</h3>
                                <button
                                    onClick={() => setPaidModal({ isOpen: false, transaction: null })}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="mb-6">
                                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
                                    <p className="text-sm text-base-content/70 mb-2">Transaction Details:</p>
                                    <p className="text-lg font-bold text-base-content mb-2">{paidModal.transaction?.description}</p>
                                    <p className={`text-2xl font-bold ${paidModal.transaction?.type === 'receivable' ? 'text-blue-600' : 'text-orange-600'}`}>
                                        BDT {paidModal.transaction?.amount.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-base-content/60 mt-2">
                                        {paidModal.transaction?.type === 'receivable' ? 'From: ' : 'To: '}{paidModal.transaction?.personName}
                                    </p>
                                    {paidModal.transaction?.isPaid && (
                                        <p className="text-xs text-green-600 mt-3 font-semibold">✓ Status: PAID</p>
                                    )}
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 p-4 rounded-lg">
                                    <p className="text-sm text-base-content mb-2">What would you like to do?</p>
                                    <ul className="text-sm text-base-content/70 space-y-1">
                                        {paidModal.transaction?.isPaid ? (
                                            <li>• <strong>Revert:</strong> Mark as unpaid and keep in records</li>
                                        ) : (
                                            <>
                                                <li>• <strong>Keep:</strong> Convert {paidModal.transaction?.type === 'receivable' ? 'to Income' : 'to Expense'} and keep in records</li>
                                                <li>• <strong>Delete:</strong> Convert and remove from history</li>
                                            </>
                                        )}
                                    </ul>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                {paidModal.transaction?.isPaid ? (
                                    <>
                                        <button
                                            onClick={() => handleRevertPaidFromModal()}
                                            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                                        >
                                            ↺ Revert to Unpaid
                                        </button>
                                        <button
                                            onClick={() => handlePaidDecision(true)}
                                            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handlePaidDecision(false)}
                                            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                                        >
                                            Convert & Keep
                                        </button>
                                        <button
                                            onClick={() => handlePaidDecision(true)}
                                            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                                        >
                                            Convert & Delete
                                        </button>
                                    </>
                                )}
                            </div>

                            <button
                                onClick={() => setPaidModal({ isOpen: false, transaction: null })}
                                className="w-full mt-3 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyTransaction;