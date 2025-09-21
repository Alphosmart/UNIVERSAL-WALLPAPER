import React, { useState } from 'react';

/**
 * Optimized Image Component with lazy loading, error handling, and performance optimizations
 */
const OptimizedImage = ({ 
    src, 
    alt, 
    className = '', 
    width, 
    height, 
    loading = 'lazy',
    placeholder = '/placeholder-image.png' 
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const handleImageError = () => {
        setImageError(true);
        setImageLoaded(true);
    };

    return (
        <div className="relative overflow-hidden">
            {!imageLoaded && (
                <div 
                    className={`absolute inset-0 bg-gray-200 animate-pulse ${className}`}
                    style={{ width, height }}
                />
            )}
            <img
                src={imageError ? placeholder : src}
                alt={alt}
                className={`transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                } ${className}`}
                width={width}
                height={height}
                loading={loading}
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{
                    maxWidth: '100%',
                    height: 'auto'
                }}
            />
        </div>
    );
};

export default OptimizedImage;
