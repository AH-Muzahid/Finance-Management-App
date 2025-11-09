import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Firebase/firebase.init';
import { PulseLoader } from 'react-spinners';

const PrivateRoute = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 flex justify-center items-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-400 rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-500 rounded-full blur-xl animate-pulse"></div>
                </div>
                <div className="bg-black/40 backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-8 text-center">
                    <PulseLoader color="#00d4ff" size={15} margin={5} />
                    <p className="text-cyan-300 text-xl font-bold mt-4">Loading FinEase...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default PrivateRoute;
