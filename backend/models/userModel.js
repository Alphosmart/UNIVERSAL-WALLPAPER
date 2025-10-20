const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name : String,
    email : {
        type : String,
        unique : true,
        required : true,
    },
    password : String,
    profilePic : String,
    phone : String,
    address : {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    // User preferences
    preferences: {
        currency: {
            type: String,
            default: 'NGN'
        },
        language: {
            type: String,
            default: 'en'
        },
        timezone: {
            type: String,
            default: 'Africa/Lagos'
        }
    },
    role : {
        type : String,
        enum : ['GENERAL', 'STAFF', 'ADMIN'], // Added 'STAFF' role for company staff members
        default : 'GENERAL'
    },
    
    // Staff permissions and tracking
    permissions: {
        canUploadProducts: {
            type: Boolean,
            default: false
        },
        canEditProducts: {
            type: Boolean,
            default: false
        },
        canDeleteProducts: {
            type: Boolean,
            default: false
        },
        canManageOrders: {
            type: Boolean,
            default: false
        },
        grantedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        grantedAt: {
            type: Date
        }
    },
    
    // Staff upload tracking
    uploadStats: {
        totalProductsUploaded: {
            type: Number,
            default: 0
        },
        lastUploadDate: {
            type: Date
        },
        productsThisMonth: {
            type: Number,
            default: 0
        }
    }
    
}, {
    timestamps : true
})


const User = mongoose.model('User', userSchema);


module.exports = User