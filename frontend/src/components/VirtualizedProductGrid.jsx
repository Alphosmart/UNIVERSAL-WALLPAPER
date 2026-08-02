import React, { useMemo, useCallback } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { Link } from 'react-router-dom';
import LazyImage from './LazyImage';
import SocialFeatures from './SocialFeatures';
import { formatCurrency } from '../helper/settingsUtils';

const ProductCard = React.memo(({ product, style, onClick }) => {
  const formatPrice = useMemo(() => (price) => {
    return formatCurrency(price);
  }, []);

  return (
    <div style={style} className="p-2">
      <Link 
        to={`/product/${product._id}`} 
        className="block w-full bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
        onClick={onClick}
      >
        <div className="relative overflow-hidden rounded-t-lg">
          {/* Discount badge */}
          {product.displayPrice && product.originalPrice && product.originalPrice > product.displayPrice && (
            <div className="absolute top-1 left-1 bg-red-600 text-white text-xs px-1 py-0.5 rounded z-10">
              -{Math.round(((product.originalPrice - product.displayPrice) / product.originalPrice) * 100)}%
            </div>
          )}
          
          <LazyImage 
            src={product.productImage} 
            alt={product.productName}
            className="w-full h-32 object-cover"
            fallbackSrc="/api/placeholder/300/300"
          />
          
          {/* Stock indicator */}
          {product.stock <= 10 && (
            <div className="absolute bottom-1 left-1 right-1">
              <div className="bg-white bg-opacity-90 rounded px-1 py-0.5">
                <div className="flex items-center gap-1">
                  <div className="text-xs text-gray-600">Stock:</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-1">
                    <div 
                      className={`h-1 rounded-full ${
                        product.stock <= 3 ? 'bg-red-500' : 
                        product.stock <= 7 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((product.stock / 10) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs font-semibold">{product.stock}</div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-2">
          <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.productName}</h3>
          <p className="text-xs text-gray-600 mb-1">{product.brandName}</p>
          
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-sm font-semibold text-red-600">
                {formatPrice(product.displayPrice || product.sellingPrice)}
              </p>
              {product.originalPrice && product.originalPrice > (product.displayPrice || product.sellingPrice) && (
                <p className="text-xs text-gray-500 line-through">
                  {formatPrice(product.originalPrice || product.price)}
                </p>
              )}
            </div>
            {product.socialFeatures && (
              <div className="text-xs text-gray-500">
                ⭐ {product.socialFeatures.averageRating || 0}
              </div>
            )}
          </div>
          
          <SocialFeatures productId={product._id} />
        </div>
      </Link>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

const VirtualizedProductGrid = ({ 
  products, 
  containerHeight = 600,
  itemWidth = 200,
  itemHeight = 280,
  onProductClick
}) => {
  const containerWidth = window.innerWidth - 32; // Account for padding
  const columnCount = Math.floor(containerWidth / itemWidth);
  const rowCount = Math.ceil(products.length / columnCount);

  const Cell = useCallback(({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    const product = products[index];

    if (!product) return null;

    return (
      <ProductCard 
        key={product._id}
        product={product} 
        style={style}
        onClick={() => onProductClick && onProductClick(product)}
      />
    );
  }, [products, columnCount, onProductClick]);

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Grid
        columnCount={columnCount}
        columnWidth={itemWidth}
        height={containerHeight}
        rowCount={rowCount}
        rowHeight={itemHeight}
        width={containerWidth}
        style={{ margin: '0 auto' }}
      >
        {Cell}
      </Grid>
    </div>
  );
};

export default VirtualizedProductGrid;