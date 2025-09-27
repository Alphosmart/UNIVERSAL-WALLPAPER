const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    displayName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    order: {
        type: Number,
        default: 0,
        index: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    deletedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Index for efficient queries
categorySchema.index({ isActive: 1, order: 1 });
categorySchema.index({ name: 1, isActive: 1 });

// Virtual for product count (optional)
categorySchema.virtual('productCount', {
    ref: 'Product',
    localField: 'name',
    foreignField: 'category',
    count: true,
    match: { status: 'ACTIVE' }
});

// Ensure virtual fields are serialized
categorySchema.set('toJSON', { virtuals: true });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
