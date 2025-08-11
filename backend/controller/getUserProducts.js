const Product = require("../models/productModel");
const CurrencyService = require("../services/currencyService");

async function getUserProductsController(req, res) {
    try {
        const userId = req.userId;
        const { status, category, currency } = req.query;

        // Build filter object
        let filter = { seller: userId };
        
        if (status) {
            filter.status = status;
        }
        
        if (category) {
            filter.category = category;
        }

        // Get user's products
        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .populate('seller', 'name email');

        // Convert prices if currency is specified (for seller viewing in different currency)
        let processedProducts = products;
        if (currency) {
            processedProducts = products.map(product => {
                const productObj = product.toObject();
                const convertedPricing = CurrencyService.convertProductPricing(productObj, currency);
                
                return {
                    ...productObj,
                    displayPricing: convertedPricing,
                    originalCurrency: productObj.pricing?.originalPrice?.currency || 'NGN'
                };
            });
        }

        res.status(200).json({
            message: "User products retrieved successfully",
            data: processedProducts,
            count: processedProducts.length,
            currency: currency || null,
            error: false,
            success: true
        });

    } catch (err) {
        console.log("Error in getUserProducts:", err.message);
        res.status(500).json({
            message: "Failed to get user products: " + err.message,
            error: true,
            success: false
        });
    }
}

module.exports = getUserProductsController;
