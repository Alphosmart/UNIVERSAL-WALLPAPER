import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaStar } from 'react-icons/fa';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import uploadImage from '../helper/uploadImage';

const TestimonialsManagement = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentTestimonial, setCurrentTestimonial] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        role: '',
        image: '',
        rating: 5,
        text: '',
        location: '',
        isActive: true,
        featured: false,
        order: 0
    });

    // Fetch all testimonials
    const fetchTestimonials = async () => {
        try {
            setLoading(true);
            const response = await fetch(SummaryApi.adminGetAllTestimonials.url, {
                method: SummaryApi.adminGetAllTestimonials.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (data.success) {
                setTestimonials(data.data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching testimonials:', error);
            toast.error('Failed to fetch testimonials');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    // Handle image upload
    const handleUploadImage = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploading(true);
            try {
                const uploadImageCloudinary = await uploadImage(file);
                setFormData(prev => ({
                    ...prev,
                    image: uploadImageCloudinary.url
                }));
                toast.success('Image uploaded successfully');
            } catch (error) {
                console.error('Image upload error:', error);
                toast.error('Failed to upload image');
            } finally {
                setUploading(false);
            }
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            role: '',
            image: '',
            rating: 5,
            text: '',
            location: '',
            isActive: true,
            featured: false,
            order: 0
        });
        setCurrentTestimonial(null);
    };

    // Handle add testimonial
    const handleAdd = () => {
        resetForm();
        setShowAddModal(true);
    };

    // Handle edit testimonial
    const handleEdit = (testimonial) => {
        setFormData({
            name: testimonial.name,
            role: testimonial.role,
            image: testimonial.image,
            rating: testimonial.rating,
            text: testimonial.text,
            location: testimonial.location || '',
            isActive: testimonial.isActive,
            featured: testimonial.featured,
            order: testimonial.order
        });
        setCurrentTestimonial(testimonial);
        setShowEditModal(true);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.role || !formData.text || !formData.image) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            let response;
            
            if (showEditModal) {
                // Update testimonial
                response = await fetch(`${SummaryApi.adminUpdateTestimonial.url}/${currentTestimonial._id}`, {
                    method: SummaryApi.adminUpdateTestimonial.method,
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
            } else {
                // Add testimonial
                response = await fetch(SummaryApi.adminAddTestimonial.url, {
                    method: SummaryApi.adminAddTestimonial.method,
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
            }

            const data = await response.json();
            
            if (data.success) {
                toast.success(data.message);
                fetchTestimonials();
                setShowAddModal(false);
                setShowEditModal(false);
                resetForm();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error saving testimonial:', error);
            toast.error('Failed to save testimonial');
        }
    };

    // Handle delete
    const handleDelete = async (testimonialId) => {
        if (!window.confirm('Are you sure you want to delete this testimonial?')) {
            return;
        }

        try {
            const response = await fetch(`${SummaryApi.adminDeleteTestimonial.url}/${testimonialId}`, {
                method: SummaryApi.adminDeleteTestimonial.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            if (data.success) {
                toast.success(data.message);
                fetchTestimonials();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error deleting testimonial:', error);
            toast.error('Failed to delete testimonial');
        }
    };

    // Handle toggle status
    const handleToggleStatus = async (testimonialId) => {
        try {
            const response = await fetch(`${SummaryApi.adminToggleTestimonialStatus.url}/${testimonialId}/toggle`, {
                method: SummaryApi.adminToggleTestimonialStatus.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            if (data.success) {
                toast.success(data.message);
                fetchTestimonials();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error toggling testimonial status:', error);
            toast.error('Failed to toggle testimonial status');
        }
    };

    // Render stars
    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <FaStar 
                key={i} 
                className={`${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
            />
        ));
    };

    // Modal Component
    const Modal = ({ isOpen, onClose, title, children }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-xl font-semibold">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-2xl"
                        >
                            ×
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
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Testimonials Management</h1>
                    <p className="text-gray-600 mt-1">Manage customer testimonials and reviews</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
                >
                    <FaPlus />
                    <span>Add Testimonial</span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-2xl font-bold text-blue-600">{testimonials.length}</div>
                    <div className="text-sm text-gray-600">Total Testimonials</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-2xl font-bold text-green-600">
                        {testimonials.filter(t => t.isActive).length}
                    </div>
                    <div className="text-sm text-gray-600">Active Testimonials</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-2xl font-bold text-yellow-600">
                        {testimonials.filter(t => t.featured).length}
                    </div>
                    <div className="text-sm text-gray-600">Featured Testimonials</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-2xl font-bold text-purple-600">
                        {testimonials.filter(t => t.rating === 5).length}
                    </div>
                    <div className="text-sm text-gray-600">5-Star Reviews</div>
                </div>
            </div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                    <div key={testimonial._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-6">
                            {/* Header with image and status */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <div className="font-semibold text-gray-800">{testimonial.name}</div>
                                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {testimonial.featured && (
                                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                                            Featured
                                        </span>
                                    )}
                                    <button
                                        onClick={() => handleToggleStatus(testimonial._id)}
                                        className={`p-1 rounded ${
                                            testimonial.isActive 
                                                ? 'text-green-600 hover:bg-green-100' 
                                                : 'text-gray-400 hover:bg-gray-100'
                                        }`}
                                        title={testimonial.isActive ? 'Active' : 'Inactive'}
                                    >
                                        {testimonial.isActive ? <FaEye /> : <FaEyeSlash />}
                                    </button>
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center space-x-1 mb-3">
                                {renderStars(testimonial.rating)}
                                <span className="text-sm text-gray-600 ml-2">({testimonial.rating}/5)</span>
                            </div>

                            {/* Testimonial Text */}
                            <p className="text-gray-700 mb-4 line-clamp-3">"{testimonial.text}"</p>

                            {/* Location */}
                            {testimonial.location && (
                                <p className="text-sm text-gray-500 mb-4">📍 {testimonial.location}</p>
                            )}

                            {/* Actions */}
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(testimonial)}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                                    >
                                        <FaEdit />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(testimonial._id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                                    >
                                        <FaTrash />
                                        <span>Delete</span>
                                    </button>
                                </div>
                                <div className="text-sm text-gray-500">
                                    Order: {testimonial.order}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {testimonials.length === 0 && (
                <div className="text-center py-12">
                    <FaStar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No testimonials yet</h3>
                    <p className="text-gray-600 mb-4">Start by adding your first customer testimonial.</p>
                    <button
                        onClick={handleAdd}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    >
                        Add Testimonial
                    </button>
                </div>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={showAddModal || showEditModal}
                onClose={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    resetForm();
                }}
                title={showEditModal ? 'Edit Testimonial' : 'Add New Testimonial'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Customer Name *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role/Title *
                        </label>
                        <input
                            type="text"
                            value={formData.role}
                            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                            placeholder="e.g., Interior Designer, Homeowner, Business Owner"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location (Optional)
                        </label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="e.g., New York, NY"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Profile Image *
                        </label>
                        <div className="flex items-center space-x-4">
                            {formData.image && (
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                            )}
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleUploadImage}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {uploading && <p className="text-sm text-blue-600 mt-1">Uploading...</p>}
                            </div>
                        </div>
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rating *
                        </label>
                        <select
                            value={formData.rating}
                            onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value={5}>⭐⭐⭐⭐⭐ (5 stars)</option>
                            <option value={4}>⭐⭐⭐⭐ (4 stars)</option>
                            <option value={3}>⭐⭐⭐ (3 stars)</option>
                            <option value={2}>⭐⭐ (2 stars)</option>
                            <option value={1}>⭐ (1 star)</option>
                        </select>
                    </div>

                    {/* Testimonial Text */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Testimonial Text *
                        </label>
                        <textarea
                            value={formData.text}
                            onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                            rows={4}
                            maxLength={500}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter the customer's testimonial..."
                            required
                        />
                        <p className="text-sm text-gray-500 mt-1">{formData.text.length}/500 characters</p>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Display Order
                            </label>
                            <input
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                className="mr-2"
                            />
                            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                                Active
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="featured"
                                checked={formData.featured}
                                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                                className="mr-2"
                            />
                            <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                                Featured
                            </label>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-end space-x-3 pt-6">
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

export default TestimonialsManagement;