import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../Firebase/firebase.init';
import { useTheme } from '../contexts/ThemeContext';
import { FaEye, FaEyeSlash, FaGoogle, FaEnvelope, FaLock, FaRocket } from 'react-icons/fa';

const provider = new GoogleAuthProvider();

const LogIn = () => {
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    useEffect(() => {
        document.title = 'Sign In - Finance Management';
    }, []);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleLogin = (event) => {
        event.preventDefault();
        setError('');
        
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;

        signInWithEmailAndPassword(auth, email, password)
            .then(result => {
                form.reset();
                navigate(from, { replace: true });
            })
            .catch(error => {
                if (error.code === 'auth/invalid-credential') {
                    setError('Incorrect email or password. Please try again.');
                } else if (error.code === 'auth/user-not-found') {
                    setError('No account found with this email.');
                } else if (error.code === 'auth/wrong-password') {
                    setError('Incorrect password.');
                } else {
                    setError('Login failed. Please try again.');
                }
            });
    };

    const handleGoogleLogin = () => {
        setError('');
        
        signInWithPopup(auth, provider)
            .then(result => {
                navigate(from, { replace: true });
            })
            .catch(error => {
                setError('Google login failed. Please try again.');
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
                    <div className="text-center mb-8 fade-in">
                        <h1 className={`heading-secondary mb-4 ${
                            isDark ? 'text-white' : 'text-gray-800'
                        }`}>
                            Welcome Back!
                        </h1>
                        <p className={`text-body ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Sign in to manage your finances</p>
                    </div>
                    
                    <form onSubmit={handleLogin} className="content-spacing slide-up">
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
                                }`}><FaLock className="text-blue-600" /> Password</span>
                            </div>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    name="password" 
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
                            <div className="text-right mt-2">
                                <button 
                                    type="button"
                                    onClick={() => {
                                        const email = document.querySelector('input[name="email"]').value;
                                        navigate('/forgot-password', { state: { email } });
                                    }}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    Forgot password?
                                </button>
                            </div>
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
                        
                        <button className="w-full btn-primary flex items-center justify-center gap-2">
                            <FaRocket/> Sign In
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
                        New to Finance Management? 
                        <Link to='/register' className='text-blue-600 hover:text-blue-800 font-semibold ml-1 transition-colors'>
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LogIn;