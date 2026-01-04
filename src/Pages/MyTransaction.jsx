import React, { useState, useEffect, useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/firebase.init';
import { Link, useLocation, useNavigate } from 'react-router';
import toast from 'react-hot-toast';

import PageSkeleton from '../Components/PageSkeleton';
import MyTransactionSkeleton from '../Components/MyTransactionSkeleton';
import { getTransactions, deleteTransaction, updateTransaction, getCategories } from '../api/transactions';
import { FaEdit, FaTrash, FaEye, FaCalendarAlt, FaTag, FaTimes, FaSave, FaSortAmountDown, FaSortAmountUp, FaCheckCircle } from 'react-icons/fa';
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
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(15);

    const fetchUserTransactions = useCallback(async () => {
        try {
            setDataLoading(true);
            const data = await getTransactions(user.email, sortBy, sortOrder, page, limit, filter, searchTerm, selectedDate);

            // Handle both array (legacy) and object (paginated) responses
            if (Array.isArray(data)) {
                setTransactions(data);
                setFilteredTransactions(data);
                setTotalPages(1); // Default if no pagination info
            } else if (data.transactions) {
                setTransactions(data.transactions);
                setFilteredTransactions(data.transactions);
                setTotalPages(data.totalPages || 1);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            toast.error('Failed to load transactions');
        } finally {
            setDataLoading(false);
        }
    }, [user, sortBy, sortOrder, page, limit, filter, searchTerm, selectedDate]);

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
        } else if (!authLoading && !user) {
            // Clear transactions when user logs out
            setTransactions([]);
            setFilteredTransactions([]);
            setDataLoading(false);
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

    // Sync filteredTransactions with transactions (server-side filtering handles the rest)
    useEffect(() => {
        setFilteredTransactions(transactions);
    }, [transactions]);

    // Reset to page 1 when sort, filter, search, or date changes
    useEffect(() => {
        setPage(1);
    }, [filter, searchTerm, selectedDate]);

    // Trigger fetch when dependencies change
    useEffect(() => {
        if (user) {
            fetchUserTransactions();
        }
    }, [fetchUserTransactions, user]);

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

    const extraStats = React.useMemo(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        const todayTxns = transactions.filter(t => new Date(t.date).toISOString().split('T')[0] === todayStr);
        const todayIncome = todayTxns.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const todayExpense = todayTxns.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        return { todayIncome, todayExpense, todayBalance: todayIncome - todayExpense, todayCount: todayTxns.length };
    }, [transactions]);

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    if (dataLoading) {
        return <MyTransactionSkeleton />;
    }



    return (
        <div className="min-h-screen bg-gray-50 dark:bg-base-100 pt-20 md:p-4">
            <div className="max-w-[1220px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-base-content mb-1">My Transactions</h1>
                        <p className="text-base-content/70 text-sm">Manage your financial activity</p>
                    </div>
                    <Link
                        to="/add-transaction"
                        className="flex items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all active:scale-95"
                    >
                        <span>+</span> Add Transaction
                    </Link>
                </div>

                {/* Daily Pulse Cards (New View) */}
                {/* Daily Pulse Cards (Gradient View) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {/* Today's Income */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-2xl shadow-lg border border-emerald-400/20 group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-6 -mt-6 transition-transform group-hover:scale-150"></div>
                        <p className="relative z-10 text-[10px] md:text-xs font-bold text-emerald-100 uppercase tracking-wider mb-1">Today's Income</p>
                        <h3 className="relative z-10 text-xl md:text-2xl font-black text-white">
                            BDT {extraStats.todayIncome.toLocaleString()}
                        </h3>
                    </div>

                    {/* Today's Expenses */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-2xl shadow-lg border border-orange-400/20 group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-6 -mt-6 transition-transform group-hover:scale-150"></div>
                        <p className="relative z-10 text-[10px] md:text-xs font-bold text-orange-100 uppercase tracking-wider mb-1">Today's Expense</p>
                        <h3 className="relative z-10 text-xl md:text-2xl font-black text-white">
                            BDT {extraStats.todayExpense.toLocaleString()}
                        </h3>
                    </div>

                    {/* Today's Net */}
                    <div className={`relative overflow-hidden p-4 rounded-2xl shadow-lg border group ${extraStats.todayBalance >= 0
                        ? 'bg-gradient-to-br from-indigo-500 to-blue-600 border-indigo-400/20'
                        : 'bg-gradient-to-br from-pink-500 to-rose-600 border-pink-400/20'}`}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-6 -mt-6 transition-transform group-hover:scale-150"></div>
                        <p className={`relative z-10 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1 ${extraStats.todayBalance >= 0 ? 'text-indigo-100' : 'text-pink-100'}`}>Today's Net</p>
                        <h3 className="relative z-10 text-xl md:text-2xl font-black text-white">
                            {extraStats.todayBalance > 0 ? '+' : ''}BDT {extraStats.todayBalance.toLocaleString()}
                        </h3>
                    </div>

                    {/* Today's Count */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-slate-700 to-gray-800 p-4 rounded-2xl shadow-lg border border-gray-600/20 group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-6 -mt-6 transition-transform group-hover:scale-150"></div>
                        <p className="relative z-10 text-[10px] md:text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">Transactions</p>
                        <div className="relative z-10 flex items-baseline gap-1">
                            <h3 className="text-xl md:text-2xl font-black text-white">
                                {extraStats.todayCount}
                            </h3>
                            <span className="text-xs text-gray-400 font-medium">today</span>
                        </div>
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

                {/* Transactions Table */}
                {dataLoading ? (
                    <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 overflow-hidden animate-pulse">
                        <div className="p-6 border-b border-gray-100 dark:border-base-300 flex justify-between items-center">
                            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="overflow-x-auto">
                            <div className="w-full">
                                <div className="flex bg-gray-50 dark:bg-base-300 p-4">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded mx-2"></div>
                                    ))}
                                </div>
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex p-4 border-b border-gray-100 dark:border-base-300">
                                        <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded mx-2"></div>
                                        <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded mx-2"></div>
                                        <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded mx-2"></div>
                                        <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded mx-2"></div>
                                        <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded mx-2"></div>
                                        <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded mx-2"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-base-300 flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-base-content">
                                Transactions ({filteredTransactions.length})
                            </h3>
                        </div>

                        {filteredTransactions.length === 0 ? (
                            <div className="p-12 text-center">
                                <p className="text-base-content/70 mb-4">No transactions found</p>
                                <Link
                                    to="/add-transaction"
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors inline-block"
                                >
                                    Add Your First Transaction
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="table table-zebra w-full text-left border-collapse table-pin-rows">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-base-300 text-base-content/70 text-sm uppercase tracking-wider">
                                            <th className="p-4 font-semibold">Date</th>
                                            <th className="p-4 font-semibold">Description</th>
                                            <th className="p-4 font-semibold">Category</th>
                                            <th className="p-4 font-semibold text-center">Type</th>
                                            <th className="p-4 font-semibold text-right">Amount</th>
                                            <th className="p-4 font-semibold text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-base-300">
                                        {filteredTransactions.map((transaction) => (
                                            <tr key={transaction._id} className="hover:bg-gray-50 dark:hover:bg-base-300/50 transition-colors">
                                                <td className="p-4 whitespace-nowrap text-base-content">
                                                    <div className="flex items-center gap-2">
                                                        <FaCalendarAlt className="text-orange-500" />
                                                        <span>{new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-base-content ">
                                                    <div className="font-medium max-h-[50px] overflow-y-hidden">{transaction.description}</div>
                                                    {(transaction.type === 'receivable' || transaction.type === 'payable') && transaction.personName && (
                                                        <div className="text-xs text-base-content/60 mt-0.5">
                                                            {transaction.type === 'receivable' ? 'From: ' : 'To: '} {transaction.personName}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-4 whitespace-nowrap text-base-content">
                                                    <div className="flex items-center gap-2">
                                                        <FaTag className="text-orange-500" />
                                                        <span className="capitalize">{transaction.category}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center whitespace-nowrap">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${transaction.type === 'income' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                                                        transaction.type === 'expense' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                                            transaction.type === 'receivable' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                                                'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                                                        }`}>
                                                        {transaction.type}
                                                    </span>
                                                </td>
                                                <td className={`p-4 text-right font-bold whitespace-nowrap ${transaction.type === 'income' ? 'text-green-600' :
                                                    transaction.type === 'expense' ? 'text-red-600' :
                                                        transaction.type === 'receivable' ? 'text-blue-600' :
                                                            'text-orange-600'
                                                    }`}>
                                                    {transaction.type === 'income' || transaction.type === 'receivable' ? '+' : '-'}
                                                    BDT {transaction.amount.toLocaleString()}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Link
                                                            to={`/transaction/${transaction._id}`}
                                                            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                            title="View Details"
                                                        >
                                                            <FaEye size={18} />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleEditClick(transaction)}
                                                            className="p-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <FaEdit size={18} />
                                                        </button>
                                                        {(transaction.type === 'receivable' || transaction.type === 'payable') ? (
                                                            <button
                                                                onClick={() => handleMarkAsPaid(transaction)}
                                                                className={`p-2 rounded-lg transition-colors ${transaction.isPaid
                                                                    ? 'text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                                                                    : 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                                                                    }`}
                                                                title={transaction.isPaid ? "Mark as Unpaid" : "Mark as Paid"}
                                                            >
                                                                <FaCheckCircle size={18} />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleDeleteTransaction(transaction._id)}
                                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                                title="Delete"
                                                            >
                                                                <FaTrash size={18} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Pagination Controls */}
                {!dataLoading && (
                    <div className="flex justify-center mt-8 gap-2">
                        <button
                            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                            className="px-4 py-2 bg-white dark:bg-base-200 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-base-content"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center shadow-lg shadow-orange-500/30">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={page === totalPages}
                            className="px-4 py-2 bg-white dark:bg-base-200 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-base-content"
                        >
                            Next
                        </button>
                    </div>
                )}

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