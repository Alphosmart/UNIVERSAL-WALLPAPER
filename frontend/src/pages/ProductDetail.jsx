import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaStar, FaStarHalf, FaShoppingCart, FaHeart, FaRegHeart, FaPlus, FaMinus, FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import { useCart } from '../context/CartContext';
import SocialFeatures from '../components/SocialFeatures';
import EnhancedReviews from '../components/EnhancedReviews';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [relatedLoading, setRelatedLoading] = useState(false);
    const { addToCart, isInCart, getCartItem } = useCart();

    const fetchProductDetails = useCallback(async () => {
        try {
            const response = await fetch(`${SummaryApi.getSingleProduct.url}/${id}`, {
                method: SummaryApi.getSingleProduct.method
            });
            const data = await response.json();

            if (data.success) {
                setProduct(data.data);
                setSelectedImage(data.data.productImage[0] || '');
                setCurrentImageIndex(0);
            } else {
                toast.error(data.message || 'Product not found');
                navigate('/');
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error('Failed to load product details');
            navigate('/');
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    const fetchRelatedProducts = useCallback(async (category, currentProductId) => {
        try {
            setRelatedLoading(true);
            const response = await fetch(SummaryApi.allProduct.url);
            const data = await response.json();

            if (data.success) {
                // Filter products by same category, excluding current product
                const related = data.data.filter(product => 
                    product.category === category && 
                    product._id !== currentProductId &&
                    product.status === 'ACTIVE'
                ).slice(0, 8); // Limit to 8 products
                
                setRelatedProducts(related);
            }
        } catch (error) {
            console.error('Error fetching related products:', error);
        } finally {
            setRelatedLoading(false);
        }
    }, []);

    useEffect(() => {
        if (id) {
            fetchProductDetails();
        }
    }, [id, fetchProductDetails]);

    useEffect(() => {
        if (product) {
            fetchRelatedProducts(product.category, product._id);
        }
    }, [product, fetchRelatedProducts]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const handleAddToCart = () => {
        if (!product) return;
        
        addToCart(product, quantity);
    };

    const handleBuyNow = () => {
        if (!product) return;
        
        // Add to cart first, then navigate to cart
        addToCart(product, quantity);
        navigate('/cart');
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    };

    const increaseQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const getDiscountPercentage = () => {
        if (product.price && product.sellingPrice && product.price > product.sellingPrice) {
            return Math.round(((product.price - product.sellingPrice) / product.price) * 100);
        }
        return 0;
    };

    const handleImageChange = useCallback((image, index) => {
        setSelectedImage(image);
        setCurrentImageIndex(index);
    }, []);

    const handleNextImage = useCallback(() => {
        if (product?.productImage && product.productImage.length > 1) {
            const nextIndex = (currentImageIndex + 1) % product.productImage.length;
            handleImageChange(product.productImage[nextIndex], nextIndex);
        }
    }, [product?.productImage, currentImageIndex, handleImageChange]);

    const handlePrevImage = useCallback(() => {
        if (product?.productImage && product.productImage.length > 1) {
            const prevIndex = currentImageIndex === 0 ? product.productImage.length - 1 : currentImageIndex - 1;
            handleImageChange(product.productImage[prevIndex], prevIndex);
        }
    }, [product?.productImage, currentImageIndex, handleImageChange]);

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    // Keyboard navigation for fullscreen mode
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (isFullscreen) {
                switch (event.key) {
                    case 'Escape':
                        setIsFullscreen(false);
                        break;
                    case 'ArrowRight':
                        handleNextImage();
                        break;
                    case 'ArrowLeft':
                        handlePrevImage();
                        break;
                    default:
                        break;
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isFullscreen, handleNextImage, handlePrevImage]);

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
                    <div>
                        <div className="w-full h-96 bg-gray-300 rounded mb-4"></div>
                        <div className="flex gap-2">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="w-20 h-20 bg-gray-300 rounded"></div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                        <div className="h-10 bg-gray-300 rounded w-1/3"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto p-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                <button 
                    onClick={() => navigate('/')}
                    className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                >
                    Go Home
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Images */}
                <div>
                    {/* Main Image Container */}
                    <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden mb-4 group">
                        <img 
                            src={selectedImage} 
                            alt={product.productName}
                            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Image Navigation Arrows */}
                        {product.productImage.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrevImage}
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-opacity-75"
                                >
                                    <FaChevronLeft />
                                </button>
                                <button
                                    onClick={handleNextImage}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-opacity-75"
                                >
                                    <FaChevronRight />
                                </button>
                            </>
                        )}
                        
                        {/* Fullscreen Button */}
                        <button
                            onClick={toggleFullscreen}
                            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-opacity-75"
                        >
                            <FaExpand />
                        </button>
                        
                        {/* Image Counter */}
                        {product.productImage.length > 1 && (
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                                {currentImageIndex + 1} / {product.productImage.length}
                            </div>
                        )}
                    </div>
                    
                    {/* Image Thumbnails */}
                    {product.productImage.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {product.productImage.map((image, index) => (
                                <div 
                                    key={index}
                                    className={`w-20 h-20 bg-gray-100 rounded border-2 cursor-pointer overflow-hidden flex-shrink-0 transition-all duration-200 hover:scale-105 ${
                                        selectedImage === image ? 'border-red-600 shadow-lg' : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                    onClick={() => handleImageChange(image, index)}
                                    onMouseEnter={() => handleImageChange(image, index)}
                                >
                                    <img 
                                        src={image} 
                                        alt={`${product.productName} ${index + 1}`}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            {product.productName}
                        </h1>
                        
                        {product.brandName && (
                            <p className="text-lg text-gray-600 mb-2">
                                by <span className="font-semibold">{product.brandName}</span>
                            </p>
                        )}
                        
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex text-yellow-500">
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStarHalf />
                            </div>
                            <span className="text-gray-600">(4.5) • 123 reviews</span>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                                {product.status}
                            </span>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium capitalize">
                                {product.condition}
                            </span>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="border-t border-b py-4">
                        <div className="flex items-center gap-4 mb-2">
                            <span className="text-3xl font-bold text-red-600">
                                {formatPrice(product.sellingPrice)}
                            </span>
                            {product.price !== product.sellingPrice && (
                                <>
                                    <span className="text-xl text-gray-500 line-through">
                                        {formatPrice(product.price)}
                                    </span>
                                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                                        {getDiscountPercentage()}% OFF
                                    </span>
                                </>
                            )}
                        </div>
                        <p className="text-sm text-gray-600">
                            Stock: <span className="font-semibold">{product.stock} available</span>
                        </p>
                    </div>

                    {/* Seller Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Seller Information</h3>
                        <p className="text-gray-700">
                            <span className="font-medium">Name:</span> {product.sellerInfo?.name || 'Anonymous'}
                        </p>
                        {product.location && (
                            <p className="text-gray-700">
                                <span className="font-medium">Location:</span> {product.location}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    {product.description && (
                        <div>
                            <h3 className="font-semibold mb-2">Description</h3>
                            <p className="text-gray-700 leading-relaxed">
                                {product.description}
                            </p>
                        </div>
                    )}

                    {/* Tags */}
                    {product.tags && product.tags.length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-2">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.tags.map((tag, index) => (
                                    <span 
                                        key={index}
                                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity and Actions */}
                    <div className="border-t pt-6">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="font-semibold">Quantity:</span>
                            <div className="flex items-center border rounded">
                                <button 
                                    className="px-3 py-2 hover:bg-gray-100 flex items-center justify-center"
                                    onClick={decreaseQuantity}
                                    disabled={quantity <= 1}
                                >
                                    <FaMinus className="text-sm" />
                                </button>
                                <span className="px-4 py-2 border-x min-w-[60px] text-center">{quantity}</span>
                                <button 
                                    className="px-3 py-2 hover:bg-gray-100 flex items-center justify-center"
                                    onClick={increaseQuantity}
                                    disabled={quantity >= product.stock}
                                >
                                    <FaPlus className="text-sm" />
                                </button>
                            </div>
                            <span className="text-sm text-gray-600">
                                {product.stock} available
                            </span>
                        </div>

                        <div className="flex gap-4">
                            <button 
                                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                            >
                                <FaShoppingCart />
                                {isInCart(product._id) ? 'Update Cart' : 'Add to Cart'}
                            </button>
                            <button 
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                onClick={handleBuyNow}
                                disabled={product.stock === 0}
                            >
                                Buy Now
                            </button>
                            <button 
                                className={`px-4 py-3 rounded-lg border transition-colors ${
                                    isFavorite 
                                        ? 'bg-red-100 text-red-600 border-red-200' 
                                        : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                                }`}
                                onClick={toggleFavorite}
                            >
                                {isFavorite ? <FaHeart /> : <FaRegHeart />}
                            </button>
                        </div>

                        {product.stock === 0 && (
                            <p className="text-red-600 text-center mt-2 font-medium">
                                Out of Stock
                            </p>
                        )}

                        {isInCart(product._id) && (
                            <p className="text-green-600 text-center mt-2 text-sm">
                                ✓ This item is already in your cart ({getCartItem(product._id)?.quantity} items)
                            </p>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Social Features Section */}
            <div className="mt-8">
                <SocialFeatures product={product} compact={false} />
            </div>
            
            {/* Enhanced Reviews Section */}
            <div className="mt-8">
                <EnhancedReviews productId={product._id} />
            </div>

            {/* Related Products Section */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
                
                {relatedLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[1,2,3,4,5,6,7,8].map((item) => (
                            <div key={item} className="bg-white rounded-lg shadow animate-pulse">
                                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                                <div className="p-4">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : relatedProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {relatedProducts.map((relatedProduct) => (
                            <Link 
                                key={relatedProduct._id} 
                                to={`/product/${relatedProduct._id}`}
                                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden group"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img 
                                        src={relatedProduct.productImage?.[0] || '/api/placeholder/300/300'} 
                                        alt={relatedProduct.productName}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {relatedProduct.price && relatedProduct.sellingPrice && relatedProduct.price > relatedProduct.sellingPrice && (
                                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                                            -{Math.round(((relatedProduct.price - relatedProduct.sellingPrice) / relatedProduct.price) * 100)}% OFF
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-red-600 transition-colors">
                                        {relatedProduct.productName}
                                    </h3>
                                    {relatedProduct.brandName && (
                                        <p className="text-xs text-gray-600 mb-2">{relatedProduct.brandName}</p>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-red-600">
                                                {formatPrice(relatedProduct.sellingPrice)}
                                            </p>
                                            {relatedProduct.price && relatedProduct.price > relatedProduct.sellingPrice && (
                                                <p className="text-xs text-gray-500 line-through">
                                                    {formatPrice(relatedProduct.price)}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Stock: {relatedProduct.stock}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <p>No related products found in this category.</p>
                    </div>
                )}
            </div>
            
            {/* Fullscreen Image Modal */}
            {isFullscreen && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center p-4">
                        {/* Close Button */}
                        <button
                            onClick={toggleFullscreen}
                            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10"
                        >
                            ✕
                        </button>
                        
                        {/* Navigation Arrows */}
                        {product.productImage.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrevImage}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-gray-300"
                                >
                                    <FaChevronLeft />
                                </button>
                                <button
                                    onClick={handleNextImage}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-gray-300"
                                >
                                    <FaChevronRight />
                                </button>
                            </>
                        )}
                        
                        {/* Main Image */}
                        <img 
                            src={selectedImage} 
                            alt={product.productName}
                            className="max-w-full max-h-full object-contain"
                        />
                        
                        {/* Image Counter */}
                        {product.productImage.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-lg">
                                {currentImageIndex + 1} / {product.productImage.length}
                            </div>
                        )}
                        
                        {/* Thumbnail Strip */}
                        {product.productImage.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto">
                                {product.productImage.map((image, index) => (
                                    <div 
                                        key={index}
                                        className={`w-12 h-12 rounded cursor-pointer overflow-hidden border-2 flex-shrink-0 ${
                                            selectedImage === image ? 'border-white' : 'border-gray-400'
                                        }`}
                                        onClick={() => handleImageChange(image, index)}
                                    >
                                        <img 
                                            src={image} 
                                            alt={`${product.productName} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
