import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaUser, FaBuilding, FaPhone, FaEnvelope, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaShippingFast, FaGlobe, FaPlus, FaTrash } from 'react-icons/fa';
import SummaryApi from '../common';

const ShippingCompanyProfile = () => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        companyInfo: {
            companyName: '',
            registrationNumber: '',
            licenseNumber: '',
            website: '',
            description: '',
            establishedYear: '',
            companySize: ''
        },
        serviceAreas: [],
        contactInfo: {
            address: '',
            city: '',
            state: '',
            country: '',
            postalCode: ''
        },
        businessHours: {
            monday: { open: '', close: '', closed: false },
            tuesday: { open: '', close: '', closed: false },
            wednesday: { open: '', close: '', closed: false },
            thursday: { open: '', close: '', closed: false },
            friday: { open: '', close: '', closed: false },
            saturday: { open: '', close: '', closed: false },
            sunday: { open: '', close: '', closed: true }
        }
    });

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [originalProfile, setOriginalProfile] = useState({});
    const [newServiceArea, setNewServiceArea] = useState({ city: '', state: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await fetch(SummaryApi.getShippingCompanyProfile.url, {
                method: SummaryApi.getShippingCompanyProfile.method,
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setProfile(data.data);
                    setOriginalProfile(data.data);
                } else {
                    toast.error(data.message || 'Failed to fetch profile');
                }
            } else {
                toast.error('Failed to fetch profile');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const response = await fetch(SummaryApi.updateShippingCompanyProfile.url, {
                method: SummaryApi.updateShippingCompanyProfile.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profile)
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    toast.success('Profile updated successfully');
                    setOriginalProfile(profile);
                    setIsEditing(false);
                } else {
                    toast.error(data.message || 'Failed to update profile');
                }
            } else {
                toast.error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setProfile(originalProfile);
        setIsEditing(false);
    };

    const handleInputChange = (field, value, nested = null) => {
        if (nested) {
            setProfile(prev => ({
                ...prev,
                [nested]: {
                    ...prev[nested],
                    [field]: value
                }
            }));
        } else {
            setProfile(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleAddServiceArea = () => {
        if (newServiceArea.city.trim() && newServiceArea.state.trim()) {
            setProfile(prev => ({
                ...prev,
                serviceAreas: [...(prev.serviceAreas || []), newServiceArea]
            }));
            setNewServiceArea({ city: '', state: '' });
        }
    };

    const handleRemoveServiceArea = (index) => {
        setProfile(prev => ({
            ...prev,
            serviceAreas: prev.serviceAreas.filter((_, i) => i !== index)
        }));
    };

    if (loading && !profile.name) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <FaShippingFast className="mx-auto h-12 w-12 text-blue-600 animate-spin" />
                    <p className="mt-2 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white shadow rounded-lg mb-6">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <FaShippingFast className="h-8 w-8 text-blue-600 mr-3" />
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Company Profile</h1>
                                    <p className="text-sm text-gray-500">Manage your shipping company information</p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <FaEdit className="mr-2 h-4 w-4" />
                                        Edit Profile
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleCancel}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            <FaTimes className="mr-2 h-4 w-4" />
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={loading}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                        >
                                            <FaSave className="mr-2 h-4 w-4" />
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Company Information */}
                <div className="bg-white shadow rounded-lg mb-6">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900 flex items-center">
                            <FaBuilding className="mr-2 h-5 w-5 text-gray-400" />
                            Company Information
                        </h2>
                    </div>
                    <div className="px-6 py-4">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                                <input
                                    type="text"
                                    value={profile.companyInfo?.companyName || ''}
                                    onChange={(e) => handleInputChange('companyName', e.target.value, 'companyInfo')}
                                    disabled={!isEditing}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Registration Number</label>
                                <input
                                    type="text"
                                    value={profile.companyInfo?.registrationNumber || ''}
                                    onChange={(e) => handleInputChange('registrationNumber', e.target.value, 'companyInfo')}
                                    disabled={!isEditing}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">License Number</label>
                                <input
                                    type="text"
                                    value={profile.companyInfo?.licenseNumber || ''}
                                    onChange={(e) => handleInputChange('licenseNumber', e.target.value, 'companyInfo')}
                                    disabled={!isEditing}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Website</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaGlobe className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="url"
                                        value={profile.companyInfo?.website || ''}
                                        onChange={(e) => handleInputChange('website', e.target.value, 'companyInfo')}
                                        disabled={!isEditing}
                                        className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-50"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700">Company Description</label>
                            <textarea
                                rows={4}
                                value={profile.companyInfo?.description || ''}
                                onChange={(e) => handleInputChange('description', e.target.value, 'companyInfo')}
                                disabled={!isEditing}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-50"
                                placeholder="Describe your shipping company services..."
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white shadow rounded-lg mb-6">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900 flex items-center">
                            <FaUser className="mr-2 h-5 w-5 text-gray-400" />
                            Contact Information
                        </h2>
                    </div>
                    <div className="px-6 py-4">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Contact Name</label>
                                <input
                                    type="text"
                                    value={profile.name || ''}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    disabled={!isEditing}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        value={profile.email || ''}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        disabled={!isEditing}
                                        className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaPhone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        value={profile.phone || ''}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        disabled={!isEditing}
                                        className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={profile.contactInfo?.address || ''}
                                        onChange={(e) => handleInputChange('address', e.target.value, 'contactInfo')}
                                        disabled={!isEditing}
                                        className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">City</label>
                                <input
                                    type="text"
                                    value={profile.contactInfo?.city || ''}
                                    onChange={(e) => handleInputChange('city', e.target.value, 'contactInfo')}
                                    disabled={!isEditing}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">State/Province</label>
                                <input
                                    type="text"
                                    value={profile.contactInfo?.state || ''}
                                    onChange={(e) => handleInputChange('state', e.target.value, 'contactInfo')}
                                    disabled={!isEditing}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Country</label>
                                <input
                                    type="text"
                                    value={profile.contactInfo?.country || ''}
                                    onChange={(e) => handleInputChange('country', e.target.value, 'contactInfo')}
                                    disabled={!isEditing}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                                <input
                                    type="text"
                                    value={profile.contactInfo?.postalCode || ''}
                                    onChange={(e) => handleInputChange('postalCode', e.target.value, 'contactInfo')}
                                    disabled={!isEditing}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-50"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Service Areas */}
                <div className="bg-white shadow rounded-lg mb-6">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900 flex items-center">
                            <FaMapMarkerAlt className="mr-2 h-5 w-5 text-gray-400" />
                            Service Areas
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Define the cities and states where your shipping company operates to receive relevant order quotes.
                        </p>
                    </div>
                    <div className="px-6 py-4">
                        {isEditing && (
                            <div className="mb-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">City</label>
                                        <input
                                            type="text"
                                            value={newServiceArea.city}
                                            onChange={(e) => setNewServiceArea({...newServiceArea, city: e.target.value})}
                                            placeholder="e.g., Atlanta"
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">State/Province</label>
                                        <input
                                            type="text"
                                            value={newServiceArea.state}
                                            onChange={(e) => setNewServiceArea({...newServiceArea, state: e.target.value})}
                                            placeholder="e.g., GA"
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddServiceArea}
                                    disabled={!newServiceArea.city || !newServiceArea.state}
                                    className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    <FaPlus className="mr-1 h-4 w-4" />
                                    Add Service Area
                                </button>
                            </div>
                        )}
                        
                        <div className="space-y-2">
                            {profile.serviceAreas && profile.serviceAreas.length > 0 ? (
                                profile.serviceAreas.map((area, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                                        <span className="text-sm text-gray-900">
                                            {area.city}, {area.state}
                                        </span>
                                        {isEditing && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveServiceArea(index)}
                                                className="text-red-600 hover:text-red-800 focus:outline-none"
                                            >
                                                <FaTrash className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6">
                                    <FaMapMarkerAlt className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No service areas configured</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {isEditing 
                                            ? "Add service areas to start receiving order quotes for those locations."
                                            : "Service areas define where your shipping company can pick up orders."
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingCompanyProfile;
