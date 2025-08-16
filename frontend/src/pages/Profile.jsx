import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import uploadImage from '../helper/uploadImage';

const Profile = () => {
    const user = useSelector(state => state?.user?.user);
    
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        profilePic: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
        }
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                profilePic: user.profilePic || '',
                address: {
                    street: user.address?.street || '',
                    city: user.address?.city || '',
                    state: user.address?.state || '',
                    zipCode: user.address?.zipCode || '',
                    country: user.address?.country || ''
                }
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setProfileData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setProfileData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast.error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        setUploadingImage(true);
        
        try {
            const uploadResponse = await uploadImage(file);
            
            if (uploadResponse.url) {
                // Update profile picture immediately
                const response = await fetch(SummaryApi.uploadProfilePicture.url, {
                    method: SummaryApi.uploadProfilePicture.method,
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        profilePic: uploadResponse.url
                    })
                });

                const data = await response.json();

                if (data.success) {
                    setProfileData(prev => ({
                        ...prev,
                        profilePic: uploadResponse.url
                    }));
                    toast.success('Profile picture updated successfully!');
                    
                    // Refresh page to update user state
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    toast.error(data.message || 'Failed to update profile picture');
                }
            } else {
                toast.error('Failed to upload image to cloud storage');
            }
        } catch (error) {
            console.error('Image upload error:', error);
            toast.error('Error uploading image. Please try again.');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!profileData.name.trim()) {
            toast.error('Name is required');
            return;
        }

        setLoading(true);
        
        try {
            const updatePayload = {
                name: profileData.name.trim(),
                phone: profileData.phone,
                address: profileData.address
            };

            // Include password change if provided
            if (showPasswordChange && passwordData.currentPassword && passwordData.newPassword) {
                if (passwordData.newPassword !== passwordData.confirmPassword) {
                    toast.error('New passwords do not match');
                    setLoading(false);
                    return;
                }
                
                if (passwordData.newPassword.length < 6) {
                    toast.error('New password must be at least 6 characters long');
                    setLoading(false);
                    return;
                }

                updatePayload.currentPassword = passwordData.currentPassword;
                updatePayload.newPassword = passwordData.newPassword;
            }

            const response = await fetch(SummaryApi.updateProfile.url, {
                method: SummaryApi.updateProfile.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatePayload)
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Profile updated successfully!');
                setIsEditing(false);
                setShowPasswordChange(false);
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                
                // Refresh page to update user state
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                toast.error(data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            toast.error('Error updating profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset to original user data
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                profilePic: user.profilePic || '',
                address: {
                    street: user.address?.street || '',
                    city: user.address?.city || '',
                    state: user.address?.state || '',
                    zipCode: user.address?.zipCode || '',
                    country: user.address?.country || ''
                }
            });
        }
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setIsEditing(false);
        setShowPasswordChange(false);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
                    <p className="text-gray-600">You need to be logged in to view your profile.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold">My Profile</h1>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-100 transition-colors"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Profile Picture Section */}
                        <div className="flex items-center mb-8">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                                    {profileData.profilePic ? (
                                        <img
                                            src={profileData.profilePic}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 text-white text-2xl font-bold">
                                            {profileData.name.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                    )}
                                </div>
                                
                                {isEditing && (
                                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            disabled={uploadingImage}
                                        />
                                        {uploadingImage ? (
                                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </label>
                                )}
                            </div>
                            
                            <div className="ml-6">
                                <h2 className="text-xl font-semibold text-gray-900">{profileData.name || 'User'}</h2>
                                <p className="text-gray-600">{profileData.email}</p>
                                <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full mt-1">
                                    {user.role || 'GENERAL'}
                                </span>
                            </div>
                        </div>

                        {/* Profile Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={profileData.name}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={profileData.email}
                                        disabled
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={profileData.phone}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                    />
                                </div>
                            </div>

                            {/* Address Information */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Street Address
                                        </label>
                                        <input
                                            type="text"
                                            name="address.street"
                                            value={profileData.address.street}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                name="address.city"
                                                value={profileData.address.city}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                State
                                            </label>
                                            <input
                                                type="text"
                                                name="address.state"
                                                value={profileData.address.state}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                ZIP Code
                                            </label>
                                            <input
                                                type="text"
                                                name="address.zipCode"
                                                value={profileData.address.zipCode}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Country
                                            </label>
                                            <input
                                                type="text"
                                                name="address.country"
                                                value={profileData.address.country}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Password Change Section */}
                            {isEditing && (
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswordChange(!showPasswordChange)}
                                            className="text-sm text-blue-600 hover:text-blue-700"
                                        >
                                            {showPasswordChange ? 'Cancel Password Change' : 'Change Password'}
                                        </button>
                                    </div>

                                    {showPasswordChange && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Current Password
                                                </label>
                                                <input
                                                    type="password"
                                                    name="currentPassword"
                                                    value={passwordData.currentPassword}
                                                    onChange={handlePasswordChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    name="newPassword"
                                                    value={passwordData.newPassword}
                                                    onChange={handlePasswordChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Confirm New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={passwordData.confirmPassword}
                                                    onChange={handlePasswordChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Action Buttons */}
                            {isEditing && (
                                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        disabled={loading}
                                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <div className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Updating...
                                            </div>
                                        ) : (
                                            'Save Changes'
                                        )}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
