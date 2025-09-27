const mongoose = require('mongoose');

const shippingZoneSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    countries: [{
        type: String,
        required: true
    }],
    rates: [{
        name: {
            type: String,
            required: true
        },
        description: String,
        calculation: {
            type: String,
            enum: ['flat_rate', 'per_item', 'weight_based', 'percentage'],
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        minAmount: {
            type: Number,
            default: 0
        },
        maxAmount: {
            type: Number
        },
        freeShippingThreshold: {
            type: Number,
            default: 0 // 0 means no free shipping
        },
        isActive: {
            type: Boolean,
            default: true
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const globalShippingSettingsSchema = new mongoose.Schema({
    globalSettings: {
        enableShipping: {
            type: Boolean,
            default: true
        },
        defaultTaxRate: {
            type: Number,
            default: 0.08 // 8%
        },
        currency: {
            type: String,
            default: 'USD'
        },
        weightUnit: {
            type: String,
            enum: ['kg', 'lb'],
            default: 'kg'
        },
        freeShippingGlobal: {
            type: Number,
            default: 0 // Global free shipping threshold
        }
    },
    restrictedCountries: [{
        country: String,
        reason: String
    }]
}, {
    timestamps: true
});

const ShippingZone = mongoose.model('ShippingZone', shippingZoneSchema);
const GlobalShippingSettings = mongoose.model('GlobalShippingSettings', globalShippingSettingsSchema);

module.exports = {
    ShippingZone,
    GlobalShippingSettings
};
