const { ShippingZone, GlobalShippingSettings } = require('../models/shippingModel');
const userModel = require('../models/userModel');

// Get shipping settings (for admin)
async function getShippingSettings(req, res) {
    try {
        // Check if user is admin
        const currentUser = await userModel.findById(req.userId);
        if (!currentUser || currentUser.role !== 'ADMIN') {
            return res.status(403).json({
                message: "Access denied. Admin privileges required.",
                error: true,
                success: false
            });
        }

        const shippingZones = await ShippingZone.find({});
        let globalSettings = await GlobalShippingSettings.findOne({});
        
        // Create default global settings if none exist
        if (!globalSettings) {
            globalSettings = new GlobalShippingSettings({});
            await globalSettings.save();
        }

        res.json({
            message: "Shipping settings retrieved successfully",
            data: {
                zones: shippingZones,
                global: globalSettings
            },
            success: true,
            error: false
        });

    } catch (err) {
        console.error("Error getting shipping settings:", err);
        res.status(500).json({
            message: err.message || "Failed to get shipping settings",
            error: true,
            success: false
        });
    }
}

// Update global shipping settings (admin only)
async function updateGlobalShippingSettings(req, res) {
    try {
        const currentUser = await userModel.findById(req.userId);
        if (!currentUser || currentUser.role !== 'ADMIN') {
            return res.status(403).json({
                message: "Access denied. Admin privileges required.",
                error: true,
                success: false
            });
        }

        const {
            enableShipping,
            defaultTaxRate,
            currency,
            weightUnit,
            freeShippingGlobal,
            restrictedCountries
        } = req.body;

        let globalSettings = await GlobalShippingSettings.findOne({});
        
        if (!globalSettings) {
            globalSettings = new GlobalShippingSettings({});
        }

        if (enableShipping !== undefined) globalSettings.globalSettings.enableShipping = enableShipping;
        if (defaultTaxRate !== undefined) globalSettings.globalSettings.defaultTaxRate = defaultTaxRate;
        if (currency !== undefined) globalSettings.globalSettings.currency = currency;
        if (weightUnit !== undefined) globalSettings.globalSettings.weightUnit = weightUnit;
        if (freeShippingGlobal !== undefined) globalSettings.globalSettings.freeShippingGlobal = freeShippingGlobal;
        if (restrictedCountries !== undefined) globalSettings.restrictedCountries = restrictedCountries;

        await globalSettings.save();

        res.json({
            message: "Global shipping settings updated successfully",
            data: globalSettings,
            success: true,
            error: false
        });

    } catch (err) {
        console.error("Error updating global shipping settings:", err);
        res.status(500).json({
            message: err.message || "Failed to update global shipping settings",
            error: true,
            success: false
        });
    }
}

// Create shipping zone (admin only)
async function createShippingZone(req, res) {
    try {
        const currentUser = await userModel.findById(req.userId);
        if (!currentUser || currentUser.role !== 'ADMIN') {
            return res.status(403).json({
                message: "Access denied. Admin privileges required.",
                error: true,
                success: false
            });
        }

        const { name, description, countries, rates } = req.body;

        if (!name || !countries || countries.length === 0) {
            return res.status(400).json({
                message: "Zone name and countries are required",
                error: true,
                success: false
            });
        }

        const newZone = new ShippingZone({
            name,
            description,
            countries,
            rates: rates || []
        });

        await newZone.save();

        res.status(201).json({
            message: "Shipping zone created successfully",
            data: newZone,
            success: true,
            error: false
        });

    } catch (err) {
        console.error("Error creating shipping zone:", err);
        res.status(500).json({
            message: err.message || "Failed to create shipping zone",
            error: true,
            success: false
        });
    }
}

// Update shipping zone (admin only)
async function updateShippingZone(req, res) {
    try {
        const currentUser = await userModel.findById(req.userId);
        if (!currentUser || currentUser.role !== 'ADMIN') {
            return res.status(403).json({
                message: "Access denied. Admin privileges required.",
                error: true,
                success: false
            });
        }

        const { zoneId } = req.params;
        const { name, description, countries, rates, isActive } = req.body;

        const zone = await ShippingZone.findById(zoneId);
        if (!zone) {
            return res.status(404).json({
                message: "Shipping zone not found",
                error: true,
                success: false
            });
        }

        if (name !== undefined) zone.name = name;
        if (description !== undefined) zone.description = description;
        if (countries !== undefined) zone.countries = countries;
        if (rates !== undefined) zone.rates = rates;
        if (isActive !== undefined) zone.isActive = isActive;

        await zone.save();

        res.json({
            message: "Shipping zone updated successfully",
            data: zone,
            success: true,
            error: false
        });

    } catch (err) {
        console.error("Error updating shipping zone:", err);
        res.status(500).json({
            message: err.message || "Failed to update shipping zone",
            error: true,
            success: false
        });
    }
}

