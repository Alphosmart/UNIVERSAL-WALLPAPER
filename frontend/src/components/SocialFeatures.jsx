import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaStar, FaRegStar, FaShare, FaComment } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const backendDomain = "http://localhost:8080";

const SocialFeatures = ({ product, compact = false }) => {
    const user = useSelector(state => state?.user?.user);
    const [isLiked, setIsLiked] = useState(product.socialFeatures?.likes?.userHasLiked || false);
    const [likeCount, setLikeCount] = useState(product.socialFeatures?.likes?.count || 0);
    const [userRating, setUserRating] = useState(product.socialFeatures?.ratings?.userRating || 0);
    const [showShareModal, setShowShareModal] = useState(false);

    const handleLike = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!user?._id) {
            alert('Please login to like products');
            return;
        }

        try {
            const response = await fetch(`${backendDomain}/api/products/${product._id}/like`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            if (data.success) {
                setIsLiked(data.data.liked);
                setLikeCount(data.data.totalLikes);
            } else {
                console.error('Failed to like product:', data.message);
                if (data.message.includes('login') || data.message.includes('Authentication')) {
                    alert('Please login to like products');
                }
            }
        } catch (error) {
            console.error('Error liking product:', error);
        }
    };

    const handleRate = async (rating) => {
        if (!user?._id) {
            alert('Please login to rate products');
            return;
        }

        try {
            const response = await fetch(`${backendDomain}/api/products/${product._id}/rate`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rating })
            });

            const data = await response.json();
            
            if (data.success) {
                setUserRating(rating);
            } else {
                console.error('Failed to rate product:', data.message);
                if (data.message.includes('login') || data.message.includes('Authentication')) {
                    alert('Please login to rate products');
                }
            }
        } catch (error) {
            console.error('Error rating product:', error);
        }
    };

    const handleShare = (platform) => {
        const productUrl = `${window.location.origin}/product/${product._id}`;
        const productTitle = product.productName;
        
        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(productTitle)}`,
            instagram: `https://www.instagram.com/`, // Instagram doesn't support direct URL sharing, opens Instagram
            whatsapp: `https://wa.me/?text=${encodeURIComponent(`${productTitle} - ${productUrl}`)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(productUrl)}`,
            copy: productUrl
        };

        if (platform === 'copy') {
            navigator.clipboard.writeText(productUrl).then(() => {
                alert('Product link copied to clipboard!');
            });
        } else if (platform === 'instagram') {
            // Instagram special handling - copy URL and open Instagram
            navigator.clipboard.writeText(productUrl).then(() => {
                alert('✅ Product link copied to clipboard!\n\n📸 Instagram is opening now...\n\n📝 Next steps:\n1. Create a new post or story\n2. Paste the link (Ctrl+V) in your caption\n3. Share your content!');
                window.open(shareUrls[platform], '_blank', 'width=600,height=400');
            }).catch(() => {
                // If clipboard fails, just open Instagram
                alert('📸 Opening Instagram. Please manually copy and share the product link:\n' + productUrl);
                window.open(shareUrls[platform], '_blank', 'width=600,height=400');
            });
        } else if (platform === 'whatsapp') {
            // WhatsApp special handling - use web version to avoid protocol issues
            const whatsappText = `${productTitle} - ${productUrl}`;
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        } else {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }

        // Track the share
        if (user?._id) {
            fetch(`${backendDomain}/api/products/${product._id}/share`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ platform })
            }).catch(console.error);
        }

        setShowShareModal(false);
    };

    const renderStars = (rating, interactive = false, onStarClick = null) => {
        return [...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
                <span
                    key={index}
                    className={`${interactive ? 'cursor-pointer hover:text-yellow-400' : ''} ${
                        starValue <= rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    onClick={() => interactive && onStarClick && onStarClick(starValue)}
                >
                    {starValue <= rating ? <FaStar size={16} /> : <FaRegStar size={16} />}
                </span>
            );
        });
    };

    if (compact) {
        // Compact version for product cards
        return (
            <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleLike}
                        className="flex items-center gap-1 hover:text-red-500 transition-colors"
                    >
                        {isLiked ? <FaHeart className="text-red-500" size={14} /> : <FaRegHeart size={14} />}
                        <span>{likeCount}</span>
                    </button>
                    
                    <div className="flex items-center gap-1">
                        {renderStars(product.socialFeatures?.averageRating || 0)}
                        <span className="ml-1">({product.socialFeatures?.totalRatings || 0})</span>
                    </div>
                </div>
                
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowShareModal(true);
                    }}
                    className="hover:text-blue-500 transition-colors"
                >
                    <FaShare size={14} />
                </button>
            </div>
        );
    }

    // Full version for product detail page
    return (
        <div className="space-y-4">
            {/* Like and Share buttons */}
            <div className="flex items-center gap-4">
                <button
                    onClick={handleLike}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                    {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                    <span>{isLiked ? 'Liked' : 'Like'} ({likeCount})</span>
                </button>
                
                <button
                    onClick={() => setShowShareModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                    <FaShare />
                    <span>Share</span>
                </button>
            </div>

            {/* Rating section */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <span className="font-medium">Rating:</span>
                    <div className="flex items-center gap-1">
                        {renderStars(product.socialFeatures?.ratings?.average || 0)}
                        <span className="ml-2 text-gray-600">
                            {product.socialFeatures?.ratings?.average || 0} 
                            ({product.socialFeatures?.ratings?.total || 0} reviews)
                        </span>
                    </div>
                </div>
                
                {user?._id && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm">Your rating:</span>
                        <div className="flex items-center gap-1">
                            {renderStars(userRating, true, (rating) => setUserRating(rating))}
                        </div>
                        <button
                            onClick={() => handleRate(userRating)}
                            className="ml-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            disabled={userRating === 0}
                        >
                            Rate
                        </button>
                    </div>
                )}
            </div>

            {/* Reviews count */}
            <div className="flex items-center gap-2 text-gray-600">
                <FaComment />
                <span>{product.socialFeatures?.reviews?.count || 0} reviews</span>
            </div>

            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Share this product</h3>
                        <div className="space-y-2">
                            <button
                                onClick={() => handleShare('facebook')}
                                className="w-full p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Share on Facebook
                            </button>
                            <button
                                onClick={() => handleShare('twitter')}
                                className="w-full p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Share on Twitter
                            </button>
                            <button
                                onClick={() => handleShare('instagram')}
                                className="w-full p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Share on Instagram
                            </button>
                            <button
                                onClick={() => handleShare('whatsapp')}
                                className="w-full p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Share on WhatsApp
                            </button>
                            <button
                                onClick={() => handleShare('linkedin')}
                                className="w-full p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Share on LinkedIn
                            </button>
                            <button
                                onClick={() => handleShare('copy')}
                                className="w-full p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Copy Link
                            </button>
                        </div>
                        <button
                            onClick={() => setShowShareModal(false)}
                            className="w-full mt-4 p-2 border rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SocialFeatures;
