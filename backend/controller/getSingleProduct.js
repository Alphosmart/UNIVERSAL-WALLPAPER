const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const CurrencyService = require("../services/currencyService");
const settingsModel = require("../models/settingsModel");

const getSingleProductController = async (req, res) => {
    try {
        const { productId } = req.params;

        // Get buyer's preferred currency from query params or default settings
        let buyerCurrency = req.query.currency;
        
        if (!buyerCurrency) {
            // Try to get currency from user's settings if authenticated
            if (req.userId) {
                try {
                    const settings = await settingsModel.getSettings();
                    buyerCurrency = settings.general.currency || 'NGN';
                } catch (error) {
                    buyerCurrency = 'NGN'; // Default fallback
                }
            } else {
                buyerCurrency = 'NGN'; // Default for anonymous users
            }
        }

        // Find the specific product by ID
        const product = await productModel.findById(productId)
            .populate('uploadedBy', 'name email role')
            .populate('likes', 'name')
            .populate('reviews.user', 'name')
            .populate('ratings.user', 'name');

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false,
                error: true,
                data: null
            });
        }

        // Check if product is active and has stock
        if (product.status !== 'ACTIVE') {
            return res.status(404).json({
                message: "Product is not available",
                success: false,
                error: true,
                data: null
            });
        }

        // Convert product pricing to buyer's currency
        const productObj = product.toObject();
        const convertedPricing = CurrencyService.convertProductPricing(productObj, buyerCurrency);
        
        // Calculate social features statistics
        const totalLikes = product.likes ? product.likes.length : 0;
        const totalRatings = product.ratings ? product.ratings.length : 0;
        const averageRating = totalRatings > 0 
            ? product.ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
            : 0;
        const totalReviews = product.reviews ? product.reviews.length : 0;
        const totalShares = product.socialShares ? product.socialShares.length : 0;
        
        // Check if current user has liked this product
        const userHasLiked = req.userId && product.likes 
            ? product.likes.some(like => like._id.toString() === req.userId) 
            : false;
        
        // Get user's rating for this product
        const userRating = req.userId && product.ratings
            ? product.ratings.find(rating => rating.user._id.toString() === req.userId)
            : null;
        
        const productWithConvertedPrices = {
            ...productObj,
            displayPricing: convertedPricing,
            originalCurrency: productObj.pricing?.originalPrice?.currency || 'NGN',
            socialFeatures: {
                likes: {
                    count: totalLikes,
                    userHasLiked: userHasLiked
                },
                ratings: {
                    average: parseFloat(averageRating.toFixed(1)),
                    total: totalRatings,
                    userRating: userRating ? userRating.rating : null
                },
                reviews: {
                    count: totalReviews,
                    recent: product.reviews ? product.reviews.slice(-3).reverse() : [] // Last 3 reviews
                },
                shares: {
                    count: totalShares
                }
            }
        };

        res.json({
            message: "Product fetched successfully",
            success: true,
            error: false,
            data: productWithConvertedPrices,
            currency: buyerCurrency
        });

    } catch (err) {
        console.log("Error in getSingleProduct:", err.message);
        res.status(500).json({
            message: "Failed to fetch product details",
            success: false,
            error: true,
            data: null
        });
    }
}

module.exports = getSingleProductController;
