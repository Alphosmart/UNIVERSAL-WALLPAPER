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
    },
    
    // Seller-related fields
    sellerStatus: {
        type: String,
        enum: ['none', 'pending_verification', 'verified', 'rejected'],
        default: 'none'
    },
    businessType: {
        type: String,
        enum: ['individual', 'business', 'corporation']
    },
    sellerApplicationDate: Date,
    verifiedAt: Date,
    rejectionReason: String,
    verificationDocuments: [{
        type: {
            type: String,
            enum: ['business_license', 'tax_id', 'identity_proof', 'address_proof']
        },
        url: String,
        uploadedAt: Date
    }],
    // Seller payment details
    paymentDetails: {
        bankAccount: {
            accountNumber: String,
            routingNumber: String,
            accountHolderName: String,
            bankName: String,
            accountType: {
                type: String,
                enum: ['checking', 'savings'],
                default: 'checking'
            }
        },
        paypalEmail: String,
        taxInfo: {
            ssn: String,
            ein: String,
            businessType: {
                type: String,
                enum: ['individual', 'partnership', 'corporation', 'llc'],
                default: 'individual'
            }
        }
    },
    // Seller settings
    sellerSettings: {
        payoutSchedule: {
            type: String,
            enum: ['daily', 'weekly', 'biweekly', 'monthly'],
            default: 'weekly'
        },
        minimumPayout: {
            type: Number,
            default: 25.00
        }
    }
    
    // Shipping Company fields removed - single company model
    // All shipping company related fields have been removed as the platform
    // now operates with a single company seller model
    
}, {
    timestamps : true
})


const User = mongoose.model('User', userSchema);


module.exports = User