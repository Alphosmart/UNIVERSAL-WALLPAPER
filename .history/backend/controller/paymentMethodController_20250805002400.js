const settingsModel = require('../models/settingsModel');
const productModel = require('../models/productModel');

// Get available payment methods for a specific cart
const getAvailablePaymentMethods = async (req, res) => {
    try {
        console.log('Getting available payment methods...', req.body);
        const { cartItems = [], shippingAddress = {} } = req.body;

        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            return res.status(400).json({
                message: "Cart items are required",
                error: true,
                success: false
            });
        }

        // Get admin payment settings
        const adminSettings = await settingsModel.getSettings();
        const paymentSettings = adminSettings.payment;

        // Get unique sellers from cart items
        const productIds = cartItems.map(item => item.productId);
        const products = await productModel.find({ _id: { $in: productIds } })
            .populate('seller', 'name email');

        // Group products by seller
        const sellerGroups = {};
        products.forEach(product => {
            const sellerId = product.seller._id.toString();
            if (!sellerGroups[sellerId]) {
                sellerGroups[sellerId] = {
                    seller: product.seller,
                    products: [],
                    acceptedPaymentMethods: product.sellerInfo.acceptedPaymentMethods || ['stripe', 'paypal', 'cashOnDelivery']
                };
            }
            sellerGroups[sellerId].products.push(product);
        });

        // Find common payment methods across all sellers
        const allSellerMethods = Object.values(sellerGroups).map(group => group.acceptedPaymentMethods);
        const commonPaymentMethods = allSellerMethods.reduce((common, methods) => {
            return common.filter(method => methods.includes(method));
        });

        // Filter by admin enabled methods
        const availablePaymentMethods = [];

        // Check each payment method
        if (commonPaymentMethods.includes('stripe') && paymentSettings.paymentMethodSettings.stripe.enabled) {
            availablePaymentMethods.push({
                id: 'stripe',
                name: 'Credit/Debit Card',
                description: paymentSettings.paymentMethodSettings.stripe.description,
                icon: 'FaCreditCard',
                processingFee: paymentSettings.paymentMethodSettings.stripe.processingFee,
                enabled: true
            });
        }

        if (commonPaymentMethods.includes('paypal') && paymentSettings.paymentMethodSettings.paypal.enabled) {
            availablePaymentMethods.push({
                id: 'paypal',
                name: 'PayPal',
                description: paymentSettings.paymentMethodSettings.paypal.description,
                icon: 'FaPaypal',
                processingFee: paymentSettings.paymentMethodSettings.paypal.processingFee,
                enabled: true
            });
        }

        if (commonPaymentMethods.includes('cashOnDelivery') && paymentSettings.paymentMethodSettings.cashOnDelivery.enabled) {
            // Check if COD is available for shipping country
            const codSettings = paymentSettings.paymentMethodSettings.cashOnDelivery;
            const isCountrySupported = !shippingAddress?.country || 
                codSettings.availableCountries.includes(shippingAddress.country);

            if (isCountrySupported) {
                availablePaymentMethods.push({
                    id: 'cashOnDelivery',
                    name: 'Cash on Delivery',
                    description: codSettings.description,
                    icon: 'FaMoneyBillWave',
                    additionalFee: codSettings.additionalFee,
                    enabled: true
                });
            }
        }

        if (commonPaymentMethods.includes('bankTransfer') && paymentSettings.paymentMethodSettings.bankTransfer.enabled) {
            availablePaymentMethods.push({
                id: 'bankTransfer',
                name: 'Bank Transfer',
                description: paymentSettings.paymentMethodSettings.bankTransfer.description,
                icon: 'FaUniversity',
                processingDays: paymentSettings.paymentMethodSettings.bankTransfer.processingDays,
                enabled: true
            });
        }

        if (commonPaymentMethods.includes('cryptocurrency') && paymentSettings.paymentMethodSettings.cryptocurrency.enabled) {
            availablePaymentMethods.push({
                id: 'cryptocurrency',
                name: 'Cryptocurrency',
                description: paymentSettings.paymentMethodSettings.cryptocurrency.description,
                icon: 'FaBitcoin',
                supportedCoins: paymentSettings.paymentMethodSettings.cryptocurrency.supportedCoins,
                enabled: true
            });
        }

        res.json({
            message: "Available payment methods retrieved successfully",
            error: false,
            success: true,
            data: {
                availablePaymentMethods,
                sellerGroups: Object.values(sellerGroups).map(group => ({
                    seller: group.seller,
                    productCount: group.products.length,
                    acceptedPaymentMethods: group.acceptedPaymentMethods
                })),
                commonPaymentMethods
            }
        });

    } catch (err) {
        console.error('Error in getAvailablePaymentMethods:', err);
        res.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

// Get seller's payment method preferences
async function getSellerPaymentPreferences(req, res) {
    try {
        const { sellerId } = req.params;

        const products = await productModel.find({ seller: sellerId })
            .select('sellerInfo.acceptedPaymentMethods');

        if (products.length === 0) {
            return res.status(404).json({
                message: "No products found for this seller",
                error: true,
                success: false
            });
        }

        // Get most common payment methods across seller's products
        const allMethods = products.map(p => p.sellerInfo.acceptedPaymentMethods || ['stripe', 'paypal', 'cashOnDelivery']);
        const methodCounts = {};
        
        allMethods.forEach(methods => {
            methods.forEach(method => {
                methodCounts[method] = (methodCounts[method] || 0) + 1;
            });
        });

        const preferredMethods = Object.keys(methodCounts).sort((a, b) => methodCounts[b] - methodCounts[a]);

        res.json({
            message: "Seller payment preferences retrieved successfully",
            error: false,
            success: true,
            data: {
                sellerId,
                totalProducts: products.length,
                preferredPaymentMethods: preferredMethods,
                methodUsage: methodCounts
            }
        });

    } catch (err) {
        console.error('Error in getSellerPaymentPreferences:', err);
        res.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

// Update seller's payment method preferences
async function updateSellerPaymentPreferences(req, res) {
    try {
        const { acceptedPaymentMethods } = req.body;
        const sellerId = req.userId; // From auth middleware

        if (!acceptedPaymentMethods || !Array.isArray(acceptedPaymentMethods)) {
            return res.status(400).json({
                message: "Accepted payment methods must be an array",
                error: true,
                success: false
            });
        }

        const validMethods = ['stripe', 'paypal', 'cashOnDelivery', 'bankTransfer', 'cryptocurrency'];
        const invalidMethods = acceptedPaymentMethods.filter(method => !validMethods.includes(method));

        if (invalidMethods.length > 0) {
            return res.status(400).json({
                message: `Invalid payment methods: ${invalidMethods.join(', ')}`,
                error: true,
                success: false
            });
        }

        // Update all products by this seller
        const updateResult = await productModel.updateMany(
            { seller: sellerId },
            { 
                $set: { 
                    'sellerInfo.acceptedPaymentMethods': acceptedPaymentMethods 
                } 
            }
        );

        res.json({
            message: "Payment preferences updated successfully",
            error: false,
            success: true,
            data: {
                updatedProducts: updateResult.modifiedCount,
                acceptedPaymentMethods
            }
        });

    } catch (err) {
        console.error('Error in updateSellerPaymentPreferences:', err);
        res.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

module.exports = {
    getAvailablePaymentMethods,
    getSellerPaymentPreferences,
    updateSellerPaymentPreferences
};
