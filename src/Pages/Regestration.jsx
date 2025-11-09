import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { auth } from '../Firebase/firebase.init';

import { FaEye, FaEyeSlash, FaGoogle, FaEnvelope, FaLock, FaUser, FaRocket, FaImage } from 'react-icons/fa';

const provider = new GoogleAuthProvider();

const Registration = () => {
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordValidation, setPasswordValidation] = useState({
        length: false,
        capital: false,
        lowercase: false,
        match: false
    });

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Sign Up - Finance Management';
    }, []);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        setPasswordValidation({
            length: password.length >= 6,
            capital: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            match: password === confirmPassword && confirmPassword !== ''
        });
    }, [password, confirmPassword]);

    const handleRegister = (event) => {
        event.preventDefault();
        setError('');
        
        const form = event.target;
        const name = form.name.value;
        const email = form.email.value;
        const photoURL = form.photoURL.value;
        const password = form.password.value;

        if (!passwordValidation.length || !passwordValidation.capital || !passwordValidation.lowercase) {
            setError('Password must meet all requirements.');
            return;
        }

        if (!passwordValidation.match) {
            setError('Passwords do not match.');
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then(result => {
                updateProfile(result.user, {
                    displayName: name,
                    photoURL: photoURL || null
                });
                form.reset();
                setPassword('');
                setConfirmPassword('');
                navigate('/');
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    setError('Email is already registered. Please use a different email.');
                } else if (error.code === 'auth/weak-password') {
                    setError('Password is too weak. Please choose a stronger password.');
                } else {
                    setError('Registration failed. Please try again.');
                }
            });
    };

    const handleGoogleLogin = () => {
        setError('');
        
        signInWithPopup(auth, provider)
            .then(result => {
                navigate('/');
            })
            .catch(error => {
                setError('Google registration failed. Please try again.');
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
                            Join Us!
                        </h1>
                        <p className="text-base-content/70">Start your financial journey</p>
                    </div>
                    
                    <form onSubmit={handleRegister} className="space-y-6">
                        <div>
                            <div className="mb-2">
                                <span className="font-medium flex items-center gap-2 text-base-content"><FaUser className="text-orange-500" /> Name</span>
                            </div>
                            <input 
                                type="text" 
                                name="name" 
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-black dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all"
                                placeholder="Enter your full name" 
                                required 
                            />
                        </div>
                        
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
                                <span className="font-medium flex items-center gap-2 text-base-content"><FaImage className="text-orange-500" /> Photo URL</span>
                            </div>
                            <input 
                                type="url" 
                                name="photoURL" 
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-black dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all"
                                placeholder="Enter photo URL (optional)" 
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                            {password && (
                                <div className="text-sm mt-2 space-y-1 rounded-lg p-3 bg-gray-50 dark:bg-gray-700">
                                    <p className={passwordValidation.length ? 'text-green-600' : 'text-red-500'}>
                                        {passwordValidation.length ? '✓' : '•'} At least 6 characters
                                    </p>
                                    <p className={passwordValidation.capital ? 'text-green-600' : 'text-red-500'}>
                                        {passwordValidation.capital ? '✓' : '•'} At least 1 uppercase letter
                                    </p>
                                    <p className={passwordValidation.lowercase ? 'text-green-600' : 'text-red-500'}>
                                        {passwordValidation.lowercase ? '✓' : '•'} At least 1 lowercase letter
                                    </p>
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="mb-2">
                                <span className="font-medium flex items-center gap-2 text-base-content"><FaLock className="text-orange-500" /> Confirm Password</span>
                            </div>
                            <input 
                                type="password"
                                name="confirmPassword" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-black dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all"
                                placeholder="Confirm your password" 
                                required 
                            />
                            {confirmPassword && (
                                <div className="text-sm mt-2 rounded-lg p-3 bg-gray-50 dark:bg-gray-700">
                                    <p className={passwordValidation.match ? 'text-green-600' : 'text-red-500'}>
                                        {passwordValidation.match ? '✓ Passwords match!' : '• Passwords do not match'}
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg p-4">
                                <span className="font-medium">{error}</span>
                            </div>
                        )}
                        
                        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                            <FaRocket/> Sign Up
                        </button>
                    </form>
                    
                    <div className="flex items-center my-6">
                        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                        <span className="px-4 text-base-content/60 font-medium text-sm">OR</span>
                        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                    </div>
                    
                    <button 
                        onClick={handleGoogleLogin}
                        className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg transition-colors mb-6 flex items-center justify-center gap-3"
                    >
                        <FaGoogle className="text-red-500" />
                        Continue with Google
                    </button>
                    
                    <p className="text-center text-sm text-base-content/70">
                        Already have an account? 
                        <Link to='/login' className='text-orange-500 hover:text-orange-600 font-semibold ml-1 transition-colors'>
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Registration;