const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    role: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    image: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    text: {
        type: String,
        required: true,
        trim: true,
        maxLength: 500
    },
    location: {
        type: String,
        trim: true,
        maxLength: 100
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    },
    featured: {
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
    }
}, {
    timestamps: true
});

// Index for efficient querying
testimonialSchema.index({ isActive: 1, order: 1 });
testimonialSchema.index({ featured: 1, isActive: 1 });

const testimonialModel = mongoose.model("testimonial", testimonialSchema);

module.exports = testimonialModel;