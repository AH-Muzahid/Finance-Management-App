import React, { useState } from 'react';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/firebase.init';
import { updateProfile } from 'firebase/auth';
import { FaUser, FaEnvelope, FaEdit, FaSave, FaTimes, FaSignOutAlt, FaCalendarAlt, FaShieldAlt, FaCamera } from 'react-icons/fa';
import toast from 'react-hot-toast';
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
        <div className="min-h-screen bg-gray-50 dark:bg-base-100 pb-12">
            {/* Header / Cover */}
            <div className="h-48 md:h-64 bg-gradient-to-r from-orange-400 to-red-500 relative">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute -bottom-16 left-0 right-0 px-4 md:px-8 max-w-6xl mx-auto flex items-end">
                    <div className="relative">
                        <div
                            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-base-200 shadow-xl overflow-hidden flex items-center justify-center bg-gray-100"
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
                                        e.target.parentElement.innerHTML = `<span class="text-white text-4xl font-bold">${getInitials(user?.displayName || user?.email || 'User')}</span>`;
                                        e.target.parentElement.style.backgroundColor = getAvatarColor(user?.displayName || user?.email || 'User');
                                    }}
                                />
                            ) : (
                                <span className="text-white text-4xl font-bold">
                                    {getInitials(user?.displayName || user?.email || 'User')}
                                </span>
                            )}
                        </div>
                        {isEditing && (
                            <div className="absolute bottom-2 right-2 bg-gray-900/70 text-white p-2 rounded-full cursor-pointer hover:bg-gray-900 transition-colors">
                                <FaCamera size={14} />
                            </div>
                        )}
                    </div>
                    <div className="mb-4 ml-4 md:ml-6 pb-2">
                        <h1 className="text-3xl md:text-4xl font-bold text-white shadow-sm drop-shadow-md">
                            {user?.displayName || 'User'}
                        </h1>
                        <p className="text-orange-50/90 font-medium text-sm md:text-base flex items-center gap-2">
                            <FaEnvelope size={12} /> {user?.email}
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-8 mt-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Stats/Meta */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-base-200 rounded-2xl shadow-lg border border-gray-100 dark:border-base-300 p-6">
                            <h3 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
                                <FaShieldAlt className="text-orange-500" /> Account Status
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-base-300/50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${user?.emailVerified ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        <span className="text-sm font-medium text-base-content/80">Email Verified</span>
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${user?.emailVerified ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                        {user?.emailVerified ? 'Verified' : 'Unverified'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-base-300/50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <FaCalendarAlt className="text-gray-400" />
                                        <span className="text-sm font-medium text-base-content/80">Joined</span>
                                    </div>
                                    <span className="text-sm font-bold text-base-content">
                                        {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-base-300/50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <FaUser className="text-gray-400" />
                                        <span className="text-sm font-medium text-base-content/80">Last Login</span>
                                    </div>
                                    <span className="text-xs text-base-content/60">
                                        {user?.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Logout Card */}
                        <div className="bg-white dark:bg-base-200 rounded-2xl shadow-lg border border-gray-100 dark:border-base-300 p-6">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-white hover:bg-red-500 border border-red-500 font-bold py-3 px-6 rounded-xl transition-all duration-300"
                            >
                                <FaSignOutAlt /> Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Edit Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-base-200 rounded-2xl shadow-lg border border-gray-100 dark:border-base-300 p-6 md:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-base-content">Personal Information</h2>
                                    <p className="text-base-content/60 text-sm">Update your personal details here.</p>
                                </div>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="text-orange-500 hover:text-orange-600 font-semibold text-sm flex items-center gap-2 hover:bg-orange-50 dark:hover:bg-orange-900/10 px-4 py-2 rounded-lg transition-colors"
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-base-content/80 mb-2">Display Name</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="displayName"
                                                value={formData.displayName}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-base-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                                                placeholder="Your Name"
                                            />
                                        ) : (
                                            <div className="text-lg font-medium text-base-content border-b border-gray-100 dark:border-base-300 pb-2">
                                                {user?.displayName || 'Not Set'}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-base-content/80 mb-2">Email Address</label>
                                        <div className="text-lg font-medium text-base-content/60 border-b border-gray-100 dark:border-base-300 pb-2 cursor-not-allowed">
                                            {user?.email}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-base-content/80 mb-2">Profile Photo URL</label>
                                    {isEditing ? (
                                        <input
                                            type="url"
                                            name="photoURL"
                                            value={formData.photoURL}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-base-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none text-sm"
                                            placeholder="https://example.com/photo.jpg"
                                        />
                                    ) : (
                                        <div className="text-base text-base-content/60 truncate border-b border-gray-100 dark:border-base-300 pb-2">
                                            {user?.photoURL || 'No photo URL set'}
                                        </div>
                                    )}
                                </div>

                                {isEditing && (
                                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-700 mt-6 animate-fade-in-up">
                                        <button
                                            onClick={handleSave}
                                            disabled={loading}
                                            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-orange-500/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {loading ? <span className="loading loading-spinner loading-sm"></span> : <FaSave />} Save Changes
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            disabled={loading}
                                            className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-70"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;