const mongoose = require('mongoose');

const emailTemplateSchema = new mongoose.Schema({
    templateType: {
        type: String,
        required: true,
        enum: ['orderConfirmation', 'passwordReset', 'contactForm', 'orderUpdate'],
        unique: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    htmlContent: {
        type: String,
        required: true
    },
    textContent: {
        type: String,
        required: false
    },
    variables: [{
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        placeholder: {
            type: String,
            required: true
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    lastModified: {
        type: Date,
        default: Date.now
    },
    modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
}, {
    timestamps: true
});

// Update lastModified on save
emailTemplateSchema.pre('save', function(next) {
    this.lastModified = new Date();
    next();
});

module.exports = mongoose.model('EmailTemplate', emailTemplateSchema);
