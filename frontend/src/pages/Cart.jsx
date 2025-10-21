import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal, isLoading } = useCart();
    const user = useSelector(state => state?.user?.user);
    const navigate = useNavigate();
    const [loading] = useState(false);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
        } else {
            updateQuantity(productId, newQuantity);
        }
    };

    const handleCheckout = async () => {
        if (!user?._id) {
            toast.error('Please login to checkout');
            navigate('/login');
            return;
        }

        if (cartItems.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        // Navigate to checkout page
        navigate('/checkout');
    };

    // Show loading state during initial cart loading or checkout process
    if (isLoading || loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg">Loading cart...</div>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <FaShoppingBag className="mx-auto text-6xl text-gray-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                    <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
                    <Link 
                        to="/"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
                <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-800 flex items-center gap-2"
                >
                    <FaTrash />
                    Clear Cart
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                        <div key={item._id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center gap-4">
                                <img
                                    src={item.productImage?.[0] || '/api/placeholder/100/100'}
                                    alt={item.productName}
                                    className="w-20 h-20 object-cover rounded-lg cursor-pointer"
                                    onClick={() => navigate(`/product/${item._id}`)}
                                />
                                
                                <div className="flex-1">
                                    <h3 
                                        className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-blue-600"
                                        onClick={() => navigate(`/product/${item._id}`)}
                                    >
                                        {item.productName}
                                    </h3>
                                    <p className="text-gray-600">{item.brandName}</p>
                                    <p className="text-lg font-bold text-blue-600">
                                        {formatPrice(item.sellingPrice || item.price)}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                    >
                                        <FaMinus className="text-sm" />
                                    </button>
                                    
                                    <span className="w-12 text-center font-semibold">{item.quantity}</span>
                                    
                                    <button
                                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                    >
                                        <FaPlus className="text-sm" />
                                    </button>
                                </div>

                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    className="p-2 text-red-600 hover:text-red-800 transition-colors"
                                    title="Remove from cart"
                                >
                                    <FaTrash />
                                </button>
                            </div>

                            {/* Item Total */}
                            <div className="mt-4 text-right">
                                <span className="text-lg font-semibold text-gray-800">
                                    Subtotal: {formatPrice((item.sellingPrice || item.price) * item.quantity)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
                    
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between">
                            <span>Items ({cartItems.length})</span>
                            <span>{formatPrice(getCartTotal())}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="text-green-600">Free</span>
                        </div>
                        <hr />
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span className="text-red-600">{formatPrice(getCartTotal())}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={handleCheckout}
                            disabled={loading || !user?._id}
                            className={`w-full py-3 rounded-lg text-white font-semibold transition-colors ${
                                loading || !user?._id 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-red-600 hover:bg-red-700'
                            }`}
                        >
                            {loading ? 'Processing...' : 'Proceed to Checkout'}
                        </button>
                        
                        <Link
                            to="/"
                            className="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center block"
                        >
                            Continue Shopping
                        </Link>
                    </div>

                    {!user?._id && (
                        <p className="text-sm text-red-600 mt-2 text-center">
                            Please login to checkout
                        </p>
                    )}

                    {/* Additional Info */}
                    <div className="mt-6 text-sm text-gray-600">
                        <p className="mb-2">✓ Fast shipping available</p>
                        <p className="mb-2">✓ 30-day return policy</p>
                        <p>✓ Secure checkout</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
