import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/firebase.init';

const useUser = () => {
    const [user, loading, error] = useAuthState(auth);
    const [localUser, setLocalUser] = useState(() => {
        try {
            const saved = localStorage.getItem('user');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.error("Error parsing user from localStorage", e);
            return null;
        }
    });

    useEffect(() => {
        if (user) {
            // User is logged in, update cache
            const userData = {
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                uid: user.uid,
                emailVerified: user.emailVerified,
                metadata: user.metadata,
                providerData: user.providerData
            };
            localStorage.setItem('user', JSON.stringify(userData));
            setLocalUser(userData);
        } else if (!loading && !user) {
            // Auth check finished and no user found
            localStorage.removeItem('user');
            setLocalUser(null);
        }
    }, [user, loading]);

    // If we have a localUser, we can consider loading as false for UI purposes
    // effectively masking the loading state with cached data
    const effectiveUser = localUser || user;

    return [effectiveUser, loading, error];
};

export default useUser;
