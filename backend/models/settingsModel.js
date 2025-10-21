const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    // System identifier - only one settings document should exist
    systemId: {
        type: String,
        unique: true,
        default: 'main_settings'
    },
    
    // General settings
    general: {
        siteName: {
            type: String,
            default: 'AshAmSmart'
        },
        siteDescription: {
            type: String,
            default: 'Your trusted e-commerce marketplace for quality products'
        },
        maintenanceMode: {
            type: Boolean,
            default: false
        },
        allowRegistration: {
            type: Boolean,
            default: true
        },
        defaultLanguage: {
            type: String,
            default: 'en'
        },
        timezone: {
            type: String,
            default: 'Africa/Lagos'
        },
        currency: {
            type: String,
            default: 'NGN'
        }
    },
    
    // Notification settings
    notifications: {
        emailNotifications: {
            type: Boolean,
            default: true
        },
        orderNotifications: {
            type: Boolean,
            default: true
        },
        stockAlerts: {
            type: Boolean,
            default: true
        },
        userRegistration: {
            type: Boolean,
            default: true
        },
        sellerApplications: {
            type: Boolean,
            default: true
        },
        systemAlerts: {
            type: Boolean,
            default: true
        }
    },
    
    // Security settings
    security: {
        requireEmailVerification: {
            type: Boolean,
            default: true
        },
        twoFactorAuth: {
            type: Boolean,
            default: false
        },
        sessionTimeout: {
            type: Number,
            default: 30,
            min: 5,
            max: 480
        },
        maxLoginAttempts: {
            type: Number,
            default: 5,
            min: 3,
            max: 10
        },
        passwordMinLength: {
            type: Number,
            default: 6,
            min: 6,
            max: 20
        },
        requireStrongPassword: {
            type: Boolean,
            default: true
        }
    },
    
    // Comprehensive Payment Configuration (consolidated from 3 duplicate structures)
    payment: {
        // Business payment settings (single-seller model)
        minimumPayout: {
            type: Number,
            default: 25.0,
            min: 1
        },
        payoutSchedule: {
            type: String,
            enum: ['daily', 'weekly', 'monthly'],
            default: 'weekly'
        },
        
        // Consolidated payment method configurations
        methods: {
            stripe: {
                enabled: {
                    type: Boolean,
                    default: true
                },
                publishableKey: {
                    type: String,
                    default: ''
                },
                secretKey: {
                    type: String,
                    default: ''
                },
                webhookSecret: {
                    type: String,
                    default: ''
                },
                testMode: {
                    type: Boolean,
                    default: true
                },
                supportedCountries: {
                    type: [String],
                    default: ['US', 'CA', 'GB', 'AU', 'IN', 'NG']
                },
                supportedCurrencies: {
                    type: [String],
                    default: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR', 'NGN']
                },
                fees: {
                    percentage: { type: Number, default: 2.9 },
                    fixed: { type: Number, default: 0.30 }
                }
            },
            paypal: {
                enabled: {
                    type: Boolean,
                    default: true
                },
                clientId: {
                    type: String,
                    default: ''
                },
                clientSecret: {
                    type: String,
                    default: ''
                },
                testMode: {
                    type: Boolean,
                    default: true
                },
                supportedCountries: {
                    type: [String],
                    default: ['US', 'CA', 'GB', 'AU', 'IN', 'NG', 'DE', 'FR']
                },
                supportedCurrencies: {
                    type: [String],
                    default: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
                },
                fees: {
                    percentage: { type: Number, default: 3.4 },
                    fixed: { type: Number, default: 0.30 }
                }
            },
            paystack: {
                enabled: {
                    type: Boolean,
                    default: false
                },
                publicKey: {
                    type: String,
                    default: ''
                },
                secretKey: {
                    type: String,
                    default: ''
                },
                testMode: {
                    type: Boolean,
                    default: true
                },
                supportedCountries: {
                    type: [String],
                    default: ['NG', 'GH', 'ZA', 'KE']
                },
                supportedCurrencies: {
                    type: [String],
                    default: ['NGN', 'GHS', 'ZAR', 'KES']
                },
                fees: {
                    percentage: { type: Number, default: 1.5 },
                    fixed: { type: Number, default: 100 }
                }
            },
            flutterwave: {
                enabled: {
                    type: Boolean,
                    default: false
                },
                publicKey: {
                    type: String,
                    default: ''
                },
                secretKey: {
                    type: String,
                    default: ''
                },
                encryptionKey: {
                    type: String,
                    default: ''
                },
                testMode: {
                    type: Boolean,
                    default: true
                },
                supportedCountries: {
                    type: [String],
                    default: ['NG', 'GH', 'KE', 'UG', 'ZA']
                },
                supportedCurrencies: {
                    type: [String],
                    default: ['NGN', 'USD', 'GHS', 'KES', 'UGX', 'ZAR']
                },
                fees: {
                    percentage: { type: Number, default: 1.4 },
                    fixed: { type: Number, default: 0 }
                }
            },
            cashOnDelivery: {
                enabled: {
                    type: Boolean,
                    default: true
                },
                additionalFee: {
                    type: Number,
                    default: 0
                },
                supportedCountries: {
                    type: [String],
                    default: ['NG', 'IN', 'PK', 'BD', 'EG']
                },
                maxOrderAmount: {
                    type: Number,
                    default: 500000
                },
                description: {
                    type: String,
                    default: 'Pay when your order is delivered'
                }
            },
            bankTransfer: {
                enabled: {
                    type: Boolean,
                    default: true
                },
                accountDetails: {
                    bankName: { type: String, default: 'Access Bank' },
                    accountNumber: { type: String, default: '1234567890' },
                    accountName: { type: String, default: 'AshAmSmart Ltd' },
                    routingNumber: { type: String, default: '' },
                    swiftCode: { type: String, default: '' }
                },
                processingTime: {
                    type: String,
                    default: '1-2 business days'
                },
                instructions: {
                    type: String,
                    default: 'Please use your order number as the transfer reference'
                }
            },
            cryptocurrency: {
                enabled: {
                    type: Boolean,
                    default: false
                },
                supportedCoins: {
                    type: [String],
                    default: ['BTC', 'ETH', 'USDT', 'USDC']
                },
                walletAddresses: {
                    BTC: { type: String, default: '' },
                    ETH: { type: String, default: '' },
                    USDT: { type: String, default: '' },
                    USDC: { type: String, default: '' }
                },
                processingTime: {
                    type: String,
                    default: '10-30 minutes'
                },
                minimumAmount: {
                    type: Number,
                    default: 10
                }
            }
        }
    },
    
    // Scheduling settings
    scheduling: {
        reportGeneration: {
            enabled: {
                type: Boolean,
                default: true
            },
            frequency: {
                type: String,
                enum: ['daily', 'weekly', 'monthly'],
                default: 'weekly'
            },
            dayOfWeek: {
                type: String,
                enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
                default: 'monday'
            },
            time: {
                type: String,
                default: '09:00'
            },
            customDates: [{
                type: Date
            }]
        },
        auditPeriod: {
            startDate: {
                type: Date,
                default: () => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            },
            endDate: {
                type: Date,
                default: Date.now
            }
        }
    }
}, {
    timestamps: true
});

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
    let settings = await this.findOne({ systemId: 'main_settings' });
    
    if (!settings) {
        // Create default settings if none exist
        settings = new this({ systemId: 'main_settings' });
        await settings.save();
    }
    
    return settings;
};

settingsSchema.statics.updateSettings = async function(newSettings) {
    let settings = await this.findOne({ systemId: 'main_settings' });
    
    if (!settings) {
        settings = new this({ systemId: 'main_settings' });
    }
    
    // Deep merge the settings
    if (newSettings.general) {
        settings.general = { ...settings.general.toObject(), ...newSettings.general };
    }
    if (newSettings.notifications) {
        settings.notifications = { ...settings.notifications.toObject(), ...newSettings.notifications };
    }
    if (newSettings.security) {
        settings.security = { ...settings.security.toObject(), ...newSettings.security };
    }
    if (newSettings.payment) {
        settings.payment = { ...settings.payment.toObject(), ...newSettings.payment };
    }
    if (newSettings.scheduling) {
        settings.scheduling = { ...settings.scheduling.toObject(), ...newSettings.scheduling };
    }
    
    await settings.save();
    return settings;
};

const settingsModel = mongoose.model('settings', settingsSchema);

module.exports = settingsModel;
