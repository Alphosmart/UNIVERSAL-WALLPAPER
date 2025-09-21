import React, { useState, useEffect, useCallback } from 'react';
import { FaStar, FaRegStar, FaImage, FaSpinner } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import ReviewPhotoUpload from './ReviewPhotoUpload';
import ReviewCard from './ReviewCard';
import ReviewFilters from './ReviewFilters';
import { trackEvent } from '../utils/analytics';

const backendDomain = "http://localhost:8080";

const EnhancedReviews = ({ productId }) => {
    const user = useSelector(state => state?.user?.user);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddReview, setShowAddReview] = useState(false);
    const [newReview, setNewReview] = useState({ 
        review: '', 
        rating: 0, 
        title: '', 
        photos: [] 
    });
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        ratings: [],
        verified: false,
        withPhotos: false
    });
    const [sortBy, setSortBy] = useState('newest');
    const [reviewStats, setReviewStats] = useState({});
    const [submittingReview, setSubmittingReview] = useState(false);

    const fetchReviews = useCallback(async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page: currentPage,
                limit: 10,
                sort: sortBy,
                ...filters
            });

            const response = await fetch(`${backendDomain}/api/products/${productId}/reviews?${queryParams}`);
            const data = await response.json();
            
            if (data.success) {
                setReviews(data.data.reviews);
                setPagination(data.data.pagination);
                setReviewStats(data.data.stats || {});
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    }, [productId, currentPage, filters, sortBy]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleAddReview = async () => {
        if (!user?._id) {
            alert('Please login to add a review');
            return;
        }

        if (!newReview.review.trim() || newReview.rating === 0) {
            alert('Please provide both a review and rating');
            return;
        }

        setSubmittingReview(true);
        try {
            // In a real implementation, you would upload photos to cloud storage first
            const reviewData = {
                ...newReview,
                photos: newReview.photos.map(photo => ({
                    url: photo.url,
                    description: photo.description || ''
                }))
            };

            const response = await fetch(`${backendDomain}/api/products/${productId}/review`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reviewData)
            });

            const data = await response.json();
            
            if (data.success) {
                setNewReview({ review: '', rating: 0, title: '', photos: [] });
                setShowAddReview(false);
                fetchReviews();
                
                // Track analytics
                trackEvent('review_submitted', {
                    product_id: productId,
                    rating: newReview.rating,
                    has_photos: newReview.photos.length > 0,
                    category: 'user_engagement'
                });
                
                alert('Review added successfully!');
            } else {
                alert(data.message || 'Failed to add review');
            }
        } catch (error) {
            console.error('Error adding review:', error);
            alert('Error adding review');
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleMarkHelpful = async (reviewId, isHelpful) => {
        if (!user?._id) {
            alert('Please login to mark reviews as helpful');
            return;
        }

        try {
            const response = await fetch(`${backendDomain}/api/products/${productId}/review/${reviewId}/helpful`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ helpful: isHelpful })
            });

            const data = await response.json();
            if (data.success) {
                // Update the reviews state to reflect the change
                setReviews(prevReviews =>
                    prevReviews.map(review =>
                        review._id === reviewId
                            ? { ...review, helpfulVotes: data.data.helpfulVotes }
                            : review
                    )
                );

                // Track analytics
                trackEvent('review_helpful_vote', {
                    review_id: reviewId,
                    helpful: isHelpful,
                    category: 'user_engagement'
                });
            }
        } catch (error) {
            console.error('Error marking review as helpful:', error);
        }
    };

    const handleReportReview = async (reviewId) => {
        if (!user?._id) {
            alert('Please login to report reviews');
            return;
        }

        const reason = prompt('Please specify the reason for reporting this review:');
        if (!reason) return;

        try {
            const response = await fetch(`${backendDomain}/api/products/${productId}/review/${reviewId}/report`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reason })
            });

            const data = await response.json();
            if (data.success) {
                alert('Review reported successfully. Thank you for helping us maintain quality.');
                
                // Track analytics
                trackEvent('review_reported', {
                    review_id: reviewId,
                    reason: reason,
                    category: 'moderation'
                });
            }
        } catch (error) {
            console.error('Error reporting review:', error);
            alert('Error reporting review');
        }
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

    if (loading && reviews.length === 0) {
        return (
            <div className="space-y-4">
                <h3 className="text-xl font-semibold">Reviews</h3>
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-4 bg-gray-300 rounded w-24"></div>
                                <div className="h-4 bg-gray-300 rounded w-32"></div>
                            </div>
                            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Review Filters and Summary */}
            <ReviewFilters
                filters={filters}
                onFiltersChange={setFilters}
                sortBy={sortBy}
                onSortChange={setSortBy}
                totalReviews={reviewStats.totalReviews || reviews.length}
                averageRating={reviewStats.averageRating}
                ratingDistribution={reviewStats.ratingDistribution}
            />

            {/* Add Review Section */}
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Customer Reviews</h3>
                {user?._id && (
                    <button
                        onClick={() => setShowAddReview(!showAddReview)}
                        disabled={submittingReview}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                        {showAddReview ? 'Cancel' : 'Write Review'}
                    </button>
                )}
            </div>

            {/* Add Review Form */}
            {showAddReview && (
                <div className="border rounded-lg p-6 bg-gray-50">
                    <h4 className="font-medium mb-4">Write a Review</h4>
                    <div className="space-y-4">
                        {/* Rating */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Rating</label>
                            <div className="flex items-center gap-1">
                                {renderStars(newReview.rating, true, (rating) =>
                                    setNewReview(prev => ({ ...prev, rating }))
                                )}
                            </div>
                        </div>

                        {/* Review Title */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Review Title (Optional)
                            </label>
                            <input
                                type="text"
                                value={newReview.title}
                                onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Summarize your experience..."
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                maxLength={100}
                            />
                        </div>

                        {/* Review Text */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Your Review
                            </label>
                            <textarea
                                value={newReview.review}
                                onChange={(e) => setNewReview(prev => ({ ...prev, review: e.target.value }))}
                                placeholder="Share your experience with this product..."
                                rows={5}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                maxLength={2000}
                            />
                            <div className="text-xs text-gray-500 mt-1">
                                {newReview.review.length}/2000 characters
                            </div>
                        </div>

                        {/* Photo Upload */}
                        <ReviewPhotoUpload
                            photos={newReview.photos}
                            onPhotosChange={(photos) => setNewReview(prev => ({ ...prev, photos }))}
                        />

                        {/* Submit Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleAddReview}
                                disabled={submittingReview || !newReview.review.trim() || newReview.rating === 0}
                                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {submittingReview && <FaSpinner className="animate-spin" />}
                                {submittingReview ? 'Submitting...' : 'Submit Review'}
                            </button>
                            <button
                                onClick={() => setShowAddReview(false)}
                                disabled={submittingReview}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {loading && reviews.length > 0 && (
                    <div className="text-center py-4">
                        <FaSpinner className="animate-spin mx-auto text-blue-500" size={20} />
                    </div>
                )}

                {reviews.length === 0 && !loading ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <FaImage className="mx-auto text-gray-400 mb-4" size={48} />
                        <p className="text-gray-500 text-lg mb-2">No reviews yet</p>
                        <p className="text-gray-400">Be the first to review this product!</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <ReviewCard
                            key={review._id}
                            review={review}
                            user={user}
                            onLikeReview={() => {}} // Legacy support
                            onMarkHelpful={handleMarkHelpful}
                            onReportReview={handleReportReview}
                        />
                    ))
                )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={!pagination.hasPrevPage || loading}
                        className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                        Previous
                    </button>
                    
                    <span className="px-4 py-2">
                        Page {currentPage} of {pagination.totalPages}
                    </span>
                    
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                        disabled={!pagination.hasNextPage || loading}
                        className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default EnhancedReviews;