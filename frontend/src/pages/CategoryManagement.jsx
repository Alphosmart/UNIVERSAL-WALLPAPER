import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import SummaryApi from '../common';
import productCategory from '../helper/productCategory';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editingValue, setEditingValue] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchCategories = useCallback(async () => {
        // Default categories that come with the system - use productCategory helper
        const defaultCategories = productCategory.map(cat => cat.label.toLowerCase().replace(/\s+/g, '-'));
        
        try {
            setLoading(true);
            const response = await fetch(SummaryApi.adminCategories.url, {
                method: SummaryApi.adminCategories.method,
                credentials: 'include'
            });
            
            const data = await response.json();
            
            if (data.success) {
                // If no categories exist, use default categories
                if (!data.categories || data.categories.length === 0) {
                    setCategories(defaultCategories.map((cat, index) => ({
                        _id: `default-${index}`,
                        name: cat,
                        displayName: formatCategoryName(cat),
                        isDefault: true,
                        order: index
                    })));
                } else {
                    setCategories(data.categories);
                }
            } else {
                // Fallback to default categories if API fails
                setCategories(defaultCategories.map((cat, index) => ({
                    _id: `default-${index}`,
                    name: cat,
                    displayName: formatCategoryName(cat),
                    isDefault: true,
                    order: index
                })));
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Fallback to default categories
            setCategories(defaultCategories.map((cat, index) => ({
                _id: `default-${index}`,
                name: cat,
                displayName: formatCategoryName(cat),
                isDefault: true,
                order: index
            })));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const formatCategoryName = (name) => {
        return name.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    const slugifyCategory = (name) => {
        return name.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const handleAddCategory = async () => {
        if (!newCategory.trim()) {
            toast.error('Category name is required');
            return;
        }

        const slugifiedName = slugifyCategory(newCategory);
        
        // Check if category already exists
        if (categories.some(cat => cat.name === slugifiedName)) {
            toast.error('Category already exists');
            return;
        }

        try {
            const response = await fetch(SummaryApi.addCategory.url, {
                method: SummaryApi.addCategory.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: slugifiedName,
                    displayName: newCategory.trim()
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Category added successfully');
                setNewCategory('');
                setShowAddForm(false);
                fetchCategories();
            } else {
                toast.error(data.message || 'Failed to add category');
            }
        } catch (error) {
            console.error('Error adding category:', error);
            toast.error('Error adding category');
        }
    };

    const handleEditCategory = (category) => {
        setEditingId(category._id);
        setEditingValue(category.displayName);
    };

    const handleSaveEdit = async (categoryId) => {
        if (!editingValue.trim()) {
            toast.error('Category name cannot be empty');
            return;
        }

        const slugifiedName = slugifyCategory(editingValue);
        
        try {
            const response = await fetch(SummaryApi.updateCategory.url, {
                method: SummaryApi.updateCategory.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    categoryId,
                    name: slugifiedName,
                    displayName: editingValue.trim()
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Category updated successfully');
                setEditingId(null);
                setEditingValue('');
                fetchCategories();
            } else {
                toast.error(data.message || 'Failed to update category');
            }
        } catch (error) {
            console.error('Error updating category:', error);
            toast.error('Error updating category');
        }
    };

    const handleDeleteCategory = async (categoryId, categoryName) => {
        if (window.confirm(`Are you sure you want to delete "${categoryName}"? This action cannot be undone.`)) {
            try {
                const response = await fetch(SummaryApi.deleteCategory.url, {
                    method: SummaryApi.deleteCategory.method,
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ categoryId })
                });

                const data = await response.json();

                if (data.success) {
                    toast.success('Category deleted successfully');
                    fetchCategories();
                } else {
                    toast.error(data.message || 'Failed to delete category');
                }
            } catch (error) {
                console.error('Error deleting category:', error);
                toast.error('Error deleting category');
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingValue('');
    };

    const handleMoveUp = async (categoryId, currentIndex) => {
        if (currentIndex === 0) return; // Already at top

        const newCategories = [...categories];
        // Swap with previous item
        [newCategories[currentIndex], newCategories[currentIndex - 1]] = 
        [newCategories[currentIndex - 1], newCategories[currentIndex]];
        
        setCategories(newCategories);
        await saveReorder(newCategories);
    };

    const handleMoveDown = async (categoryId, currentIndex) => {
        if (currentIndex === categories.length - 1) return; // Already at bottom

        const newCategories = [...categories];
        // Swap with next item
        [newCategories[currentIndex], newCategories[currentIndex + 1]] = 
        [newCategories[currentIndex + 1], newCategories[currentIndex]];
        
        setCategories(newCategories);
        await saveReorder(newCategories);
    };

    const saveReorder = async (reorderedCategories) => {
        try {
            const categoryOrders = reorderedCategories.map((category, index) => ({
                categoryId: category._id,
                order: index + 1
            }));

            const response = await fetch(SummaryApi.reorderCategories.url, {
                method: SummaryApi.reorderCategories.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ categoryOrders })
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Category order updated successfully');
            } else {
                toast.error(data.message || 'Failed to update category order');
                // Revert on error
                fetchCategories();
            }
        } catch (error) {
            console.error('Error reordering categories:', error);
            toast.error('Error updating category order');
            // Revert on error
            fetchCategories();
        }
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
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Category Management</h1>
                    <p className="text-gray-600 mt-2">Manage product categories for your store</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                    <FaPlus />
                    <span>Add Category</span>
                </button>
            </div>

            {/* Add Category Form */}
            {showAddForm && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Category</h3>
                    <div className="flex space-x-4">
                        <input
                            type="text"
                            placeholder="Enter category name (e.g., Wall Paint, Decorative Items)"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                        />
                        <button
                            onClick={handleAddCategory}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
                        >
                            <FaSave />
                            <span>Add</span>
                        </button>
                        <button
                            onClick={() => {
                                setShowAddForm(false);
                                setNewCategory('');
                            }}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
                        >
                            <FaTimes />
                            <span>Cancel</span>
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        Category names will be automatically formatted (e.g., "Wall Paint" becomes "wall-paint")
                    </p>
                </div>
            )}

            {/* Categories List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Product Categories ({categories.length})
                    </h3>
                </div>

                <div className="divide-y divide-gray-200">
                    {categories.map((category, index) => (
                        <div key={category._id} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="flex flex-col space-y-1">
                                        <button
                                            onClick={() => handleMoveUp(category._id, index)}
                                            disabled={index === 0}
                                            className={`p-1 rounded ${
                                                index === 0 
                                                    ? 'text-gray-300 cursor-not-allowed' 
                                                    : 'text-gray-600 hover:bg-gray-200 cursor-pointer'
                                            }`}
                                            title="Move up"
                                        >
                                            <FaArrowUp size={12} />
                                        </button>
                                        <button
                                            onClick={() => handleMoveDown(category._id, index)}
                                            disabled={index === categories.length - 1}
                                            className={`p-1 rounded ${
                                                index === categories.length - 1
                                                    ? 'text-gray-300 cursor-not-allowed' 
                                                    : 'text-gray-600 hover:bg-gray-200 cursor-pointer'
                                            }`}
                                            title="Move down"
                                        >
                                            <FaArrowDown size={12} />
                                        </button>
                                    </div>
                                    <div className="flex flex-col">
                                        {editingId === category._id ? (
                                            <input
                                                type="text"
                                                value={editingValue}
                                                onChange={(e) => setEditingValue(e.target.value)}
                                                className="text-lg font-medium text-gray-900 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(category._id)}
                                            />
                                        ) : (
                                            <>
                                                <span className="text-lg font-medium text-gray-900">
                                                    {category.displayName}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    Slug: {category.name}
                                                    {category.isDefault && (
                                                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">
                                                            Default
                                                        </span>
                                                    )}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    {editingId === category._id ? (
                                        <>
                                            <button
                                                onClick={() => handleSaveEdit(category._id)}
                                                className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                                                title="Save changes"
                                            >
                                                <FaSave />
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                                title="Cancel editing"
                                            >
                                                <FaTimes />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleEditCategory(category)}
                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                                                title="Edit category"
                                            >
                                                <FaEdit />
                                            </button>
                                            {!category.isDefault && (
                                                <button
                                                    onClick={() => handleDeleteCategory(category._id, category.displayName)}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                                                    title="Delete category"
                                                >
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {categories.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        <p>No categories found. Add your first category to get started.</p>
                    </div>
                )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">📝 Category Management Tips</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Categories marked as "Default" cannot be deleted but can be edited</li>
                    <li>• Category names are automatically converted to URL-friendly slugs</li>
                    <li>• Deleting a category will not delete products, but they will lose their category assignment</li>
                    <li>• Categories are used in product forms, search filters, and navigation</li>
                </ul>
            </div>
        </div>
    );
};

export default CategoryManagement;