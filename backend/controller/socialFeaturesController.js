const Product = require("../models/productModel");

// Like a product
async function likeProduct(req, res) {
    try {
        const { productId } = req.params;
        const userId = req.userId;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        // Check if user already liked the product
        const alreadyLiked = product.likes.includes(userId);

        if (alreadyLiked) {
            // Unlike the product
            product.likes = product.likes.filter(id => id.toString() !== userId);
        } else {
            // Like the product
            product.likes.push(userId);
        }

        await product.save();

        res.json({
            message: alreadyLiked ? "Product unliked successfully" : "Product liked successfully",
            error: false,
            success: true,
            data: {
                productId,
                liked: !alreadyLiked,
                totalLikes: product.likes.length
            }
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

// Rate a product
async function rateProduct(req, res) {
    try {
        const { productId } = req.params;
        const { rating } = req.body;
        const userId = req.userId;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5",
                error: true,
                success: false
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        // Check if user already rated the product
        const existingRatingIndex = product.ratings.findIndex(r => r.user.toString() === userId);

        if (existingRatingIndex !== -1) {
            // Update existing rating
            product.ratings[existingRatingIndex].rating = rating;
            product.ratings[existingRatingIndex].date = new Date();
        } else {
            // Add new rating
            product.ratings.push({ user: userId, rating, date: new Date() });
        }

        await product.save();

        // Calculate average rating
        const totalRatings = product.ratings.length;
        const averageRating = product.ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;

        res.json({
            message: "Product rated successfully",
            error: false,
            success: true,
            data: {
                productId,
                userRating: rating,
                averageRating: parseFloat(averageRating.toFixed(1)),
                totalRatings
            }
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

// Add a review
async function addReview(req, res) {
    try {
        const { productId } = req.params;
        const { review, rating } = req.body;
        const userId = req.userId;

        if (!review || !rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Review text and rating (1-5) are required",
                error: true,
                success: false
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        // Check if user already reviewed the product
        const existingReviewIndex = product.reviews.findIndex(r => r.user.toString() === userId);

        if (existingReviewIndex !== -1) {
            // Update existing review
            product.reviews[existingReviewIndex].review = review;
            product.reviews[existingReviewIndex].rating = rating;
            product.reviews[existingReviewIndex].date = new Date();
        } else {
            // Add new review
            product.reviews.push({ user: userId, review, rating, date: new Date() });
        }

        await product.save();

        res.json({
            message: "Review added successfully",
            error: false,
            success: true,
            data: {
                productId,
                totalReviews: product.reviews.length
            }
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

// Get product reviews
async function getProductReviews(req, res) {
    try {
        const { productId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const product = await Product.findById(productId)
            .populate('reviews.user', 'name')
            .select('reviews');

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        // Sort reviews by date (newest first)
        const sortedReviews = product.reviews.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedReviews = sortedReviews.slice(startIndex, endIndex);

        res.json({
            message: "Reviews retrieved successfully",
            error: false,
            success: true,
            data: {
                reviews: paginatedReviews,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(sortedReviews.length / limit),
                    totalReviews: sortedReviews.length,
                    hasNextPage: endIndex < sortedReviews.length,
                    hasPrevPage: page > 1
                }
            }
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

// Share product to social media (track the sharing)
async function shareProduct(req, res) {
    try {
        const { productId } = req.params;
        const { platform } = req.body;
        const userId = req.userId;

        const validPlatforms = ['facebook', 'twitter', 'whatsapp', 'linkedin', 'instagram'];
        
        if (!platform || !validPlatforms.includes(platform)) {
            return res.status(400).json({
                message: `Platform must be one of: ${validPlatforms.join(', ')}`,
                error: true,
                success: false
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        // Track the share
        product.socialShares.push({ user: userId, platform, date: new Date() });
        await product.save();

        // Generate share URLs for different platforms
        const productUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/product/${productId}`;
        const productTitle = product.productName;
        const productDescription = product.description || `Check out this amazing ${product.productName}!`;

        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(productTitle)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(`${productTitle} - ${productUrl}`)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(productUrl)}`,
            instagram: productUrl // Instagram doesn't support direct URL sharing
        };

        res.json({
            message: "Share tracked successfully",
            error: false,
            success: true,
            data: {
                productId,
                platform,
                shareUrl: shareUrls[platform],
                allShareUrls: shareUrls,
                totalShares: product.socialShares.length
            }
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

// Get product statistics (likes, ratings, reviews, shares)
async function getProductStats(req, res) {
    try {
        const { productId } = req.params;

        const product = await Product.findById(productId)
            .populate('likes', 'name')
            .populate('reviews.user', 'name')
            .populate('socialShares.user', 'name');

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        // Calculate average rating
        const totalRatings = product.ratings.length;
        const averageRating = totalRatings > 0 
            ? product.ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
            : 0;

        // Rating distribution
        const ratingDistribution = {
            1: product.ratings.filter(r => r.rating === 1).length,
            2: product.ratings.filter(r => r.rating === 2).length,
            3: product.ratings.filter(r => r.rating === 3).length,
            4: product.ratings.filter(r => r.rating === 4).length,
            5: product.ratings.filter(r => r.rating === 5).length
        };

        // Share distribution by platform
        const shareDistribution = {};
        product.socialShares.forEach(share => {
            shareDistribution[share.platform] = (shareDistribution[share.platform] || 0) + 1;
        });

        res.json({
            message: "Product statistics retrieved successfully",
            error: false,
            success: true,
            data: {
                productId,
                likes: {
                    count: product.likes.length,
                    users: product.likes
                },
                ratings: {
                    average: parseFloat(averageRating.toFixed(1)),
                    total: totalRatings,
                    distribution: ratingDistribution
                },
                reviews: {
                    count: product.reviews.length,
                    recent: product.reviews.slice(0, 5) // Get 5 most recent reviews
                },
                shares: {
                    total: product.socialShares.length,
                    byPlatform: shareDistribution
                }
            }
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

// Like/unlike a review
async function likeReview(req, res) {
    try {
        const { productId, reviewId } = req.params;
        const userId = req.userId;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        // Find the review
        const review = product.reviews.id(reviewId);
        if (!review) {
            return res.status(404).json({
                message: "Review not found",
                error: true,
                success: false
            });
        }

        // Check if user already liked the review
        const alreadyLiked = review.likes.includes(userId);

        if (alreadyLiked) {
            // Unlike the review
            review.likes = review.likes.filter(id => id.toString() !== userId);
        } else {
            // Like the review
            review.likes.push(userId);
        }

        await product.save();

        res.json({
            message: alreadyLiked ? "Review unliked successfully" : "Review liked successfully",
            error: false,
            success: true,
            data: {
                reviewId,
                liked: !alreadyLiked,
                totalLikes: review.likes.length
            }
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = {
    likeProduct,
    rateProduct,
    addReview,
    getProductReviews,
    shareProduct,
    getProductStats,
    likeReview
};
