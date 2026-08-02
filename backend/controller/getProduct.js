const productModel = require("../models/productModel");
const CurrencyService = require("../services/currencyService");
const settingsModel = require("../models/settingsModel");

const getProductController = async(req, res) => {
    try {
        // Get pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20; // Default to 20 products per page
        const skip = (page - 1) * limit;

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

        // Get total count for pagination
        const totalProducts = await productModel.countDocuments({ 
            status: 'ACTIVE',
            stock: { $gt: 0 }
        });

        // Get paginated products with essential fields only
        const allProducts = await productModel.find({ 
            status: 'ACTIVE',
            stock: { $gt: 0 } // Only products with stock > 0
        }, {
            // Select only essential fields for better performance
            productName: 1,
            brandName: 1,
            category: 1,
            productImage: 1,
            description: 1,
            pricing: 1,
            price: 1, // legacy field
            sellingPrice: 1, // legacy field
            stock: 1,
            condition: 1,
            status: 1,
            uploadedByInfo: 1, // Use embedded info instead of populate
            likes: 1,
            ratings: 1,
            reviews: 1,
            createdAt: 1,
            updatedAt: 1
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(); // Use lean() for better performance

        // Process products more efficiently
        const productsWithConvertedPrices = allProducts.map(product => {
            // Add converted pricing for buyer
            const convertedPricing = CurrencyService.convertProductPricing(product, buyerCurrency);
            
            // Calculate social features efficiently
            const likes = product.likes?.length || 0;
            const ratingsArray = product.ratings || [];
            const reviewsArray = product.reviews || [];
            const averageRating = ratingsArray.length > 0 
                ? ratingsArray.reduce((sum, r) => sum + (r.rating || 0), 0) / ratingsArray.length 
                : 0;
            
            return {
                _id: product._id,
                productName: product.productName,
                brandName: product.brandName,
                category: product.category,
                productImage: product.productImage,
                description: product.description,
                stock: product.stock,
                condition: product.condition,
                status: product.status,
                displayPricing: convertedPricing,
                originalCurrency: product.pricing?.originalPrice?.currency || 'NGN',
                socialFeatures: {
                    likes,
                    averageRating: Math.round(averageRating * 10) / 10,
                    totalRatings: ratingsArray.length,
                    totalReviews: reviewsArray.length
                },
                createdAt: product.createdAt,
                updatedAt: product.updatedAt
            };
        });

        res.json({
            message: "All Products",
            success: true,
            error: false,
            data: productsWithConvertedPrices,
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
