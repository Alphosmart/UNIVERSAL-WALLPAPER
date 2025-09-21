import React, { useState, useEffect, useCallback } from 'react';
import { FaStar, FaRegStar, FaThumbsUp, FaFlag } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const backendDomain = "http://localhost:8080";

const Reviews = ({ productId }) => {
    const user = useSelector(state => state?.user?.user);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddReview, setShowAddReview] = useState(false);
    const [newReview, setNewReview] = useState({ review: '', rating: 0 });
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    const fetchReviews = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${backendDomain}/api/products/${productId}/reviews?page=${currentPage}&limit=5`);
            const data = await response.json();
            
            if (data.success) {
                setReviews(data.data.reviews);
                setPagination(data.data.pagination);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    }, [productId, currentPage]);

    useEffect(() => {
        fetchReviews();
    }, [productId, currentPage, fetchReviews]);

    const handleAddReview = async () => {
        if (!user?._id) {
            alert('Please login to add a review');
            return;
        }

        if (!newReview.review.trim() || newReview.rating === 0) {
            alert('Please provide both a review and rating');
            return;
        }

        try {
            const response = await fetch(`${backendDomain}/api/products/${productId}/review`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newReview)
            });

            const data = await response.json();
            
            if (data.success) {
                setNewReview({ review: '', rating: 0 });
                setShowAddReview(false);
                fetchReviews(); // Refresh reviews
                alert('Review added successfully!');
            } else {
                alert(data.message || 'Failed to add review');
            }
        } catch (error) {
            console.error('Error adding review:', error);
            alert('Error adding review');
        }
    };

    const handleLikeReview = async (reviewId) => {
        if (!user?._id) {
            alert('Please login to like reviews');
            return;
        }

        try {
            const response = await fetch(`${backendDomain}/api/products/${productId}/review/${reviewId}/like`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            if (data.success) {
                // Update the reviews state to reflect the like change
                setReviews(prevReviews => 
                    prevReviews.map(review => 
                        review._id === reviewId 
                            ? { ...review, likes: data.data.liked 
                                ? [...(review.likes || []), user._id] 
                                : (review.likes || []).filter(id => id !== user._id)
                              }
                            : review
                    )
                );
            } else {
                alert(data.message || 'Failed to like review');
            }
        } catch (error) {
            console.error('Error liking review:', error);
            alert('Error liking review');
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
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
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">
                    Reviews ({pagination.totalReviews || 0})
                </h3>
                {user?._id && (
                    <button
                        onClick={() => setShowAddReview(!showAddReview)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        {showAddReview ? 'Cancel' : 'Write Review'}
                    </button>
                )}
            </div>

            {/* Add Review Form */}
            {showAddReview && (
                <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium mb-3">Write a Review</h4>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">Rating</label>
                            <div className="flex items-center gap-1">
                                {renderStars(newReview.rating, true, (rating) => 
                                    setNewReview(prev => ({ ...prev, rating }))
                                )}
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1">Review</label>
                            <textarea
                                value={newReview.review}
                                onChange={(e) => setNewReview(prev => ({ ...prev, review: e.target.value }))}
                                placeholder="Write your review here..."
                                rows={4}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        
                        <div className="flex gap-2">
                            <button
                                onClick={handleAddReview}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Submit Review
                            </button>
                            <button
                                onClick={() => setShowAddReview(false)}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                        No reviews yet. Be the first to review this product!
                    </p>
                ) : (
                    reviews.map((review) => (
                        <div key={review._id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium">{review.user?.name || 'Anonymous'}</span>
                                        <div className="flex items-center gap-1">
                                            {renderStars(review.rating)}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500">{formatDate(review.date)}</p>
                                </div>
                                
                                <div className="flex gap-2 items-center">
                                    <button 
                                        onClick={() => handleLikeReview(review._id)}
                                        className={`flex items-center gap-1 transition-colors ${
                                            review.likes && review.likes.includes(user?._id) 
                                                ? 'text-green-500' 
                                                : 'text-gray-400 hover:text-green-500'
                                        }`}
                                    >
                                        <FaThumbsUp size={14} />
                                        <span className="text-xs">{review.likes?.length || 0}</span>
                                    </button>
                                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                                        <FaFlag size={14} />
                                    </button>
                                </div>
                            </div>
                            
                            <p className="text-gray-700 leading-relaxed">{review.review}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={!pagination.hasPrevPage}
                        className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                        Previous
                    </button>
                    
                    <span className="px-3 py-1">
                        Page {currentPage} of {pagination.totalPages}
                    </span>
                    
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                        disabled={!pagination.hasNextPage}
                        className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Reviews;
