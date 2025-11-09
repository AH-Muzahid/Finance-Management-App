import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/firebase.init';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import LoadingSpinner from '../Components/LoadingSpinner';

const AddTransaction = () => {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
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

        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
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
            
            setTimeout(() => navigate('/'), 1000);
            
        } catch (error) {
            console.error('Error adding transaction:', error);
            toast.error('Failed to add transaction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 section-padding">
            <div className="max-w-2xl mx-auto">
                <div className="card-glass p-8 fade-in">
                    <h1 className="heading-secondary text-white mb-8 text-center">Add Transaction</h1>
                    
                    <form onSubmit={handleSubmit} className="content-spacing">
                        {/* Transaction Type */}
                        <div>
                            <label className="form-label">Transaction Type</label>
                            <div className="flex gap-6">
                                <label className="flex items-center cursor-pointer hover-lift">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="expense"
                                        checked={formData.type === 'expense'}
                                        onChange={handleInputChange}
                                        className="mr-3 w-4 h-4"
                                    />
                                    <span className="text-red-400 font-semibold text-lg">Expense</span>
                                </label>
                                <label className="flex items-center cursor-pointer hover-lift">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="income"
                                        checked={formData.type === 'income'}
                                        onChange={handleInputChange}
                                        className="mr-3 w-4 h-4"
                                    />
                                    <span className="text-green-400 font-semibold text-lg">Income</span>
                                </label>
                            </div>
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="form-label">Amount ($)</label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                className="form-input"
                                required
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="form-label">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="form-select"
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
                            <label className="form-label">Description</label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Enter description"
                                className="form-input"
                                required
                            />
                        </div>

                        {/* Date */}
                        <div>
                            <label className="form-label">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className="form-input"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4 pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <LoadingSpinner size="sm" />
                                        Adding...
                                    </>
                                ) : (
                                    'Add Transaction'
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                disabled={loading}
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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