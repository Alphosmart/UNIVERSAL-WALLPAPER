import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaArrowUp, FaArrowDown, FaImage } from 'react-icons/fa';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import uploadImage from '../helper/uploadImage';

const BannerManagement = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentBanner, setCurrentBanner] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        desktopImage: '',
        mobileImage: '',
        linkUrl: '',
        isActive: true,
        order: 0
    });

    // Fetch all banners
    const fetchBanners = async () => {
        try {
            setLoading(true);
            const response = await fetch(SummaryApi.getAllBannersAdmin.url, {
                method: SummaryApi.getAllBannersAdmin.method,
                credentials: 'include'
            });

            const result = await response.json();

            if (result.success) {
                setBanners(result.data);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error fetching banners:', error);
            toast.error('Failed to fetch banners');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    // Handle image upload
    const handleImageUpload = async (e, imageType) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const uploadedImageUrl = await uploadImage(file);
            
            setFormData(prev => ({
                ...prev,
                [imageType]: uploadedImageUrl
            }));
            
            toast.success(`${imageType === 'desktopImage' ? 'Desktop' : 'Mobile'} image uploaded successfully`);
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.desktopImage || !formData.mobileImage) {
            toast.error('Title, desktop image, and mobile image are required');
            return;
        }

        try {
            const url = showEditModal 
                ? `${SummaryApi.updateBanner.url}/${currentBanner._id}`
                : SummaryApi.addBanner.url;
            
            const response = await fetch(url, {
                method: showEditModal ? SummaryApi.updateBanner.method : SummaryApi.addBanner.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                toast.success(result.message);
                fetchBanners();
                resetForm();
                setShowAddModal(false);
                setShowEditModal(false);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error saving banner:', error);
            toast.error('Failed to save banner');
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            desktopImage: '',
            mobileImage: '',
            linkUrl: '',
            isActive: true,
            order: 0
        });
        setCurrentBanner(null);
    };

    // Edit banner
    const handleEdit = (banner) => {
        setCurrentBanner(banner);
        setFormData({
            title: banner.title,
            description: banner.description || '',
            desktopImage: banner.desktopImage,
            mobileImage: banner.mobileImage,
            linkUrl: banner.linkUrl || '',
            isActive: banner.isActive,
            order: banner.order
        });
        setShowEditModal(true);
    };

    // Toggle banner status
    const toggleBannerStatus = async (bannerId) => {
        try {
            const response = await fetch(`${SummaryApi.toggleBannerStatus.url}/${bannerId}/toggle`, {
                method: SummaryApi.toggleBannerStatus.method,
                credentials: 'include'
            });

            const result = await response.json();

            if (result.success) {
                toast.success(result.message);
                fetchBanners();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error toggling banner status:', error);
            toast.error('Failed to update banner status');
        }
    };

    // Delete banner
    const handleDelete = async (bannerId) => {
        if (!window.confirm('Are you sure you want to delete this banner?')) return;

        try {
            const response = await fetch(`${SummaryApi.deleteBanner.url}/${bannerId}`, {
                method: SummaryApi.deleteBanner.method,
                credentials: 'include'
            });

            const result = await response.json();

            if (result.success) {
                toast.success(result.message);
                fetchBanners();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error deleting banner:', error);
            toast.error('Failed to delete banner');
        }
    };

    // Update banner order
    const updateBannerOrder = async (bannerId, newOrder) => {
        try {
            const response = await fetch(SummaryApi.updateBannersOrder.url, {
                method: SummaryApi.updateBannersOrder.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    banners: [{ bannerId, order: newOrder }]
                })
            });

            const result = await response.json();

            if (result.success) {
                fetchBanners();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error updating banner order:', error);
            toast.error('Failed to update banner order');
        }
    };

    const Modal = ({ isOpen, onClose, title, children }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-xl font-semibold">{title}</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            ✕
                        </button>
                    </div>
                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Banner Management</h1>
                <button
                    onClick={() => {
                        resetForm();
                        setShowAddModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                    <FaPlus />
                    <span>Add Banner</span>
                </button>
            </div>

            {/* Banners Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {banners.map((banner, index) => (
                    <div key={banner._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="relative">
                            <img
                                src={banner.desktopImage}
                                alt={banner.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-2 right-2 flex space-x-2">
                                <button
                                    onClick={() => toggleBannerStatus(banner._id)}
                                    className={`p-2 rounded-full ${
                                        banner.isActive 
                                            ? 'bg-green-600 text-white' 
                                            : 'bg-gray-600 text-white'
                                    }`}
                                    title={banner.isActive ? 'Active' : 'Inactive'}
                                >
                                    {banner.isActive ? <FaEye /> : <FaEyeSlash />}
                                </button>
                            </div>
                            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                                Order: {banner.order}
                            </div>
                        </div>
                        
                        <div className="p-4">
                            <h3 className="font-semibold text-lg mb-2">{banner.title}</h3>
                            {banner.description && (
                                <p className="text-gray-600 text-sm mb-3">{banner.description}</p>
                            )}
                            
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(banner)}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                                    >
                                        <FaEdit />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(banner._id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                                    >
                                        <FaTrash />
                                        <span>Delete</span>
                                    </button>
                                </div>
                                
                                <div className="flex space-x-1">
                                    {index > 0 && (
                                        <button
                                            onClick={() => updateBannerOrder(banner._id, banner.order - 1)}
                                            className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-sm"
                                            title="Move Up"
                                        >
                                            <FaArrowUp />
                                        </button>
                                    )}
                                    {index < banners.length - 1 && (
                                        <button
                                            onClick={() => updateBannerOrder(banner._id, banner.order + 1)}
                                            className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-sm"
                                            title="Move Down"
                                        >
                                            <FaArrowDown />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {banners.length === 0 && (
                <div className="text-center py-12">
                    <FaImage className="mx-auto text-gray-400 text-6xl mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No banners found</h3>
                    <p className="text-gray-500 mb-4">Get started by creating your first banner</p>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowAddModal(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                    >
                        Create First Banner
                    </button>
                </div>
            )}

            {/* Add/Edit Banner Modal */}
            <Modal
                isOpen={showAddModal || showEditModal}
                onClose={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    resetForm();
                }}
                title={showEditModal ? 'Edit Banner' : 'Add New Banner'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Desktop Image *
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 'desktopImage')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {formData.desktopImage && (
                                <img
                                    src={formData.desktopImage}
                                    alt="Desktop preview"
                                    className="mt-2 w-full h-24 object-cover rounded"
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mobile Image *
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 'mobileImage')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {formData.mobileImage && (
                                <img
                                    src={formData.mobileImage}
                                    alt="Mobile preview"
                                    className="mt-2 w-full h-24 object-cover rounded"
                                />
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Link URL (Optional)
                        </label>
                        <input
                            type="url"
                            value={formData.linkUrl}
                            onChange={(e) => setFormData({...formData, linkUrl: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://example.com"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Order
                            </label>
                            <input
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="0"
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                                className="mr-2"
                            />
                            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                                Active
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setShowAddModal(false);
                                setShowEditModal(false);
                                resetForm();
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={uploading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {uploading ? 'Uploading...' : (showEditModal ? 'Update' : 'Create')}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default BannerManagement;
