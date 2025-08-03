import React, { useEffect, useState, useCallback, memo, useMemo } from 'react'
import { Link } from 'react-router-dom'
import SummaryApi from '../common'

const VerticalCardProduct = memo(({ category, heading }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchCategoryProduct = useCallback(async () => {
        setLoading(true)
        try {
            // Fetch all products without requiring authentication
            const response = await fetch(SummaryApi.allProduct.url, {
                method: SummaryApi.allProduct.method,
                credentials: 'include', // Include credentials but don't require auth
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const dataResponse = await response.json()

            if (dataResponse.success) {
                let productsToShow = dataResponse.data
                
                // If category is specified, filter by category
                if (category && category !== 'all') {
                    productsToShow = dataResponse.data.filter(product => 
                        product.category?.toLowerCase() === category?.toLowerCase()
                    )
                }
                
                setData(productsToShow)
            } else {
                console.log('API Response:', dataResponse.message)
                setData([])
            }
        } catch (error) {
            console.error('Error fetching products:', error)
            setData([])
        } finally {
            setLoading(false)
        }
    }, [category])

    useEffect(() => {
        fetchCategoryProduct()
    }, [fetchCategoryProduct])

    // Memoized price formatter
    const formatPrice = useMemo(() => (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price)
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
            <div className='grid grid-cols-[repeat(auto-fit,minmax(260px,300px))] justify-center md:justify-between md:gap-4 overflow-x-scroll scrollbar-none transition-all'>
                {data.map((product) => (
                    <Link key={product._id} to={`/product/${product._id}`} className='w-full min-w-[260px] md:min-w-[300px] max-w-[260px] md:max-w-[300px] bg-white rounded-sm shadow hover:shadow-lg transition-shadow'>
                        <div className='bg-slate-200 h-48 p-4 min-w-[260px] md:min-w-[300px] flex justify-center items-center'>
                            <img 
                                src={product.productImage[0]} 
                                alt={product.productName}
                                loading="lazy"
                                className='object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply'
                                onError={(e) => {
                                    e.target.src = '/placeholder-image.png'; // Fallback image
                                }}
                            />
                        </div>
                        <div className='p-4 grid gap-3'>
                            <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black'>
                                {product.productName}
                            </h2>
                            <p className='capitalize text-slate-500'>{product.category}</p>
                            <div className='flex gap-3'>
                                <p className='text-red-600 font-medium'>{formatPrice(product.sellingPrice)}</p>
                                <p className='text-slate-500 line-through'>{formatPrice(product.price)}</p>
                            </div>
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
