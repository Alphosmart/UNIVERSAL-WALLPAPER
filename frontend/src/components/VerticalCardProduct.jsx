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
                <div className='grid grid-cols-[repeat(auto-fit,minmax(260px,300px))] justify-center md:justify-between md:gap-4 overflow-x-scroll scrollbar-none transition-all'>
                    {[1,2,3].map((item) => (
                        <div key={item} className='w-full min-w-[260px] md:min-w-[300px] max-w-[260px] md:max-w-[300px] bg-white rounded-sm shadow'>
                            <div className='bg-slate-200 h-48 p-4 min-w-[260px] md:min-w-[300px] flex justify-center items-center'>
                                <div className='w-full h-full bg-slate-300 rounded animate-pulse'></div>
                            </div>
                            <div className='p-4 grid gap-3'>
                                <div className='h-4 bg-slate-300 rounded w-full animate-pulse'></div>
                                <div className='h-3 bg-slate-300 rounded w-3/4 animate-pulse'></div>
                                <div className='flex gap-3'>
                                    <div className='h-4 bg-slate-300 rounded w-1/3 animate-pulse'></div>
                                    <div className='h-4 bg-slate-300 rounded w-1/3 animate-pulse'></div>
                                </div>
                                <div className='h-8 bg-slate-300 rounded w-full animate-pulse'></div>
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
            
            <div className='grid grid-cols-[repeat(auto-fit,minmax(260px,300px))] justify-center md:justify-between md:gap-4 overflow-x-scroll scrollbar-none transition-all'>
                {data.map((product, index) => (
                    <Link key={product._id} to={`/product/${product._id}`} className='w-full min-w-[260px] md:min-w-[300px] max-w-[260px] md:max-w-[300px] bg-white rounded-sm shadow hover:shadow-lg transition-shadow'>
                        <div 
                            className='bg-slate-200 h-48 p-4 min-w-[260px] md:min-w-[300px] flex justify-center items-center relative group'
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
                        <div className='p-4 grid gap-3'>
                            <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black'>
                                {product.productName}
                            </h2>
                            <p className='capitalize text-slate-500'>{product.category}</p>
                            <div className='flex gap-3'>
                                <p className='text-red-600 font-medium'>
                                    {product.displayPricing?.formatted?.sellingPrice || formatPrice(product.sellingPrice)}
                                </p>
                                <p className='text-slate-500 line-through'>
                                    {product.displayPricing?.formatted?.originalPrice || formatPrice(product.price)}
                                </p>
                            </div>
                            {product.originalCurrency && product.displayPricing?.currency && 
                             product.originalCurrency !== product.displayPricing.currency && (
                                <p className='text-xs text-gray-400'>
                                    Original: {product.originalCurrency} • Converted from seller's local price
                                </p>
                            )}
                            
                            {/* Social features */}
                            <SocialFeatures product={product} compact={true} />
                            
                            <button className='text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full'>
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
