import React, { useEffect, useState, memo, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import { formatCurrency } from '../helper/settingsUtils'
import SocialFeatures from './SocialFeatures'

const HorizontalCardProduct = memo(({ category, heading }) => {
    const { getProductsByCategory, loading: globalLoading, allProducts } = useProducts()
    const [loading, setLoading] = useState(true)
    const [hoveredProduct, setHoveredProduct] = useState(null)
    const [currentImageIndex, setCurrentImageIndex] = useState({})

    // Get filtered products from context instead of making API call
    const data = useMemo(() => {
        if (globalLoading || allProducts.length === 0) {
            return []
        }
        const categoryProducts = getProductsByCategory(category)
        return categoryProducts.slice(0, 6) // Limit to 6 items for horizontal scroll
    }, [getProductsByCategory, category, globalLoading, allProducts.length])

    // Update loading state based on context
    useEffect(() => {
        setLoading(globalLoading || allProducts.length === 0)
    }, [globalLoading, allProducts.length])

    const formatPrice = useMemo(() => (price) => {
        return formatCurrency(price)
    }, [])

    if (loading) {
        return (
            <div className='container mx-auto px-4 my-6 relative'>
                <h2 className='text-2xl font-semibold py-4'>{heading}</h2>
                <div className='flex items-center gap-4 md:gap-6 overflow-scroll scrollbar-none transition-all'>
                    {[1,2,3].map((item) => (
                        <div key={item} className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 bg-white rounded-sm shadow flex'>
                            <div className='bg-slate-200 h-full p-4 min-w-[120px] md:min-w-[145px]'>
                                <div className='w-full h-full bg-slate-300 rounded animate-pulse'></div>
                            </div>
                            <div className='p-4 grid'>
                                <div className='h-4 bg-slate-300 rounded w-full mb-2 animate-pulse'></div>
                                <div className='h-3 bg-slate-300 rounded w-3/4 mb-2 animate-pulse'></div>
                                <div className='h-4 bg-slate-300 rounded w-1/2 animate-pulse'></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <div className='container mx-auto px-4 my-6 relative'>
                <h2 className='text-2xl font-semibold py-4'>{heading}</h2>
                <div className='text-center py-8 text-gray-500'>
                    No products available in this category yet.
                </div>
            </div>
        )
    }

    return (
        <div className='container mx-auto px-4 my-6 relative'>
            <h2 className='text-2xl font-semibold py-4'>{heading}</h2>
            <div className='flex items-center gap-4 md:gap-6 overflow-scroll scrollbar-none transition-all'>
                {data.map((product) => (
                    <Link key={product._id} to={`/product/${product._id}`} className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 bg-white rounded-sm shadow hover:shadow-lg transition-shadow flex'>
                        <div 
                            className='bg-slate-200 h-full p-4 min-w-[120px] md:min-w-[145px] flex justify-center items-center relative group'
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
                                className='object-scale-down h-full hover:scale-105 transition-all mix-blend-multiply'
                                onError={(e) => {
                                    e.target.src = '/placeholder-image.png';
                                }}
                            />
                            
                            {/* Image indicators for products with multiple images */}
                            {product.productImage.length > 1 && (
                                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {product.productImage.slice(0, 3).map((_, imgIndex) => (
                                        <div
                                            key={imgIndex}
                                            className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-colors ${
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
                                    {product.productImage.length > 3 && (
                                        <span className="text-xs text-gray-600 ml-1">+{product.productImage.length - 3}</span>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className='p-4 grid gap-1'>
                            <h2 className='font-medium text-sm md:text-base text-ellipsis line-clamp-2 text-black'>
                                {product.productName}
                            </h2>
                            <p className='capitalize text-slate-500 text-xs'>{product.category}</p>
                            <div className='flex gap-2 items-center'>
                                <p className='text-red-600 font-medium text-sm'>
                                    {product.displayPricing?.formatted?.sellingPrice || formatPrice(product.sellingPrice)}
                                </p>
                                <p className='text-slate-500 line-through text-xs'>
                                    {product.displayPricing?.formatted?.originalPrice || formatPrice(product.price)}
                                </p>
                            </div>
                            {product.originalCurrency && product.displayPricing?.currency && 
                             product.originalCurrency !== product.displayPricing.currency && (
                                <p className='text-xs text-gray-400'>
                                    From {product.originalCurrency}
                                </p>
                            )}
                            
                            {/* Social features */}
                            <SocialFeatures product={product} compact={true} />
                            
                            <button className='text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-full w-fit'>
                                Add to Cart
                            </button>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
})

HorizontalCardProduct.displayName = 'HorizontalCardProduct'

export default HorizontalCardProduct
