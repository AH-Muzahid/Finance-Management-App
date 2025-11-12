import React, { useState } from 'react';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/firebase.init';
import { updateProfile } from 'firebase/auth';

import { FaUser, FaEnvelope, FaEdit, FaSave, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import LoadingSpinner from '../Components/LoadingSpinner';
import Swal from 'sweetalert2';

const Profile = () => {
    const [user] = useAuthState(auth);
    const [signOut] = useSignOut(auth);

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        displayName: user?.displayName || '',
        email: user?.email || '',
        photoURL: user?.photoURL || ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateProfile(auth.currentUser, {
                displayName: formData.displayName,
                photoURL: formData.photoURL
            });
            toast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            toast.error('Failed to update profile: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            displayName: user?.displayName || '',
            email: user?.email || '',
            photoURL: user?.photoURL || ''
        });
        setIsEditing(false);
    };

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will be logged out of your account',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f97316',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout!'
        });

        if (result.isConfirmed) {
            const success = await signOut();
            if (success) {
                Swal.fire({
                    title: 'Logged out!',
                    text: 'You have been successfully logged out.',
                    icon: 'success',
                    confirmButtonColor: '#f97316'
                });
            }
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        const words = name.trim().split(' ');
        if (words.length === 1) {
            return words[0].charAt(0).toUpperCase();
        }
        return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    };

    const getAvatarColor = (name) => {
        const colors = ['#f97316', '#10B981', '#EF4444', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899'];
        if (!name) return colors[0];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-base-100 pt-20 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaUser className="text-white text-xl" />
                        </div>
                        <h1 className="text-3xl font-bold text-base-content mb-2">My Profile</h1>
                        <p className="text-base-content/70">Manage your account information</p>
                    </div>
                    
                    <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg border border-gray-100 dark:border-base-300 p-8">
                        {/* Profile Picture */}
                        <div className="text-center mb-8">
                            <div 
                                className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-orange-500 flex items-center justify-center"
                                style={{ 
                                    backgroundColor: user?.photoURL ? '#f3f4f6' : getAvatarColor(user?.displayName || user?.email || 'User')
                                }}
                            >
                                {user?.photoURL ? (
                                    <img 
                                        src={user.photoURL} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = `<span class="text-orange-600 text-3xl font-bold">${getInitials(user?.displayName || user?.email || 'User')}</span>`;
                                            e.target.parentElement.style.backgroundColor = getAvatarColor(user?.displayName || user?.email || 'User');
                                        }}
                                    />
                                ) : (
                                    <span className="text-white text-3xl font-bold">
                                        {getInitials(user?.displayName || user?.email || 'User')}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-2xl font-bold text-base-content mb-2">{user?.displayName || 'User'}</h2>
                            <p className="text-base-content/70">{user?.email}</p>
                        </div>

                        {/* Profile Form */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-base-content mb-2">Display Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="displayName"
                                        value={formData.displayName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-black dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all"
                                        placeholder="Enter your display name"
                                    />
                                ) : (
                                    <div className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg cursor-not-allowed text-base-content/70">
                                        {user?.displayName || 'Not set'}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-base-content mb-2">Email</label>
                                <div className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg cursor-not-allowed text-base-content/70">
                                    {user?.email}
                                </div>
                                <p className="text-sm text-base-content/50 mt-1">Email cannot be changed</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-base-content mb-2">Photo URL</label>
                                {isEditing ? (
                                    <input
                                        type="url"
                                        name="photoURL"
                                        value={formData.photoURL}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-black dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all overflow-hidden"
                                        placeholder="Enter photo URL"
                                    />
                                ) : (
                                    <div className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg cursor-not-allowed text-base-content/70 break-all overflow-hidden">
                                        {user?.photoURL || 'Not set'}
                                    </div>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4 pt-6">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            disabled={loading}
                                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <>
                                                    <LoadingSpinner size="sm" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <FaSave /> Save Changes
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            disabled={loading}
                                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FaTimes /> Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                        >
                                            <FaEdit /> Edit Profile
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                        >
                                            <FaSignOutAlt /> Logout
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Account Information */}
                        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-base-content mb-4">Account Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-base-content/70">Account Created:</span>
                                    <p className="text-base-content">{user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'}</p>
                                </div>
                                <div>
                                    <span className="text-base-content/70">Last Sign In:</span>
                                    <p className="text-base-content">{user?.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'Unknown'}</p>
                                </div>
                                <div>
                                    <span className="text-base-content/70">Email Verified:</span>
                                    <p className={user?.emailVerified ? 'text-green-600' : 'text-red-600'}>
                                        {user?.emailVerified ? 'Yes' : 'No'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-base-content/70">Provider:</span>
                                    <p className="text-base-content">{user?.providerData?.[0]?.providerId || 'Email'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;