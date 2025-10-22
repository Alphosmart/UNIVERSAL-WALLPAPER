import React, { useEffect, useState, memo, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import { formatCurrency } from '../helper/settingsUtils'
import SocialFeatures from './SocialFeatures'

const VerticalCardProduct = memo(({ category, heading }) => {
    console.log('🔍 VerticalCardProduct: Rendered with category:', category, 'heading:', heading);
    console.log('🔍 VerticalCardProduct: Component mounted/updated at:', new Date().toISOString());
    
    const { getProductsByCategory, loading: globalLoading, allProducts, error } = useProducts()
    const [loading, setLoading] = useState(true)
    const [hoveredProduct, setHoveredProduct] = useState(null)
    const [currentImageIndex, setCurrentImageIndex] = useState({})

    console.log('🔍 VerticalCardProduct: Context state:', { 
        globalLoading, 
        allProductsLength: allProducts.length,
        category,
        error,
        allProductsSample: allProducts.slice(0, 2).map(p => ({ id: p._id, name: p.productName }))
    });

    // Get filtered products from context instead of making API call
    const data = useMemo(() => {
        if (globalLoading || allProducts.length === 0) {
            console.log('🔍 VerticalCardProduct: No data available - globalLoading:', globalLoading, 'allProducts:', allProducts.length);
            return []
        }
        const products = getProductsByCategory(category);
        console.log('🔍 VerticalCardProduct: Got', products.length, 'products for category:', category);
        return products;
    }, [getProductsByCategory, category, globalLoading, allProducts.length])

    // Update loading state based on context
    useEffect(() => {
        setLoading(globalLoading || allProducts.length === 0)
    }, [globalLoading, allProducts.length])

    // Memoized price formatter that uses user's currency settings
    const formatPrice = useMemo(() => (price) => {
        return formatCurrency(price)
    }, [])

    if (loading) {
        return (
            <div className='container mx-auto px-4 my-6 relative'>
                <h2 className='text-2xl font-semibold py-4'>{heading}</h2>
                <div className='flex overflow-x-auto gap-3 pb-4 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-4 md:gap-6 sm:justify-items-center scrollbar-hide'>
                    {[1,2,3,4,5].map((item) => (
                        <div key={item} className='flex-shrink-0 w-[160px] sm:w-full sm:max-w-[280px] bg-white rounded-lg shadow'>
                            <div className='bg-slate-200 h-32 sm:h-48 p-2 sm:p-4 flex justify-center items-center rounded-t-lg'>
                                <div className='w-full h-full bg-slate-300 rounded animate-pulse'></div>
                            </div>
                            <div className='p-2 sm:p-4 grid gap-1 sm:gap-3'>
                                <div className='h-3 sm:h-4 bg-slate-300 rounded w-full animate-pulse'></div>
                                <div className='h-2 sm:h-3 bg-slate-300 rounded w-3/4 animate-pulse'></div>
                                <div className='flex gap-1 sm:gap-3'>
                                    <div className='h-3 sm:h-4 bg-slate-300 rounded w-1/3 animate-pulse'></div>
                                    <div className='h-3 sm:h-4 bg-slate-300 rounded w-1/3 animate-pulse'></div>
                                </div>
                                <div className='h-6 sm:h-8 bg-slate-300 rounded w-full animate-pulse'></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const noData = !loading && (!data || data.length === 0)

    if (noData) {
        return (
            <div className='container mx-auto px-4 my-6 relative'>
                <h2 className='text-2xl font-semibold py-4'>{heading}</h2>
                <p className='text-center text-gray-500 py-8'>No products available in this category</p>
            </div>
        )
    }

    return (
        <div className='container mx-auto px-4 my-6 relative'>
            <h2 className='text-2xl font-semibold py-4'>{heading}</h2>
            
            {/* Mobile: Horizontal scroll, Desktop: Grid */}
            <div className='flex overflow-x-auto gap-3 pb-4 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-4 md:gap-6 sm:justify-items-center scrollbar-hide'>
                {data.map((product, index) => (
                    <Link key={product._id} to={`/product/${product._id}`} className='flex-shrink-0 w-[160px] sm:w-full sm:max-w-[280px] bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 transform hover:scale-105'>
                        <div 
                            className='bg-slate-200 h-32 sm:h-48 p-2 sm:p-4 flex justify-center items-center relative group rounded-t-lg'
                            onMouseEnter={() => setHoveredProduct(product._id)}
                            onMouseLeave={() => setHoveredProduct(null)}
                        >
                            <img 
                                src={hoveredProduct === product._id && product.productImage.length > 1 
                                    ? product.productImage[currentImageIndex[product._id] || 1] || product.productImage[0]
                                    : product.productImage[0]
                                } 
                                alt={product.productName}
                                loading="lazy"
                                className='object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply'
                                onError={(e) => {
                                    e.target.src = '/placeholder-image.png'; // Fallback image
                                }}
                            />
                            
                            {/* Image indicators for products with multiple images */}
                            {product.productImage.length > 1 && (
                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {product.productImage.slice(0, 4).map((_, imgIndex) => (
                                        <div
                                            key={imgIndex}
                                            className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                                                (hoveredProduct === product._id ? currentImageIndex[product._id] || 0 : 0) === imgIndex
                                                    ? 'bg-red-600'
                                                    : 'bg-gray-400'
                                            }`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setCurrentImageIndex(prev => ({
                                                    ...prev,
                                                    [product._id]: imgIndex
                                                }));
                                            }}
                                        />
                                    ))}
                                    {product.productImage.length > 4 && (
                                        <span className="text-xs text-gray-600 ml-1">+{product.productImage.length - 4}</span>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className='p-2 sm:p-4 grid gap-1 sm:gap-3'>
                            <h2 className='font-medium text-xs sm:text-base md:text-lg text-ellipsis line-clamp-1 text-black'>
                                {product.productName}
                            </h2>
                            <div className='flex gap-1 sm:gap-3 flex-wrap'>
                                <p className='text-red-600 font-medium text-xs sm:text-base'>
                                    {product.displayPricing?.formatted?.sellingPrice || formatPrice(product.sellingPrice)}
                                </p>
                                {product.price && product.sellingPrice && product.price > product.sellingPrice && (
                                    <p className='text-slate-500 line-through text-xs sm:text-base'>
                                        {product.displayPricing?.formatted?.originalPrice || formatPrice(product.price)}
                                    </p>
                                )}
                            </div>
                            
                            {/* Stock indicator like in the image */}
                            <p className='text-xs text-orange-600 font-medium'>
                                {product.stock > 0 ? `${product.stock} items left` : 'In Stock'}
                            </p>
                            
                            {/* Mobile: Compact social features, Desktop: Full */}
                            <div className='hidden sm:block'>
                                <SocialFeatures product={product} compact={true} />
                            </div>
                            
                            <button className='text-xs sm:text-sm bg-red-600 hover:bg-red-700 text-white px-2 py-1 sm:px-3 sm:py-0.5 rounded-full'>
                                Add to Cart
                            </button>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
})

export default VerticalCardProduct
