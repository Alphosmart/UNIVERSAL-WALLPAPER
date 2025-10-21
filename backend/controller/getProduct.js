const productModel = require("../models/productModel");
const CurrencyService = require("../services/currencyService");
const settingsModel = require("../models/settingsModel");

const getProductController = async(req, res) => {
    try {
        // Get buyer's preferred currency from query params or default settings
        let buyerCurrency = req.query.currency;
        
        if (!buyerCurrency) {
            // Try to get currency from user's settings if authenticated
            if (req.userId) {
                try {
                    // You could also get user's preferred currency from user profile
                    const settings = await settingsModel.getSettings();
                    buyerCurrency = settings.general.currency || 'NGN';
                } catch (error) {
                    buyerCurrency = 'NGN'; // Default fallback
                }
            } else {
                buyerCurrency = 'NGN'; // Default for anonymous users
            }
        }

        // Get only active products from database with uploader information
        const allProducts = await productModel.find({ 
            status: 'ACTIVE',
            stock: { $gt: 0 } // Only products with stock > 0
        })
        .populate('uploadedBy', 'name email role')
        .sort({ createdAt: -1 });

        // Convert prices to buyer's currency
        const productsWithConvertedPrices = allProducts.map(product => {
            const productObj = product.toObject();
            
            // Add converted pricing for buyer
            const convertedPricing = CurrencyService.convertProductPricing(productObj, buyerCurrency);
            
            // Calculate basic social features statistics
            const totalLikes = product.likes ? product.likes.length : 0;
            const totalRatings = product.ratings ? product.ratings.length : 0;
            const averageRating = totalRatings > 0 
                ? product.ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
                : 0;
            const totalReviews = product.reviews ? product.reviews.length : 0;
            
            return {
                ...productObj,
                displayPricing: convertedPricing,
                // Keep original pricing for reference
                originalCurrency: productObj.pricing?.originalPrice?.currency || 'NGN',
                socialFeatures: {
                    likes: totalLikes,
                    averageRating: parseFloat(averageRating.toFixed(1)),
                    totalRatings: totalRatings,
                    totalReviews: totalReviews
                }
            };
        });

        res.json({
            message: "All Products",
            success: true,
            error: false,
            data: productsWithConvertedPrices,
            currency: buyerCurrency
        });

    } catch (err) {
        console.log("Database error:", err.message);
        res.status(500).json({
            message: "Failed to fetch products",
            success: false,
            error: true,
            data: []
        });
    }
}

module.exports = getProductController;
