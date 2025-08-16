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
        enum : ['GENERAL', 'ADMIN', 'SHIPPING_COMPANY'],
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
    },
    
    // Shipping Company fields
    shippingCompanyStatus: {
        type: String,
        enum: ['none', 'pending_verification', 'verified', 'rejected', 'suspended'],
        default: 'none'
    },
    companyInfo: {
        companyName: String,
        registrationNumber: String,
        licenseNumber: String,
        website: String,
        description: String,
        establishedYear: Number,
        companySize: {
            type: String,
            enum: ['1-10', '11-50', '51-200', '201-500', '500+']
        }
    },
    serviceAreas: [{
        country: String,
        states: [String],
        cities: [String],
        zipCodes: [String]
    }],
    shippingServices: [{
        serviceName: String,
        serviceType: {
            type: String,
            enum: ['standard', 'express', 'overnight', 'same_day', 'international']
        },
        deliveryTime: String, // e.g., "2-3 days", "24 hours"
        basePrice: Number,
        pricePerKm: Number,
        pricePerKg: Number,
        maxWeight: Number,
        maxDimensions: {
            length: Number,
            width: Number,
            height: Number
        }
    }],
    vehicles: [{
        vehicleType: {
            type: String,
            enum: ['bike', 'car', 'van', 'truck', 'drone']
        },
        licensePlate: String,
        capacity: {
            weight: Number,
            volume: Number
        },
        isActive: {
            type: Boolean,
            default: true
        }
    }],
    operatingHours: {
        monday: { start: String, end: String, isOpen: Boolean },
        tuesday: { start: String, end: String, isOpen: Boolean },
        wednesday: { start: String, end: String, isOpen: Boolean },
        thursday: { start: String, end: String, isOpen: Boolean },
        friday: { start: String, end: String, isOpen: Boolean },
        saturday: { start: String, end: String, isOpen: Boolean },
        sunday: { start: String, end: String, isOpen: Boolean }
    },
    ratings: {
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        totalReviews: {
            type: Number,
            default: 0
        },
        deliverySpeed: {
            type: Number,
            default: 0
        },
        reliability: {
            type: Number,
            default: 0
        },
        customerService: {
            type: Number,
            default: 0
        }
    },
    shippingStats: {
        totalDeliveries: {
            type: Number,
            default: 0
        },
        successfulDeliveries: {
            type: Number,
            default: 0
        },
        onTimeDeliveries: {
            type: Number,
            default: 0
        },
        averageDeliveryTime: Number, // in hours
        totalRevenue: {
            type: Number,
            default: 0
        }
    },
    shippingVerificationDocuments: [{
        type: {
            type: String,
            enum: ['business_license', 'tax_id', 'identity_proof', 'address_proof', 'vehicle_registration', 'insurance_certificate', 'driver_license']
        },
        url: String,
        uploadedAt: Date,
        verified: {
            type: Boolean,
            default: false
        }
    }]
}, {
    timestamps : true
})


const User = mongoose.model('User', userSchema);


module.exports = User