import React, { useState, useEffect, useRef } from 'react';
import { FaDollarSign, FaCalendarAlt, FaTag, FaStickyNote, FaPlus, FaUtensils, FaCar, FaShoppingCart, FaGamepad, FaFileInvoiceDollar, FaEllipsisH, FaLaptop, FaChartLine, FaBriefcase, FaChevronDown, FaUser } from 'react-icons/fa';
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
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [personName, setPersonName] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => {
        document.title = 'Add Transaction - Finance Management';
        fetchCategories();
        
        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
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
            email: user?.email,
            name: user?.displayName,
            timestamp: new Date().toISOString(),
            // Add person name for receivable/payable
            ...(type === 'receivable' || type === 'payable' ? { personName: form.personName.value } : {})
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
                navigate('/my-transactions');
            } else {
                form.reset();
                setType('expense');
                setSelectedCategory('');
                setPersonName('');
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
                            <div className="grid grid-cols-2 gap-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="expense"
                                        checked={type === 'expense'}
                                        onChange={(e) => {
                                            setType(e.target.value);
                                            setSelectedCategory('');
                                        }}
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
                                        onChange={(e) => {
                                            setType(e.target.value);
                                            setSelectedCategory('');
                                        }}
                                        className="radio radio-success"
                                    />
                                    <span className="text-green-600">Income</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="receivable"
                                        checked={type === 'receivable'}
                                        onChange={(e) => {
                                            setType(e.target.value);
                                            setSelectedCategory('');
                                        }}
                                        className="radio radio-info"
                                    />
                                    <span className="text-blue-600">Receivable</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="payable"
                                        checked={type === 'payable'}
                                        onChange={(e) => {
                                            setType(e.target.value);
                                            setSelectedCategory('');
                                        }}
                                        className="radio radio-warning"
                                    />
                                    <span className="text-orange-600">Payable</span>
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

                        {(type === 'receivable' || type === 'payable') && (
                            <div>
                                <div className="mb-2">
                                    <span className="font-medium flex items-center gap-2 text-base-content">
                                        <FaUser className="text-orange-500" /> 
                                        {type === 'receivable' ? 'Person Name (Who will pay you)' : 'Person Name (To whom you will pay)'}
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    name="personName"
                                    value={personName}
                                    onChange={(e) => setPersonName(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-black dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all"
                                    placeholder={type === 'receivable' ? 'Enter debtor name' : 'Enter creditor name'}
                                    required
                                />
                            </div>
                        )}

                        <div className="relative" ref={dropdownRef}>
                            <div className="mb-2">
                                <span className="font-medium flex items-center gap-2 text-base-content"><FaTag className="text-orange-500" /> Category</span>
                            </div>
                            <input type="hidden" name="category" value={selectedCategory} required />
                            <div 
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all cursor-pointer flex items-center justify-between"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <span className={selectedCategory ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                                    {selectedCategory ? categories.find(cat => cat.name.toLowerCase() === selectedCategory)?.name : 'Select category'}
                                </span>
                                <FaChevronDown className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>
                            {isDropdownOpen && (
                                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                    {categories
                                        .filter(cat => cat.type === type)
                                        .map(category => (
                                            <div
                                                key={category._id}
                                                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-black dark:text-white"
                                                onClick={() => {
                                                    setSelectedCategory(category.name.toLowerCase());
                                                    setIsDropdownOpen(false);
                                                }}
                                            >
                                                {category.name}
                                            </div>
                                        ))
                                    }
                                </div>
                            )}
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

                        <div>
                            <div className="mb-2">
                                <span className="font-medium flex items-center gap-2 text-base-content"><FaBriefcase className="text-orange-500" /> User Name</span>
                            </div>
                            <input
                                type="text"
                                value={user?.displayName || 'N/A'}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg cursor-not-allowed"
                                readOnly
                            />
                        </div>

                        <div>
                            <div className="mb-2">
                                <span className="font-medium flex items-center gap-2 text-base-content"><FaFileInvoiceDollar className="text-orange-500" /> User Email</span>
                            </div>
                            <input
                                type="email"
                                value={user?.email || 'N/A'}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg cursor-not-allowed"
                                readOnly
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                            <FaPlus /> Add Transaction
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/my-transactions')}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                            📋 View Transactions
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTransaction;