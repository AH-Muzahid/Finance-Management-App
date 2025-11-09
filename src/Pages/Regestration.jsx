import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { auth } from '../Firebase/firebase.init';
import { useTheme } from '../contexts/ThemeContext';
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
    const { isDark } = useTheme();
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
        <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
            isDark 
                ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
                : 'bg-gradient-to-br from-blue-50 to-indigo-100'
        }`}>
            <div className="w-full max-w-md">
                <div className={`rounded-2xl shadow-xl p-8 transition-colors duration-300 ${
                    isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                }`}>
                    <div className="text-center mb-8">
                        <h1 className={`text-3xl font-bold mb-2 ${
                            isDark ? 'text-white' : 'text-gray-800'
                        }`}>
                            Join Us!
                        </h1>
                        <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Start your financial journey</p>
                    </div>
                    
                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="form-control">
                            <div className="mb-2">
                                <span className={`font-medium flex items-center gap-2 ${
                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}><FaUser className="text-blue-600" /> Name</span>
                            </div>
                            <input 
                                type="text" 
                                name="name" 
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                    isDark 
                                        ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                                }`}
                                placeholder="Enter your full name" 
                                required 
                            />
                        </div>
                        
                        <div className="form-control">
                            <div className="mb-2">
                                <span className={`font-medium flex items-center gap-2 ${
                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}><FaEnvelope className="text-blue-600" /> Email</span>
                            </div>
                            <input 
                                type="email" 
                                name="email" 
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                    isDark 
                                        ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                                }`}
                                placeholder="Enter your email" 
                                required 
                            />
                        </div>

                        <div className="form-control">
                            <div className="mb-2">
                                <span className={`font-medium flex items-center gap-2 ${
                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}><FaImage className="text-blue-600" /> Photo URL</span>
                            </div>
                            <input 
                                type="url" 
                                name="photoURL" 
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                    isDark 
                                        ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                                }`}
                                placeholder="Enter photo URL (optional)" 
                            />
                        </div>
                        
                        <div className="form-control">
                            <div className="mb-2">
                                <span className={`font-medium flex items-center gap-2 ${
                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}><FaLock className="text-blue-600" /> Password</span>
                            </div>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    name="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12 ${
                                        isDark 
                                            ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                                            : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                                    }`}
                                    placeholder="Enter your password" 
                                    required 
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                                        isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {password && (
                                <div className={`text-sm mt-2 space-y-1 rounded-lg p-3 ${
                                    isDark ? 'bg-gray-700' : 'bg-gray-50'
                                }`}>
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

                        <div className="form-control">
                            <div className="mb-2">
                                <span className={`font-medium flex items-center gap-2 ${
                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}><FaLock className="text-blue-600" /> Confirm Password</span>
                            </div>
                            <input 
                                type="password"
                                name="confirmPassword" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                    isDark 
                                        ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                                }`}
                                placeholder="Confirm your password" 
                                required 
                            />
                            {confirmPassword && (
                                <div className={`text-sm mt-2 rounded-lg p-3 ${
                                    isDark ? 'bg-gray-700' : 'bg-gray-50'
                                }`}>
                                    <p className={passwordValidation.match ? 'text-green-600' : 'text-red-500'}>
                                        {passwordValidation.match ? '✓ Passwords match!' : '• Passwords do not match'}
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        {error && (
                            <div className={`border rounded-lg p-4 ${
                                isDark 
                                    ? 'bg-red-900/20 border-red-800 text-red-400' 
                                    : 'bg-red-50 border-red-200 text-red-600'
                            }`}>
                                <span className="font-medium">{error}</span>
                            </div>
                        )}
                        
                        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                            <FaRocket/> Sign Up
                        </button>
                    </form>
                    
                    <div className="flex items-center my-6">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="px-4 text-gray-500 font-medium text-sm">OR</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                    </div>
                    
                    <button 
                        onClick={handleGoogleLogin}
                        className={`w-full border font-semibold py-3 px-6 rounded-lg transition-all duration-200 mb-6 flex items-center justify-center gap-3 ${
                            isDark 
                                ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-white' 
                                : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                        }`}
                    >
                        <FaGoogle className="text-red-500" />
                        Continue with Google
                    </button>
                    
                    <p className={`text-center text-sm ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        Already have an account? 
                        <Link to='/login' className='text-blue-600 hover:text-blue-800 font-semibold ml-1 transition-colors'>
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Registration;