import React, { useState, useEffect } from 'react';
import { FaDollarSign, FaCalendarAlt, FaTag, FaStickyNote, FaPlus, FaUtensils, FaCar, FaShoppingCart, FaGamepad, FaFileInvoiceDollar, FaEllipsisH, FaLaptop, FaChartLine, FaBriefcase } from 'react-icons/fa';
import { getCategories, saveTransaction } from '../api/transactions';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/firebase.init';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';

const AddTransaction = () => {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const [type, setType] = useState('expense');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        document.title = 'Add Transaction - Finance Management';
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const transaction = {
            type: form.type.value,
            amount: parseFloat(form.amount.value),
            category: form.category.value,
            description: form.description.value,
            date: form.date.value,
            email: user?.email ,
            name: user?.displayName 
        };
        
        try {
            const result = await saveTransaction(transaction);
            console.log('Transaction saved:', result);
            
            const swalResult = await Swal.fire({
                title: 'Success!',
                text: 'Transaction added successfully!',
                icon: 'success',
                confirmButtonColor: '#f97316',
                showCancelButton: true,
                confirmButtonText: 'View Transactions',
                cancelButtonText: 'Add Another'
            });
            
            if (swalResult.isConfirmed) {
                navigate('/transactions');
            } else {
                form.reset();
                setType('expense');
            }
        } catch (error) {
            console.error('Error saving transaction:', error);
            
            Swal.fire({
                title: 'Error!',
                text: 'Failed to save transaction',
                icon: 'error',
                confirmButtonColor: '#f97316'
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-base-100 pt-20">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-base-200 rounded-2xl shadow-xl border border-gray-100 dark:border-base-300 p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaPlus className="text-white text-xl" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-base-content mb-4">
                            Add Transaction
                        </h1>
                        <p className="text-base-content/70">Track your income and expenses</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <div className="mb-2">
                                <span className="font-medium flex items-center gap-2 text-base-content">Type</span>
                            </div>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="expense"
                                        checked={type === 'expense'}
                                        onChange={(e) => setType(e.target.value)}
                                        className="radio radio-error"
                                    />
                                    <span className="text-red-600">Expense</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="income"
                                        checked={type === 'income'}
                                        onChange={(e) => setType(e.target.value)}
                                        className="radio radio-success"
                                    />
                                    <span className="text-green-600">Income</span>
                                </label>

                            </div>
                        </div>

                        <div>
                            <div className="mb-2">
                                <span className="font-medium flex items-center gap-2 text-base-content"><FaDollarSign className="text-orange-500" /> Amount</span>
                            </div>
                            <input
                                type="number"
                                name="amount"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-black dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all"
                                placeholder="Enter amount"
                                required
                            />
                        </div>

                        <div>
                            <div className="mb-2">
                                <span className="font-medium flex items-center gap-2 text-base-content"><FaTag className="text-orange-500" /> Category</span>
                            </div>
                            <select
                                name="category"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all"
                                required
                            >
                                <option value="">Select category</option>
                                {categories
                                    .filter(cat => cat.type === type)
                                    .map(category => (
                                        <option key={category._id} value={category.name.toLowerCase()}>
                                            {category.name}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>

                        <div>
                            <div className="mb-2">
                                <span className="font-medium flex items-center gap-2 text-base-content"><FaCalendarAlt className="text-orange-500" /> Date</span>
                            </div>
                            <input
                                type="date"
                                name="date"
                                defaultValue={new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all"
                                required
                            />
                        </div>

                        <div>
                            <div className="mb-2">
                                <span className="font-medium flex items-center gap-2 text-base-content"><FaStickyNote className="text-orange-500" /> Description</span>
                            </div>
                            <textarea
                                name="description"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-black dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all resize-none"
                                placeholder="Enter description (optional)"
                                rows="3"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                            <FaPlus /> Add Transaction
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTransaction;