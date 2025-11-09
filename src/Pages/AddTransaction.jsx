import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/firebase.init';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

const AddTransaction = () => {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    const expenseCategories = [
        'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
        'Bills & Utilities', 'Healthcare', 'Education', 'Travel', 'Other'
    ];

    const incomeCategories = [
        'Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.amount || !formData.category || !formData.description) {
            toast.error('Please fill in all fields');
            return;
        }

        if (parseFloat(formData.amount) <= 0) {
            toast.error('Amount must be greater than 0');
            return;
        }

        try {
            // Here you would save to Firebase Firestore
            const transactionData = {
                ...formData,
                amount: parseFloat(formData.amount),
                userId: user.uid,
                createdAt: new Date()
            };
            
            console.log('Transaction to save:', transactionData);
            toast.success('Transaction added successfully!');
            
            // Reset form
            setFormData({
                type: 'expense',
                amount: '',
                category: '',
                description: '',
                date: new Date().toISOString().split('T')[0]
            });
            
            // Navigate back to home or transactions page
            setTimeout(() => navigate('/'), 1000);
            
        } catch (error) {
            console.error('Error adding transaction:', error);
            toast.error('Failed to add transaction');
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
                    <h1 className="text-3xl font-bold text-white mb-8 text-center">Add Transaction</h1>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Transaction Type */}
                        <div>
                            <label className="block text-white font-semibold mb-3">Transaction Type</label>
                            <div className="flex gap-4">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="expense"
                                        checked={formData.type === 'expense'}
                                        onChange={handleInputChange}
                                        className="mr-2"
                                    />
                                    <span className="text-red-400 font-semibold">Expense</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="income"
                                        checked={formData.type === 'income'}
                                        onChange={handleInputChange}
                                        className="mr-2"
                                    />
                                    <span className="text-green-400 font-semibold">Income</span>
                                </label>
                            </div>
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-white font-semibold mb-2">Amount ($)</label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                required
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-white font-semibold mb-2">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                required
                            >
                                <option value="">Select a category</option>
                                {(formData.type === 'expense' ? expenseCategories : incomeCategories).map(category => (
                                    <option key={category} value={category} className="bg-gray-800">
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-white font-semibold mb-2">Description</label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Enter description"
                                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                required
                            />
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-white font-semibold mb-2">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-linear-to-r from-cyan-500 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all transform hover:scale-105"
                            >
                                Add Transaction
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTransaction;