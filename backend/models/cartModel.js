const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    sellingPrice: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    productImage: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        default: ''
    },
    brandName: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [cartItemSchema],
    lastModified: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Update lastModified on save
cartSchema.pre('save', function(next) {
    this.lastModified = new Date();
    next();
});

// Virtual for total cart value
cartSchema.virtual('totalValue').get(function() {
    return this.items.reduce((total, item) => {
        return total + (item.sellingPrice * item.quantity);
    }, 0);
});

// Virtual for total items count
cartSchema.virtual('totalItems').get(function() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Include virtuals in JSON output
cartSchema.set('toJSON', { virtuals: true });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
