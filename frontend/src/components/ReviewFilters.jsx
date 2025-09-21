import React from 'react';
import { FaStar, FaFilter, FaSort } from 'react-icons/fa';

const ReviewFilters = ({ 
  filters, 
  onFiltersChange, 
  sortBy, 
  onSortChange, 
  totalReviews, 
  averageRating,
  ratingDistribution = {}
}) => {
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'highest', label: 'Highest Rating' },
    { value: 'lowest', label: 'Lowest Rating' },
    { value: 'helpful', label: 'Most Helpful' },
  ];

  const handleRatingFilter = (rating) => {
    const currentRatings = filters.ratings || [];
    const newRatings = currentRatings.includes(rating)
      ? currentRatings.filter(r => r !== rating)
      : [...currentRatings, rating];
    
    onFiltersChange({
      ...filters,
      ratings: newRatings
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      ratings: [],
      verified: false,
      withPhotos: false
    });
  };

  const hasActiveFilters = (filters.ratings && filters.ratings.length > 0) || 
                          filters.verified || 
                          filters.withPhotos;

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <FaStar 
          key={index} 
          className={starValue <= rating ? 'text-yellow-400' : 'text-gray-300'} 
          size={12}
        />
      );
    });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
      {/* Review Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Reviews ({totalReviews})
          </h3>
          {averageRating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {renderStars(Math.round(averageRating))}
              </div>
              <span className="text-sm text-gray-600">
                {averageRating.toFixed(1)} out of 5
              </span>
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <FaSort className="text-gray-500" size={14} />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-500" size={14} />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Rating Filters */}
          <div className="flex flex-wrap gap-1">
            {[5, 4, 3, 2, 1].map(rating => (
              <button
                key={rating}
                onClick={() => handleRatingFilter(rating)}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border transition-colors ${
                  filters.ratings?.includes(rating)
                    ? 'bg-yellow-100 border-yellow-300 text-yellow-800'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  {renderStars(rating)}
                </div>
                {ratingDistribution[rating] && (
                  <span className="ml-1">({ratingDistribution[rating]})</span>
                )}
              </button>
            ))}
          </div>

          {/* Other Filters */}
          <button
            onClick={() => onFiltersChange({ ...filters, verified: !filters.verified })}
            className={`px-3 py-1 rounded-full text-xs border transition-colors ${
              filters.verified
                ? 'bg-green-100 border-green-300 text-green-800'
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Verified Purchases
          </button>

          <button
            onClick={() => onFiltersChange({ ...filters, withPhotos: !filters.withPhotos })}
            className={`px-3 py-1 rounded-full text-xs border transition-colors ${
              filters.withPhotos
                ? 'bg-blue-100 border-blue-300 text-blue-800'
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            With Photos
          </button>
        </div>
      </div>

      {/* Rating Distribution (Optional) */}
      {Object.keys(ratingDistribution).length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Rating Breakdown</h4>
          <div className="space-y-1">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = ratingDistribution[rating] || 0;
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center gap-2 text-sm">
                  <span className="w-8 text-right">{rating}</span>
                  <FaStar className="text-yellow-400" size={12} />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-gray-600 w-12 text-right">
                    {count > 0 ? count : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewFilters;