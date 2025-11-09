import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/firebase.init';
import { useTheme } from '../contexts/ThemeContext';
import { FaUser, FaEnvelope, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import LoadingSpinner from '../Components/LoadingSpinner';

const Profile = () => {
    const [user] = useAuthState(auth);
    const { isDark } = useTheme();
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
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Here you would update the user profile in Firebase
            toast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            toast.error('Failed to update profile');
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 section-padding">
            <div className="container-max">
                <div className="max-w-2xl mx-auto">
                    <h1 className="heading-primary text-white mb-12 text-center fade-in">My Profile</h1>
                    
                    <div className="card-glass p-8 slide-up">
                        {/* Profile Picture */}
                        <div className="text-center mb-8">
                            <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-white/20 flex items-center justify-center">
                                {user?.photoURL ? (
                                    <img 
                                        src={user.photoURL} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FaUser className="text-white text-4xl" />
                                )}
                            </div>
                            <h2 className="heading-secondary text-white mb-2">{user?.displayName || 'User'}</h2>
                            <p className="text-body text-gray-300">{user?.email}</p>
                        </div>

                        {/* Profile Form */}
                        <div className="content-spacing">
                            <div>
                                <label className="form-label">Display Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="displayName"
                                        value={formData.displayName}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="Enter your display name"
                                    />
                                ) : (
                                    <div className="form-input bg-white/10 cursor-not-allowed">
                                        {user?.displayName || 'Not set'}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="form-label">Email</label>
                                <div className="form-input bg-white/10 cursor-not-allowed">
                                    {user?.email}
                                </div>
                                <p className="text-small text-gray-400 mt-1">Email cannot be changed</p>
                            </div>

                            <div>
                                <label className="form-label">Photo URL</label>
                                {isEditing ? (
                                    <input
                                        type="url"
                                        name="photoURL"
                                        value={formData.photoURL}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="Enter photo URL"
                                    />
                                ) : (
                                    <div className="form-input bg-white/10 cursor-not-allowed">
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
                                            className="flex-1 btn-success flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FaTimes /> Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="w-full btn-primary flex items-center justify-center gap-2"
                                    >
                                        <FaEdit /> Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Account Information */}
                        <div className="mt-8 pt-8 border-t border-white/20">
                            <h3 className="heading-tertiary text-white mb-4">Account Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-small">
                                <div>
                                    <span className="text-gray-400">Account Created:</span>
                                    <p className="text-white">{user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'}</p>
                                </div>
                                <div>
                                    <span className="text-gray-400">Last Sign In:</span>
                                    <p className="text-white">{user?.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'Unknown'}</p>
                                </div>
                                <div>
                                    <span className="text-gray-400">Email Verified:</span>
                                    <p className={user?.emailVerified ? 'text-green-400' : 'text-red-400'}>
                                        {user?.emailVerified ? 'Yes' : 'No'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-400">Provider:</span>
                                    <p className="text-white">{user?.providerData?.[0]?.providerId || 'Email'}</p>
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