import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../Firebase/firebase.init';
import toast from 'react-hot-toast';

import { FaEye, FaEyeSlash, FaGoogle, FaEnvelope, FaLock, FaRocket } from 'react-icons/fa';

const provider = new GoogleAuthProvider();

const LogIn = () => {
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    useEffect(() => {
        document.title = 'Sign In - Finance Management';
    }, []);



    const handleLogin = (event) => {
        event.preventDefault();
        
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;

        signInWithEmailAndPassword(auth, email, password)
            .then(result => {
                form.reset();
                toast.success('Login successful! Welcome back.');
                navigate(from, { replace: true });
            })
            .catch(error => {
                if (error.code === 'auth/invalid-credential') {
                    toast.error('Incorrect email or password. Please try again.');
                } else if (error.code === 'auth/user-not-found') {
                    toast.error('No account found with this email.');
                } else if (error.code === 'auth/wrong-password') {
                    toast.error('Incorrect password.');
                } else {
                    toast.error('Login failed. Please try again.');
                }
            });
    };

    const handleGoogleLogin = () => {
        
        signInWithPopup(auth, provider)
            .then(result => {
                toast.success('Google login successful! Welcome back.');
                navigate(from, { replace: true });
            })
            .catch(error => {
                toast.error('Google login failed. Please try again.');
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-base-100 pt-20">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-base-200 rounded-2xl shadow-xl border border-gray-100 dark:border-base-300 p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-bold text-2xl">F</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-base-content mb-4">
                            Welcome Back!
                        </h1>
                        <p className="text-base-content/70">Sign in to manage your finances</p>
                    </div>
                    
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <div className="mb-2">
                                <span className="font-medium flex items-center gap-2 text-base-content"><FaEnvelope className="text-orange-500" /> Email</span>
                            </div>
                            <input 
                                type="email" 
                                name="email" 
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-black dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all" 
                                placeholder="Enter your email" 
                                required 
                            />
                        </div>
                        
                        <div>
                            <div className="mb-2">
                                <span className="font-medium flex items-center gap-2 text-base-content"><FaLock className="text-orange-500" /> Password</span>
                            </div>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    name="password" 
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-black dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all pr-12" 
                                    placeholder="Enter your password" 
                                    required 
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <div className="text-right mt-2">
                                <button 
                                    type="button"
                                    onClick={() => {
                                        const email = document.querySelector('input[name="email"]').value;
                                        navigate('/forgot-password', { state: { email } });
                                    }}
                                    className="text-orange-500 hover:text-orange-600 text-sm font-medium text-center"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        </div>
                        

                        
                        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                            <FaRocket/> Sign In
                        </button>
                    </form>
                    
                    <div className="flex items-center my-6">
                        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                        <span className="px-4 text-base-content/60 font-medium text-sm">OR</span>
                        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                    </div>
                    
                    <button 
                        onClick={handleGoogleLogin}
                        className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                        <FaGoogle className="text-red-500" />
                        Continue with Google
                    </button>
                    
                    <p className="text-center text-sm text-base-content/70">
                        New to Finance Management? 
                        <Link to='/register' className='text-orange-500 hover:text-orange-600 font-semibold ml-1 transition-colors'>
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LogIn;