const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    productDetails: {
        productName: String,
        brandName: String,
        category: String,
        price: Number,
        sellingPrice: Number,
        productImage: []
    },
    quantity: {
        type: Number,
        default: 1
    },
    totalAmount: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    buyerInfo: {
        name: String,
        email: String,
        phone: String
    },
    orderNotes: String
}, {
    timestamps: true
});

const orderModel = mongoose.model('Order', orderSchema);

module.exports = orderModel;
