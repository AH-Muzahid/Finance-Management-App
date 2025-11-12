import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/firebase.init';
import { getTransaction, deleteTransaction, getTransactions } from '../api/transactions';
import { FaArrowLeft, FaEdit, FaTrash, FaCalendarAlt, FaTag, FaDollarSign, FaStickyNote } from 'react-icons/fa';
import LoadingSpinner from '../Components/LoadingSpinner';
import Swal from 'sweetalert2';

const TransactionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user] = useAuthState(auth);
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [categoryTotal, setCategoryTotal] = useState(0);

    const fetchTransaction = useCallback(async () => {
        try {
            setLoading(true);
            console.log('Fetching transaction with ID:', id);
            const data = await getTransaction(id);
            console.log('Transaction data received:', data);
            setTransaction(data);
            
            // Calculate category total
            if (user && data) {
                const allTransactions = await getTransactions(user.email);
                const categoryTransactions = allTransactions.filter(t => 
                    t.category === data.category && t.type === data.type
                );
                const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
                setCategoryTotal(total);
            }
        } catch (error) {
            console.error('Error fetching transaction:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to load transaction details',
                icon: 'error',
                confirmButtonColor: '#f97316'
            });
        } finally {
            setLoading(false);
        }
    }, [id, user]);

    useEffect(() => {
        document.title = 'Transaction Details - Finance Management';
        if (id && user) {
            fetchTransaction();
        }
    }, [id, user, fetchTransaction]);

    const handleDelete = async () => {
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
                
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Transaction has been deleted.',
                    icon: 'success',
                    confirmButtonColor: '#f97316'
                });
                
                navigate('/my-transactions');
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

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    if (!transaction) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-base-100 pt-20 p-4 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-base-content mb-4">Transaction Not Found</h2>
                    <Link 
                        to="/my-transactions"
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                        Back to Transactions
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-base-100 pt-20 p-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link 
                        to="/my-transactions"
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <FaArrowLeft className="text-base-content" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-base-content">Transaction Details</h1>
                        <p className="text-base-content/70">View transaction information</p>
                    </div>
                </div>

                {/* Transaction Card */}
                <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-8">
                    {/* Type and Amount */}
                    <div className="flex justify-between items-start mb-8">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            transaction.type === 'income' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                            {transaction.type.toUpperCase()}
                        </span>
                        <div className="text-right">
                            <span className={`text-4xl font-bold ${
                                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {transaction.type === 'income' ? '+' : '-'}BDT {transaction.amount.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="space-y-6 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                                <FaTag className="text-orange-500 text-xl" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-base-content/70">Category</p>
                                <p className="text-lg font-semibold text-base-content capitalize">{transaction.category}</p>
                                <p className="text-sm text-base-content/60 mt-1">
                                    Total in this category: <span className="font-semibold">BDT {categoryTotal.toLocaleString()}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                                <FaCalendarAlt className="text-orange-500 text-xl" />
                            </div>
                            <div>
                                <p className="text-sm text-base-content/70">Date</p>
                                <p className="text-lg font-semibold text-base-content">
                                    {new Date(transaction.date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                                <FaStickyNote className="text-orange-500 text-xl" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-base-content/70">Description</p>
                                <p className="text-lg font-semibold text-base-content">{transaction.description}</p>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-base-content/70">Created by:</span>
                                    <p className="text-base-content font-medium">{transaction.name}</p>
                                </div>
                                <div>
                                    <span className="text-base-content/70">Email:</span>
                                    <p className="text-base-content font-medium">{transaction.email}</p>
                                </div>
                                {transaction.createdAt && (
                                    <div>
                                        <span className="text-base-content/70">Created at:</span>
                                        <p className="text-base-content font-medium">
                                            {new Date(transaction.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                                {transaction.updatedAt && (
                                    <div>
                                        <span className="text-base-content/70">Last updated:</span>
                                        <p className="text-base-content font-medium">
                                            {new Date(transaction.updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <Link
                            to="/my-transactions"
                            state={{ editTransaction: transaction }}
                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                            <FaEdit /> Edit Transaction
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                            <FaTrash /> Delete Transaction
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetails;