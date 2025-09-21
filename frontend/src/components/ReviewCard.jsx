import React, { useState } from 'react';
import { FaStar, FaRegStar, FaThumbsUp, FaThumbsDown, FaFlag, FaCheckCircle, FaTimes } from 'react-icons/fa';

const ReviewCard = ({ review, user, onLikeReview, onReportReview, onMarkHelpful }) => {
  const [showFullPhotos, setShowFullPhotos] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <span key={index} className="text-yellow-400">
          {starValue <= rating ? <FaStar size={14} /> : <FaRegStar size={14} />}
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

  const handleMarkHelpful = (isHelpful) => {
    if (!user?._id) {
      alert('Please login to mark reviews as helpful');
      return;
    }
    onMarkHelpful(review._id, isHelpful);
  };

  const isLongReview = review.review.length > 300;
  const displayText = expanded || !isLongReview 
    ? review.review 
    : review.review.substring(0, 300) + '...';

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      {/* Review Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {/* User Avatar */}
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {(review.user?.name || 'A').charAt(0).toUpperCase()}
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-800">
                  {review.user?.name || 'Anonymous'}
                </span>
                {review.verified && (
                  <FaCheckCircle className="text-green-500" size={12} title="Verified Purchase" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {renderStars(review.rating)}
                </div>
                <span className="text-sm text-gray-500">{formatDate(review.date)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 items-center">
          <button
            onClick={() => handleMarkHelpful(true)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
              review.helpfulVotes?.helpful?.includes(user?._id)
                ? 'bg-green-100 text-green-700'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Mark as helpful"
          >
            <FaThumbsUp size={12} />
            <span>{review.helpfulVotes?.helpful?.length || 0}</span>
          </button>
          
          <button
            onClick={() => handleMarkHelpful(false)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
              review.helpfulVotes?.notHelpful?.includes(user?._id)
                ? 'bg-red-100 text-red-700'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Mark as not helpful"
          >
            <FaThumbsDown size={12} />
            <span>{review.helpfulVotes?.notHelpful?.length || 0}</span>
          </button>

          <button
            onClick={() => onReportReview(review._id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            title="Report review"
          >
            <FaFlag size={12} />
          </button>
        </div>
      </div>

      {/* Review Title (if exists) */}
      {review.title && (
        <h4 className="font-semibold text-gray-800 mb-2">{review.title}</h4>
      )}

      {/* Review Text */}
      <div className="mb-3">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {displayText}
        </p>
        {isLongReview && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 hover:text-blue-800 text-sm mt-1 font-medium"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Review Photos */}
      {review.photos && review.photos.length > 0 && (
        <div className="mb-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {review.photos.map((photo, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => {
                  setSelectedPhotoIndex(index);
                  setShowFullPhotos(true);
                }}
              >
                <img
                  src={photo.url || photo}
                  alt="Review attachment"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Stats */}
      {(review.helpfulVotes?.helpful?.length > 0 || review.helpfulVotes?.notHelpful?.length > 0) && (
        <div className="text-xs text-gray-500 border-t pt-2">
          {review.helpfulVotes.helpful?.length > 0 && (
            <span>
              {review.helpfulVotes.helpful.length} people found this helpful
            </span>
          )}
          {review.helpfulVotes.helpful?.length > 0 && review.helpfulVotes.notHelpful?.length > 0 && (
            <span className="mx-2">•</span>
          )}
          {review.helpfulVotes.notHelpful?.length > 0 && (
            <span>
              {review.helpfulVotes.notHelpful.length} people found this not helpful
            </span>
          )}
        </div>
      )}

      {/* Photo Modal */}
      {showFullPhotos && review.photos && review.photos.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-4xl p-4">
            <button
              onClick={() => setShowFullPhotos(false)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10"
            >
              <FaTimes />
            </button>
            
            <img
              src={review.photos[selectedPhotoIndex]?.url || review.photos[selectedPhotoIndex]}
              alt="Review attachment fullscreen"
              className="max-w-full max-h-full object-contain"
            />
            
            {review.photos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {review.photos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPhotoIndex(index)}
                    className={`w-3 h-3 rounded-full ${
                      selectedPhotoIndex === index ? 'bg-white' : 'bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;