import React, { useEffect, useState, useCallback, memo, useMemo } from 'react'

import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";

import SummaryApi from '../common'

const BannerProduct = memo(() => {
    const [currentImage, setCurrentImage] = useState(0)
    const [banners, setBanners] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Fallback images (original static images)
    const fallbackDesktopImages = useMemo(() => [
        '/api/placeholder/800/400?text=Banner+1',
        '/api/placeholder/800/400?text=Banner+2',
        '/api/placeholder/800/400?text=Banner+3',
        '/api/placeholder/800/400?text=Banner+4',
        '/api/placeholder/800/400?text=Banner+5'
    ], [])

    const fallbackMobileImages = useMemo(() => [
        '/api/placeholder/400/200?text=Mobile+Banner+1',
        '/api/placeholder/400/200?text=Mobile+Banner+2',
        '/api/placeholder/400/200?text=Mobile+Banner+3',
        '/api/placeholder/400/200?text=Mobile+Banner+4',
        '/api/placeholder/400/200?text=Mobile+Banner+5'
    ], [])

    // Fetch banners from API
    const fetchBanners = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            
            const response = await fetch(SummaryApi.getBanners.url, {
                method: SummaryApi.getBanners.method,
                credentials: 'include'
            })

            if (!response.ok) {
                throw new Error('Failed to fetch banners')
            }

            const result = await response.json()

            if (result.success && result.data && result.data.length > 0) {
                setBanners(result.data)
            } else {
                // Use fallback if no banners found
                setBanners([])
            }
        } catch (error) {
            console.error('Error fetching banners:', error)
            setError(error.message)
            setBanners([]) // Use fallback on error
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchBanners()
    }, [fetchBanners])

    // Use dynamic banners if available, otherwise use fallback
    const desktopImages = useMemo(() => {
        if (banners.length > 0) {
            return banners.map(banner => banner.desktopImage)
        }
        return fallbackDesktopImages
    }, [banners, fallbackDesktopImages])

    const mobileImages = useMemo(() => {
        if (banners.length > 0) {
            return banners.map(banner => banner.mobileImage)
        }
        return fallbackMobileImages
    }, [banners, fallbackMobileImages])

    const nextImage = useCallback(() => {
        if (desktopImages.length - 1 > currentImage) {
            setCurrentImage(prev => prev + 1)
        }
    }, [currentImage, desktopImages.length])

    const preveImage = useCallback(() => {
        if (currentImage !== 0) {
            setCurrentImage(prev => prev - 1)
        }
    }, [currentImage])

    // Auto-advance carousel
    useEffect(() => {
        if (desktopImages.length === 0) return
        
        const interval = setInterval(() => {
            if (desktopImages.length - 1 > currentImage) {
                nextImage()
            } else {
                setCurrentImage(0)
            }
        }, 5000)

        return () => clearInterval(interval)
    }, [currentImage, desktopImages.length, nextImage])

    // Handle banner click
    const handleBannerClick = (banner) => {
        if (banner?.linkUrl) {
            // Open external links in new tab
            if (banner.linkUrl.startsWith('http')) {
                window.open(banner.linkUrl, '_blank', 'noopener,noreferrer')
            } else {
                // Navigate internally
                window.location.href = banner.linkUrl
            }
        }
    }

    if (loading) {
        return (
            <div className='container mx-auto px-4 rounded'>
                <div className='h-56 md:h-72 w-full bg-slate-200 relative rounded animate-pulse'>
                    <div className="flex items-center justify-center h-full">
                        <div className="text-gray-500">Loading banners...</div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='container mx-auto px-4 rounded'>
            <div className='h-56 md:h-72 w-full bg-slate-200 relative'>
                <div className='absolute z-10 h-full w-full md:flex items-center hidden'>
                    <div className='flex justify-between w-full text-2xl'>
                        <button 
                            onClick={preveImage} 
                            className='bg-white shadow-md rounded-full p-1 hover:bg-gray-100 transition-colors'
                            disabled={currentImage === 0}
                        >
                            <FaAngleLeft />
                        </button>
                        <button 
                            onClick={nextImage} 
                            className='bg-white shadow-md rounded-full p-1 hover:bg-gray-100 transition-colors'
                            disabled={currentImage === desktopImages.length - 1}
                        >
                            <FaAngleRight />
                        </button> 
                    </div>
                </div>

                {/* Desktop and tablet version */}
                <div className='hidden md:flex h-full w-full overflow-hidden'>
                    {desktopImages.map((imageUrl, index) => {
                        const banner = banners[index]
                        return (
                            <div 
                                key={banner?._id || `desktop-banner-${index}`} 
                                className={`w-full h-full min-w-full min-h-full transition-all ${
                                    banner?.linkUrl ? 'cursor-pointer' : ''
                                }`}
                                style={{ transform: `translateX(-${currentImage * 100}%)` }}
                                onClick={() => banner && handleBannerClick(banner)}
                            >
                                <img 
                                    src={imageUrl} 
                                    className='w-full h-full object-cover'
                                    alt={banner?.title || `Banner ${index + 1}`}
                                    onError={(e) => {
                                        e.target.src = `/api/placeholder/800/400?text=Banner+${index + 1}`
                                    }}
                                />
                                {/* Overlay with banner info */}
                                {banner?.title && (
                                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded">
                                        <h3 className="font-semibold">{banner.title}</h3>
                                        {banner.description && (
                                            <p className="text-sm opacity-90">{banner.description}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Mobile version */}
                <div className='flex h-full w-full overflow-hidden md:hidden'>
                    {mobileImages.map((imageUrl, index) => {
                        const banner = banners[index]
                        return (
                            <div 
                                key={banner?._id || `mobile-banner-${index}`} 
                                className={`w-full h-full min-w-full min-h-full transition-all ${
                                    banner?.linkUrl ? 'cursor-pointer' : ''
                                }`}
                                style={{ transform: `translateX(-${currentImage * 100}%)` }}
                                onClick={() => banner && handleBannerClick(banner)}
                            >
                                <img 
                                    src={imageUrl} 
                                    className='w-full h-full object-cover'
                                    alt={banner?.title || `Mobile Banner ${index + 1}`}
                                    onError={(e) => {
                                        e.target.src = `/api/placeholder/400/200?text=Mobile+Banner+${index + 1}`
                                    }}
                                />
                                {/* Overlay with banner info */}
                                {banner?.title && (
                                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded text-sm">
                                        <h3 className="font-semibold text-xs">{banner.title}</h3>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Dots indicator */}
                {desktopImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {desktopImages.map((_, index) => {
                            const banner = banners[index]
                            return (
                                <button
                                    key={banner?._id || `dot-indicator-${index}`}
                                    onClick={() => setCurrentImage(index)}
                                    className={`w-3 h-3 rounded-full transition-colors ${
                                        currentImage === index ? 'bg-white' : 'bg-white bg-opacity-50'
                                    }`}
                                />
                            )
                        })}
                    </div>
                )}

                {/* Error message */}
                {error && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded text-sm">
                        Failed to load banners
                    </div>
                )}
            </div>
        </div>
    )
})

BannerProduct.displayName = 'BannerProduct'

export default BannerProduct
