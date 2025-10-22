const productModel = require("../models/productModel");
const CurrencyService = require("../services/currencyService");
const settingsModel = require("../models/settingsModel");

const getProductsLiteController = async(req, res) => {
    try {
        // Get pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50; // Higher limit for initial load
        const skip = (page - 1) * limit;
        const category = req.query.category;

        // Get buyer's preferred currency
        let buyerCurrency = req.query.currency || 'NGN';

        // Build query
        let query = { 
            status: 'ACTIVE',
            stock: { $gt: 0 }
        };

        if (category && category !== 'all') {
            query.category = category;
        }

        // Get total count for pagination
        const totalProducts = await productModel.countDocuments(query);

        // Get products with minimal fields for fast loading
        const products = await productModel.find(query, {
            // Only essential fields for card display
            productName: 1,
            brandName: 1,
            category: 1,
            productImage: { $slice: 1 }, // Only first image
            pricing: 1,
            price: 1, // legacy field
            sellingPrice: 1, // legacy field
            stock: 1,
            condition: 1,
            likes: { $size: '$likes' }, // Just count, not full array
            'ratings.rating': 1, // Only rating values for average calculation
            createdAt: 1
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

        // Process products with minimal overhead
        const processedProducts = products.map(product => {
            // Simple pricing conversion
            let displayPrice = product.sellingPrice || product.pricing?.sellingPrice?.amount || 0;
            let originalPrice = product.price || product.pricing?.originalPrice?.amount || 0;
            
            // Basic currency conversion (simplified)
            if (buyerCurrency !== 'NGN') {
                displayPrice = CurrencyService.convertAmount(displayPrice, 'NGN', buyerCurrency);
                originalPrice = CurrencyService.convertAmount(originalPrice, 'NGN', buyerCurrency);
            }

            // Calculate average rating efficiently
            const ratings = product.ratings || [];
            const averageRating = ratings.length > 0 
                ? ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length 
                : 0;

            return {
                _id: product._id,
                productName: product.productName,
                brandName: product.brandName,
                category: product.category,
                productImage: product.productImage?.[0] || '',
                displayPrice: Math.round(displayPrice * 100) / 100,
                originalPrice: Math.round(originalPrice * 100) / 100,
                stock: product.stock,
                condition: product.condition,
                likes: product.likes || 0,
                averageRating: Math.round(averageRating * 10) / 10,
                createdAt: product.createdAt
            };
        });

        res.json({
            success: true,
            data: processedProducts,
            currency: buyerCurrency,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalProducts / limit),
                totalProducts: totalProducts,
                hasNextPage: page < Math.ceil(totalProducts / limit),
                hasPrevPage: page > 1,
                limit: limit
            }
        });

    } catch (err) {
        console.error("Error in getProductsLiteController:", err);
        res.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
};

module.exports = getProductsLiteController;