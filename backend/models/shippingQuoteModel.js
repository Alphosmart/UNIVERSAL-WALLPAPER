const mongoose = require('mongoose');

const shippingQuoteSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    shippingCompanyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serviceType: {
        type: String,
        enum: ['standard', 'express', 'overnight', 'same_day', 'international'],
        required: true
    },
    estimatedDeliveryTime: {
        type: String,
        required: true // e.g., "2-3 days", "24 hours"
    },
    quotedPrice: {
        type: Number,
        required: true
    },
    pickupAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        coordinates: {
            latitude: Number,
            longitude: Number
        }
    },
    deliveryAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        coordinates: {
            latitude: Number,
            longitude: Number
        }
    },
    packageDetails: {
        weight: Number,
        dimensions: {
            length: Number,
            width: Number,
            height: Number
        },
        description: String,
        fragile: {
            type: Boolean,
            default: false
        }
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'expired'],
        default: 'pending'
    },
    expiresAt: {
        type: Date,
        default: function() {
            return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
        }
    },
    acceptedAt: Date,
    rejectedAt: Date,
    rejectionReason: String,
    notes: String
}, {
    timestamps: true
});

const ShippingQuote = mongoose.model('ShippingQuote', shippingQuoteSchema);

module.exports = ShippingQuote;
