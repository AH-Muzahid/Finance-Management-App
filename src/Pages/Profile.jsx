import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/firebase.init';
import { updateProfile } from 'firebase/auth';

import { FaUser, FaEnvelope, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import LoadingSpinner from '../Components/LoadingSpinner';

const Profile = () => {
    const [user] = useAuthState(auth);

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
                            <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-orange-100 dark:bg-orange-900 border-4 border-orange-500 flex items-center justify-center">
                                {user?.photoURL ? (
                                    <img 
                                        src={user.photoURL} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FaUser className="text-orange-500 text-4xl" />
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
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-black dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all"
                                        placeholder="Enter photo URL"
                                    />
                                ) : (
                                    <div className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg cursor-not-allowed text-base-content/70">
                                        {user?.photoURL || 'Not set'}
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
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
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaEdit /> Edit Profile
                                    </button>
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