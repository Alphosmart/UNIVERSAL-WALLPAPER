const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: String,
    brandName: String,
    category: String,
    productImage: [],
    description: String,
    price: Number,
    sellingPrice: Number,
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sellerInfo: {
        name: String,
        email: String
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
        enum: ['available', 'sold', 'pending'],
        default: 'available'
    },
    location: String,
    tags: [String]
}, {
    timestamps: true
});

const productModel = mongoose.model('product', productSchema);

module.exports = productModel;
