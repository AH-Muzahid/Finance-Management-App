import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../Firebase/firebase.init';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';

const ForgotPassword = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const location = useLocation();

    useEffect(() => {
        document.title = 'Reset Password - Finance Management';
        // Auto-fill email from login page
        if (location.state?.email) {
            setEmail(location.state.email);
        }
    }, [location.state]);

    const handleResetPassword = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        const form = e.target;
        const emailValue = form.email.value;

        // console.log('Attempting to send reset email to:', emailValue);

        sendPasswordResetEmail(auth, emailValue)
            .then(() => {
                // console.log('Password reset email sent successfully');
                setMessage('Password reset email sent! Redirecting to Gmail...');
                form.reset();
                setTimeout(() => {
                    window.open('https://mail.google.com', '_blank');
                }, 2000);
            })
            .catch((error) => {
                // console.error('Password reset error:', error);
                if (error.code === 'auth/user-not-found') {
                    setError('No account found with this email address.');
                } else if (error.code === 'auth/invalid-email') {
                    setError('Please enter a valid email address.');
                } else {
                    setError(`Failed to send reset email: ${error.message}`);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-base-100 pt-20">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-base-200 rounded-2xl shadow-xl border border-gray-100 dark:border-base-300 p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaEnvelope className="text-white text-xl" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-base-content mb-4">
                            Reset Password
                        </h1>
                        <p className="text-base-content/70">Enter your email address and we'll send you a link to reset your password.</p>
                    </div>
                    
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <div>
                            <div className="mb-2">
                                <span className="font-medium flex items-center gap-2 text-base-content"><FaEnvelope className="text-orange-500" /> Email</span>
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-black dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        {message && (
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded-lg p-4">
                                <span className="font-medium">{message}</span>
                            </div>
                        )}
                        
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg p-4">
                                <span className="font-medium">{error}</span>
                            </div>
                        )}

                        <button
                            className={`w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            <FaEnvelope /> {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                    
                    <p className="text-center text-sm text-base-content/70 mt-6">
                        <Link to='/login' className='text-orange-500 hover:text-orange-600 font-semibold transition-colors flex items-center justify-center gap-2'>
                            <FaArrowLeft /> Back to Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
