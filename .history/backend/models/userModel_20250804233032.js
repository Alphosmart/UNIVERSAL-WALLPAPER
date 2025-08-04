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
        enum : ['GENERAL', 'ADMIN'],
        default : 'GENERAL'
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
}, {
    timestamps : true
})


const User = mongoose.model('User', userSchema);


module.exports = User