import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Firebase/firebase.init';
import LoadingSpinner from './LoadingSpinner';

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
        return <LoadingSpinner fullScreen />;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default PrivateRoute;
