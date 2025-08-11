const settingsModel = require('../models/settingsModel');
const productModel = require('../models/productModel');

// Get available payment methods for a specific cart
const getAvailablePaymentMethods = async (req, res) => {
    try {
        console.log('Getting available payment methods...', req.body);
        
        // Simple test response
        return res.status(200).json({
            message: "Payment methods fetched successfully",
            error: false,
            success: true,
            data: {
                availablePaymentMethods: [
                    {
                        id: 'stripe',
                        name: 'Credit/Debit Card',
                        description: 'Pay securely with your credit or debit card',
                        icon: 'stripe',
                        enabled: true,
                        processingFee: 2.9
                    },
                    {
                        id: 'paypal',
                        name: 'PayPal',
                        description: 'Pay with your PayPal account',
                        icon: 'paypal',
                        enabled: true,
                        processingFee: 3.4
                    },
                    {
                        id: 'cashOnDelivery',
                        name: 'Cash on Delivery',
                        description: 'Pay when your order is delivered',
                        icon: 'cashOnDelivery',
                        enabled: true,
                        processingFee: 0
                    }
                ],
                sellerGroups: []
            }
        });

    } catch (error) {
        console.error('Error fetching payment methods:', error);
        res.status(500).json({
            message: error.message || 'Error fetching payment methods',
            error: true,
            success: false
        });
    }
};

// Get seller payment preferences
const getSellerPaymentPreferences = async (req, res) => {
    try {
        const { sellerId } = req.params;
        console.log('Getting seller payment preferences for:', sellerId);

        // Simple test response
        res.status(200).json({
            message: "Seller payment preferences fetched successfully",
            error: false,
            success: true,
            data: {
                sellerId,
                acceptedPaymentMethods: ['stripe', 'paypal', 'cashOnDelivery']
            }
        });

    } catch (error) {
        console.error('Error fetching seller payment preferences:', error);
        res.status(500).json({
            message: error.message || 'Error fetching seller payment preferences',
            error: true,
            success: false
        });
    }
};

// Update seller payment preferences
const updateSellerPaymentPreferences = async (req, res) => {
    try {
        const { acceptedPaymentMethods } = req.body;
        const userId = req.userId; // From auth middleware
        
        console.log('Updating seller payment preferences:', { userId, acceptedPaymentMethods });

        // Simple test response
        res.status(200).json({
            message: "Seller payment preferences updated successfully",
            error: false,
            success: true,
            data: {
                acceptedPaymentMethods
            }
        });

    } catch (error) {
        console.error('Error updating seller payment preferences:', error);
        res.status(500).json({
            message: error.message || 'Error updating seller payment preferences',
            error: true,
            success: false
        });
    }
};

module.exports = {
    getAvailablePaymentMethods,
    getSellerPaymentPreferences,
    updateSellerPaymentPreferences
};
