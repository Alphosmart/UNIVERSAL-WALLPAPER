const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    shippingQuoteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShippingQuote',
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
    deliveryStatus: {
        type: String,
        enum: ['assigned', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned'],
        default: 'assigned'
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // If the shipping company has driver accounts
    },
    vehicleId: String, // Reference to vehicle from shipping company's vehicles array
    pickupScheduled: Date,
    pickedUpAt: Date,
    estimatedDeliveryAt: Date,
    deliveredAt: Date,
    actualDeliveryTime: Number, // in hours
    realTimeLocation: {
        latitude: Number,
        longitude: Number,
        lastUpdated: Date
    },
    deliveryAttempts: [{
        attemptDate: Date,
        status: {
            type: String,
            enum: ['successful', 'failed', 'customer_not_available', 'address_issue']
        },
        notes: String,
        photo: String // proof of delivery photo
    }],
    deliveryProof: {
        signature: String, // Digital signature or photo
        photo: String, // Photo of delivered package
        recipientName: String,
        deliveryNotes: String
    },
    cost: {
        quotedAmount: Number,
        actualAmount: Number,
        currency: {
            type: String,
            default: 'NGN'
        }
    },
    feedback: {
        buyerRating: {
            type: Number,
            min: 1,
            max: 5
        },
        buyerComment: String,
        sellerRating: {
            type: Number,
            min: 1,
            max: 5
        },
        sellerComment: String
    },
    issues: [{
        reportedBy: {
            type: String,
            enum: ['buyer', 'seller', 'shipping_company']
        },
        issueType: {
            type: String,
            enum: ['damage', 'delay', 'lost_package', 'wrong_address', 'other']
        },
        description: String,
        reportedAt: Date,
        resolved: {
            type: Boolean,
            default: false
        },
        resolution: String,
        resolvedAt: Date
    }],
    timeline: [{
        status: String,
        timestamp: Date,
        location: {
            name: String,
            coordinates: {
                latitude: Number,
                longitude: Number
            }
        },
        notes: String,
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }]
}, {
    timestamps: true
});

// Add index for efficient querying
deliverySchema.index({ orderId: 1 });
deliverySchema.index({ shippingCompanyId: 1 });
deliverySchema.index({ deliveryStatus: 1 });
deliverySchema.index({ createdAt: -1 });

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = Delivery;
