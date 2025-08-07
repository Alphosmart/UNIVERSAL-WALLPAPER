const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: String,
    brandName: String,
    category: String,
    productImage: [],
    description: String,
    
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
