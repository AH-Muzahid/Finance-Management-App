import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../Firebase/firebase.init';
import { FaEnvelope } from 'react-icons/fa';

const ForgotPassword = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const location = useLocation();

    useEffect(() => {
        document.title = 'Reset Password - Game Hub';
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
        <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">

            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-400 rounded-full blur-xl"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-500 rounded-full blur-xl"></div>
            </div>
            <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
                backgroundSize: '50px 50px'
            }}></div>
            <div className="hero-content flex-col lg:flex-col mx-auto  px-4 justify-center items-center min-h-screen relative z-10">
                <div className="relative z-10 container mx-auto px-4">
                    <div className="max-w-lg mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-linear-to-r from-cyan-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent mb-4 transition-all duration-1000 ease-out hover:scale-105">Reset Password</h1>
                            <p className="text-cyan-300 text-lg font-medium">Enter your email address and we'll send you a link to reset your password.</p>
                            <div className="w-32 h-1 bg-linear-to-r from-cyan-400 to-pink-500 mx-auto rounded-full m-4"></div>

                        </div>
                        <div className="bg-black/40 backdrop-blur-xl border border-cyan-400/30 rounded-3xl p-8 shadow-2xl transition-all duration-700 ease-out hover:bg-black/50 hover:border-cyan-400/50 hover:shadow-cyan-400/20 hover:-translate-y-2">
                            <form onSubmit={handleResetPassword}>


                                <div className="form-control">
                                    <div className="mb-2">
                                        <span className="text-cyan-300 font-bold flex items-center gap-2"><FaEnvelope /> Email</span>
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input input-bordered w-full bg-black/50 border-cyan-400/50 text-white placeholder-gray-400 focus:border-cyan-400 focus:bg-black/70 transition-all duration-300"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>

                                <div className="mt-4">
                                    {message && <div className="alert alert-success"><span>{message}</span></div>}
                                    {error && <div className="alert alert-error"><span>{error}</span></div>}
                                </div>

                                <div className="form-control mt-6">
                                    <button

                                        className={`w-full bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all duration-500 ease-out transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-pink-500/40 mb-5 text-sm sm:text-base active:scale-95  flex items-center justify-center gap-3 mx-auto ${loading ? 'loading' : ''}`}
                                        disabled={loading}
                                    >
                                        {loading ? 'Sending...' : 'Reset Password'}
                                    </button>
                                </div>
                            </form>
                        <p className="text-center text-gray-300 text-sm sm:text-base">
                            <Link to='/login' className='text-yellow-400 hover:text-yellow-300 font-bold ml-1 transition-colors'>Back to Sign In</Link>
                        </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