// Delete shipping zone (admin only)
async function deleteShippingZone(req, res) {
    try {
        const currentUser = await userModel.findById(req.userId);
        if (!currentUser || currentUser.role !== 'ADMIN') {
            return res.status(403).json({
                message: "Access denied. Admin privileges required.",
                error: true,
                success: false
            });
        }

        const { zoneId } = req.params;

        const zone = await ShippingZone.findByIdAndDelete(zoneId);
        if (!zone) {
            return res.status(404).json({
                message: "Shipping zone not found",
                error: true,
                success: false
            });
        }

        res.json({
            message: "Shipping zone deleted successfully",
            success: true,
            error: false
        });

    } catch (err) {
        console.error("Error deleting shipping zone:", err);
        res.status(500).json({
            message: err.message || "Failed to delete shipping zone",
            error: true,
            success: false
        });
    }
}

// Calculate shipping cost for a specific order (public)
async function calculateShippingCost(req, res) {
    try {
        const { country, totalAmount, items = [], totalWeight = 0 } = req.body;

        if (!country) {
            return res.status(400).json({
                message: "Country is required for shipping calculation",
                error: true,
                success: false
            });
        }

        // Get global settings
        const globalSettings = await GlobalShippingSettings.findOne({});
        
        // Check if shipping is enabled
        if (!globalSettings?.globalSettings?.enableShipping) {
            return res.json({
                message: "Shipping is currently disabled",
                data: {
                    shippingCost: 0,
                    isFree: true,
                    reason: "Shipping disabled"
                },
                success: true,
                error: false
            });
        }

        // Check for global free shipping threshold
        if (globalSettings?.globalSettings?.freeShippingGlobal > 0 && 
            totalAmount >= globalSettings.globalSettings.freeShippingGlobal) {
            return res.json({
                message: "Free shipping applied",
                data: {
                    shippingCost: 0,
                    isFree: true,
                    reason: `Free shipping for orders over $${globalSettings.globalSettings.freeShippingGlobal}`
                },
                success: true,
                error: false
            });
        }

        // Find shipping zone for the country
        const shippingZone = await ShippingZone.findOne({
            countries: country,
            isActive: true
        });

        if (!shippingZone) {
            // Provide default shipping rates if no zones are configured
            const defaultShippingRates = {
                'United States': 9.99,
                'Canada': 14.99,
                'United Kingdom': 19.99,
                'Australia': 24.99,
                'Germany': 19.99,
                'France': 19.99,
                'Japan': 24.99,
                'India': 29.99,
                'Brazil': 34.99,
                'Mexico': 14.99
            };

            const defaultShippingCost = defaultShippingRates[country] || 29.99; // Default for all other countries

            // Check for global free shipping threshold from admin settings
            if (globalSettings?.globalSettings?.freeShippingGlobal > 0 && 
                totalAmount >= globalSettings.globalSettings.freeShippingGlobal) {
                return res.json({
                    message: "Free shipping applied",
                    data: {
                        shippingCost: 0,
                        isFree: true,
                        reason: `Free shipping for orders over $${globalSettings.globalSettings.freeShippingGlobal}`,
                        zone: "Default"
                    },
                    success: true,
                    error: false
                });
            }

            // If no global settings or free shipping threshold is 0, use default threshold of $100
            const defaultFreeShippingThreshold = 100;
            if (totalAmount >= defaultFreeShippingThreshold) {
                return res.json({
                    message: "Free shipping applied",
                    data: {
                        shippingCost: 0,
                        isFree: true,
                        reason: `Free shipping for orders over $${defaultFreeShippingThreshold} (default)`,
                        zone: "Default"
                    },
                    success: true,
                    error: false
                });
            }

            return res.json({
                message: "Shipping cost calculated successfully",
                data: {
                    shippingCost: defaultShippingCost,
                    isFree: false,
                    zone: "Default",
                    method: "Standard Shipping",
                    calculation: "flat_rate"
                },
                success: true,
                error: false
            });
        }

        // Find the first active rate in the zone
        const activeRate = shippingZone.rates.find(rate => rate.isActive);
        
        if (!activeRate) {
            return res.status(400).json({
                message: `No shipping rates available for ${country}`,
                error: true,
                success: false
            });
        }

        // Check for zone-specific free shipping
        if (activeRate.freeShippingThreshold > 0 && totalAmount >= activeRate.freeShippingThreshold) {
            return res.json({
                message: "Free shipping applied",
                data: {
                    shippingCost: 0,
                    isFree: true,
                    reason: `Free shipping for orders over $${activeRate.freeShippingThreshold}`,
                    zone: shippingZone.name
                },
                success: true,
                error: false
            });
        }

        // Calculate shipping cost based on rate type
        let shippingCost = 0;

        switch (activeRate.calculation) {
            case 'flat_rate':
                shippingCost = activeRate.amount;
                break;
            case 'per_item':
                shippingCost = activeRate.amount * items.length;
                break;
            case 'weight_based':
                shippingCost = activeRate.amount * totalWeight;
                break;
            case 'percentage':
                shippingCost = (totalAmount * activeRate.amount) / 100;
                break;
            default:
                shippingCost = activeRate.amount;
        }

        // Apply min/max limits
        if (activeRate.minAmount && shippingCost < activeRate.minAmount) {
            shippingCost = activeRate.minAmount;
        }
        if (activeRate.maxAmount && shippingCost > activeRate.maxAmount) {
            shippingCost = activeRate.maxAmount;
        }

        res.json({
            message: "Shipping cost calculated successfully",
            data: {
                shippingCost: parseFloat(shippingCost.toFixed(2)),
                isFree: false,
                zone: shippingZone.name,
                method: activeRate.name,
                calculation: activeRate.calculation
            },
            success: true,
            error: false
        });

    } catch (err) {
        console.error("Error calculating shipping cost:", err);
        res.status(500).json({
            message: err.message || "Failed to calculate shipping cost",
            error: true,
            success: false
        });
    }
}

