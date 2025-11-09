import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { auth } from '../Firebase/firebase.init';
import { FaEye, FaEyeSlash, FaGoogle, FaEnvelope, FaLock, FaUser, FaRocket } from 'react-icons/fa';

const provider = new GoogleAuthProvider();

const Registration = () => {
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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

    const handleRegister = (event) => {
        event.preventDefault();
        setError('');
        
        const form = event.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then(result => {
                updateProfile(result.user, {
                    displayName: name
                });
                form.reset();
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
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-400 rounded-full blur-xl"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-500 rounded-full blur-xl"></div>
                <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-yellow-400 rounded-full blur-lg"></div>
            </div>
            
            <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
                backgroundSize: '50px 50px'
            }}></div>

            <div className="relative z-10 w-full max-w-md mx-auto px-4 transition-all duration-700 ease-out">
                <div className="bg-black/40 backdrop-blur-xl border border-cyan-400/30 rounded-3xl p-8 shadow-2xl transition-all duration-700 ease-out hover:bg-black/50 hover:border-cyan-400/50 hover:shadow-cyan-400/20 hover:-translate-y-2">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent mb-4 transition-all duration-1000 ease-out hover:scale-105">
                            JOIN US!
                        </h1>
                        <p className="text-cyan-300 text-sm sm:text-base lg:text-lg font-medium transition-all duration-500 hover:text-cyan-200">Start your financial journey</p>
                        <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-pink-500 mx-auto rounded-full mt-4"></div>
                    </div>
                    
                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="form-control">
                            <div className="mb-2">
                                <span className="text-cyan-300 font-bold flex items-center gap-2"><FaUser /> Full Name</span>
                            </div>
                            <input 
                                type="text" 
                                name="name" 
                                className="input input-bordered w-full bg-black/50 border-cyan-400/50 text-white placeholder-gray-400 focus:border-cyan-400 focus:bg-black/70 focus:shadow-lg focus:shadow-cyan-400/25 transition-all duration-500 ease-out hover:border-cyan-300 hover:bg-black/60" 
                                placeholder="Enter your full name" 
                                required 
                            />
                        </div>
                        
                        <div className="form-control">
                            <div className="mb-2">
                                <span className="text-cyan-300 font-bold flex items-center gap-2"><FaEnvelope /> Email</span>
                            </div>
                            <input 
                                type="email" 
                                name="email" 
                                className="input input-bordered w-full bg-black/50 border-cyan-400/50 text-white placeholder-gray-400 focus:border-cyan-400 focus:bg-black/70 focus:shadow-lg focus:shadow-cyan-400/25 transition-all duration-500 ease-out hover:border-cyan-300 hover:bg-black/60" 
                                placeholder="Enter your email" 
                                required 
                            />
                        </div>
                        
                        <div className="form-control">
                            <div className="mb-2">
                                <span className="text-cyan-300 font-bold flex items-center gap-2"><FaLock /> Password</span>
                            </div>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    name="password" 
                                    className="input input-bordered w-full bg-black/50 border-cyan-400/50 text-white placeholder-gray-400 focus:border-cyan-400 focus:bg-black/70 focus:shadow-lg focus:shadow-cyan-400/25 transition-all duration-500 ease-out hover:border-cyan-300 hover:bg-black/60 pr-12" 
                                    placeholder="Enter your password" 
                                    required 
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400 hover:text-cyan-300 transition-all duration-300 ease-out hover:scale-125"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                        
                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
                                <span className="text-red-300 font-medium">{error}</span>
                            </div>
                        )}
                        
                        <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-500 ease-out transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/40 text-sm sm:text-base active:scale-95 flex items-center justify-center gap-3">
                            <FaRocket/> SIGN UP
                        </button>
                    </form>
                    
                    <div className="flex items-center my-6">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
                        <span className="px-4 text-cyan-300 font-bold text-sm sm:text-base">OR</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
                    </div>
                    
                    <button 
                        onClick={handleGoogleLogin}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-500 ease-out transform hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/40 mb-6 text-sm sm:text-base active:scale-95 flex items-center justify-center gap-3"
                    >
                        <FaGoogle />
                        Continue with Google
                    </button>
                    
                    <p className="text-center text-gray-300 text-sm sm:text-base">
                        Already have an account? 
                        <Link to='/login' className='text-yellow-400 hover:text-yellow-300 font-bold ml-1 transition-colors'>
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Registration;