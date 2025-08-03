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
    
    // Payment settings
    payment: {
        enablePayPal: {
            type: Boolean,
            default: true
        },
        enableStripe: {
            type: Boolean,
            default: true
        },
        commissionRate: {
            type: Number,
            default: 3.0,
            min: 0,
            max: 50
        },
        minimumPayout: {
            type: Number,
            default: 25.0,
            min: 1
        },
        payoutSchedule: {
            type: String,
            enum: ['daily', 'weekly', 'monthly'],
            default: 'weekly'
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