// Get available shipping methods for a country (public)
async function getShippingMethods(req, res) {
    try {
        const { country } = req.params;

        if (!country) {
            return res.status(400).json({
                message: "Country is required",
                error: true,
                success: false
            });
        }

        const shippingZone = await ShippingZone.findOne({
            countries: country,
            isActive: true
        });

        if (!shippingZone) {
            return res.json({
                message: `No shipping available to ${country}`,
                data: {
                    available: false,
                    methods: []
                },
                success: true,
                error: false
            });
        }

        const activeMethods = shippingZone.rates.filter(rate => rate.isActive);

        res.json({
            message: "Shipping methods retrieved successfully",
            data: {
                available: true,
                zone: shippingZone.name,
                methods: activeMethods.map(method => ({
                    id: method._id,
                    name: method.name,
                    description: method.description,
                    calculation: method.calculation,
                    amount: method.amount,
                    freeShippingThreshold: method.freeShippingThreshold
                }))
            },
            success: true,
            error: false
        });

    } catch (err) {
        console.error("Error getting shipping methods:", err);
        res.status(500).json({
            message: err.message || "Failed to get shipping methods",
            error: true,
            success: false
        });
    }
}

// Get public shipping information (for shipping info page)
async function getShippingInfo(req, res) {
    try {
        const shippingZones = await ShippingZone.find({ isActive: true });
        let globalSettings = await GlobalShippingSettings.findOne({});
        
        // Create default global settings if none exist
        if (!globalSettings) {
            globalSettings = new GlobalShippingSettings({});
            await globalSettings.save();
        }

        // Filter only public information
        const publicZones = shippingZones.map(zone => ({
            name: zone.name,
            description: zone.description,
            countries: zone.countries,
            rates: zone.rates.filter(rate => rate.isActive).map(rate => ({
                name: rate.name,
                description: rate.description,
                amount: rate.amount,
                freeShippingThreshold: rate.freeShippingThreshold
            }))
        }));

        const publicGlobalSettings = {
            enableShipping: globalSettings.enableShipping,
            currency: globalSettings.currency,
            weightUnit: globalSettings.weightUnit,
            freeShippingGlobal: globalSettings.freeShippingGlobal
        };

        res.json({
            message: "Shipping information retrieved successfully",
            data: {
                zones: publicZones,
                global: publicGlobalSettings
            },
            success: true,
            error: false
        });

    } catch (err) {
        console.error("Error getting shipping info:", err);
        res.status(500).json({
            message: err.message || "Failed to get shipping information",
            error: true,
            success: false
        });
    }
}

module.exports = {
    getShippingSettings,
    updateGlobalShippingSettings,
    createShippingZone,
    updateShippingZone,
    deleteShippingZone,
    calculateShippingCost,
    getShippingMethods,
    getShippingInfo
};
