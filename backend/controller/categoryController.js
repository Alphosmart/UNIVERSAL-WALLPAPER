const Category = require('../models/categoryModel');

// Get all categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true })
            .sort({ order: 1, createdAt: 1 });

        res.json({
            success: true,
            categories,
            message: 'Categories fetched successfully'
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: error.message
        });
    }
};

// Add new category
const addCategory = async (req, res) => {
    try {
        const { name, displayName } = req.body;

        if (!name || !displayName) {
            return res.status(400).json({
                success: false,
                message: 'Category name and display name are required'
            });
        }

        // Check if category already exists
        const existingCategory = await Category.findOne({ 
            name: name.toLowerCase()
        });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Category already exists'
            });
        }

        // Get the next order number
        const lastCategory = await Category.findOne()
            .sort({ order: -1 })
            .limit(1);

        const newOrder = lastCategory ? lastCategory.order + 1 : 1;

        const category = new Category({
            name: name.toLowerCase(),
            displayName,
            order: newOrder,
            createdBy: req.userId,
            isActive: true
        });

        await category.save();

        res.status(201).json({
            success: true,
            category,
            message: 'Category added successfully'
        });
    } catch (error) {
        console.error('Add category error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding category',
            error: error.message
        });
    }
};

// Update category
const updateCategory = async (req, res) => {
    try {
        const { categoryId, name, displayName } = req.body;

        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: 'Category ID is required'
            });
        }

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // If name is being changed, check if it already exists
        if (name && name.toLowerCase() !== category.name) {
            const existingCategory = await Category.findOne({ 
                name: name.toLowerCase(),
                _id: { $ne: categoryId }
            });

            if (existingCategory) {
                return res.status(400).json({
                    success: false,
                    message: 'Category name already exists'
                });
            }
        }

        // Update fields
        if (name) category.name = name.toLowerCase();
        if (displayName) category.displayName = displayName;
        category.updatedBy = req.userId;
        category.updatedAt = new Date();

        await category.save();

        res.json({
            success: true,
            category,
            message: 'Category updated successfully'
        });
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating category',
            error: error.message
        });
    }
};

// Delete category
const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.body;

        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: 'Category ID is required'
            });
        }

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Soft delete - mark as inactive instead of removing
        category.isActive = false;
        category.deletedBy = req.userId;
        category.deletedAt = new Date();

        await category.save();

        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting category',
            error: error.message
        });
    }
};

// Reorder categories
const reorderCategories = async (req, res) => {
    try {
        const { categoryOrders } = req.body;

        if (!Array.isArray(categoryOrders)) {
            return res.status(400).json({
                success: false,
                message: 'Category orders must be an array'
            });
        }

        // Update each category's order
        const updatePromises = categoryOrders.map(({ categoryId, order }) => {
            return Category.findByIdAndUpdate(
                categoryId,
                { 
                    order: parseInt(order),
                    updatedBy: req.userId,
                    updatedAt: new Date()
                },
                { new: true }
            );
        });

        await Promise.all(updatePromises);

        res.json({
            success: true,
            message: 'Categories reordered successfully'
        });
    } catch (error) {
        console.error('Reorder categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Error reordering categories',
            error: error.message
        });
    }
};

module.exports = {
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories
};