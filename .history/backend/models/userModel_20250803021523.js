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
    }]
}, {
    timestamps : true
})


const User = mongoose.model('User', userSchema);


module.exports = User