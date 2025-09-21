const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: String,
    brandName: String,
    category: String,
    productImage: [],
    description: String,
    
    // Social features
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who liked the product
    ratings: [{ 
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
        rating: { type: Number, min: 1, max: 5 },
        date: { type: Date, default: Date.now }
    }], // User ratings
    reviews: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        review: { type: String, required: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        date: { type: Date, default: Date.now },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Users who liked this review
    }], // User reviews
    socialShares: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        platform: { type: String, enum: ['facebook', 'twitter', 'whatsapp', 'linkedin', 'instagram'] },
        date: { type: Date, default: Date.now }
    }], // Optional: track social shares
    
    // Original price information with seller's currency
    pricing: {
        originalPrice: {
            amount: Number,
            currency: {
                type: String,
                default: 'NGN'
            }
        },
        sellingPrice: {
            amount: Number,
            currency: {
                type: String,
                default: 'NGN'
            }
        },
        // Converted prices for common currencies (cached for performance)
        convertedPrices: {
            USD: {
                originalPrice: Number,
                sellingPrice: Number,
                lastUpdated: {
                    type: Date,
                    default: Date.now
                }
            },
            EUR: {
                originalPrice: Number,
                sellingPrice: Number,
                lastUpdated: {
                    type: Date,
                    default: Date.now
                }
            },
            NGN: {
                originalPrice: Number,
                sellingPrice: Number,
                lastUpdated: {
                    type: Date,
                    default: Date.now
                }
            },
            GBP: {
                originalPrice: Number,
                sellingPrice: Number,
                lastUpdated: {
                    type: Date,
                    default: Date.now
                }
            }
        }
    },
    
    // Legacy fields for backward compatibility
    price: Number,
    sellingPrice: Number,
    
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Upload tracking - who actually uploaded this product
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    uploadedByInfo: {
        name: String,
        email: String,
        role: String, // ADMIN, STAFF, etc.
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    },
    
    // Edit tracking
    lastEditedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    lastEditedAt: {
        type: Date
    },
    editHistory: [{
        editedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        editedByInfo: {
            name: String,
            email: String,
            role: String
        },
        editedAt: {
            type: Date,
            default: Date.now
        },
        changes: {
            type: mongoose.Schema.Types.Mixed // Allow any object structure for tracking changes
        }
    }],
    
    sellerInfo: {
        name: String,
        email: String,
        currency: {
            type: String,
            default: 'NGN'
        },
        location: String,
        // Seller's preferred payment methods for this product
        acceptedPaymentMethods: {
            type: [String],
            enum: ['stripe', 'paypal', 'cashOnDelivery', 'bankTransfer', 'cryptocurrency'],
            default: ['stripe', 'paypal', 'cashOnDelivery']
        }
    },
    stock: {
        type: Number,
        default: 1
    },
    condition: {
        type: String,
        enum: ['new', 'like-new', 'good', 'fair', 'poor'],
        default: 'new'
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'SOLD', 'PENDING', 'INACTIVE'],
        default: 'ACTIVE'
    },
    location: String,
    tags: [String]
}, {
    timestamps: true
});

const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;
