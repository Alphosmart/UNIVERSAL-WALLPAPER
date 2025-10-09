import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { 
    FaShieldAlt, 
    FaArrowLeft,
    FaSpinner,
    FaCheckCircle
} from 'react-icons/fa';
import SummaryApi from '../common';
import CountryStateSelector from '../components/CountryStateSelector';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import PaymentForm from '../components/PaymentForm';
import { TrustIndicators } from '../components/SecurityBadge';

const Checkout = () => {
    const { cartItems, clearCart, getCartTotal, isInitialized, isLoading } = useCart();
    const user = useSelector(state => state?.user?.user);
    const navigate = useNavigate();
    
    const [currentStep, setCurrentStep] = useState(1);
    const [isProcessingOrder, setIsProcessingOrder] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [completedOrder, setCompletedOrder] = useState(null);
    
    // Form data states
    const [customerInfo, setCustomerInfo] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || ''
    });
    
    const [shippingAddress, setShippingAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States'
    });
    
    const [orderNotes, setOrderNotes] = useState('');
    const [shippingCost, setShippingCost] = useState(0);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

    const totalAmount = getCartTotal();
    const tax = totalAmount * 0.08; // 8% tax (will be made dynamic later)
    const finalTotal = totalAmount + shippingCost + tax;

    // Use a ref to avoid re-running effect when cartItems changes
    const cartItemsRef = useRef(cartItems);
    cartItemsRef.current = cartItems;

    useEffect(() => {
        // Don't redirect while cart is still loading/initializing
        if (isLoading || !isInitialized) {
            return;
        }

        // Redirect if user not logged in
        if (!user?._id) {
            toast.error('Please login to checkout');
            navigate('/login');
            return;
        }

        // Only check for empty cart after initialization is complete
        // Add a small delay to avoid race conditions with cart sync
        if (isInitialized && cartItemsRef.current.length === 0) {
            // Use setTimeout to prevent immediate navigation during cart sync
            const timer = setTimeout(() => {
                // Double-check cart is still empty after delay and user is still on checkout
                if (cartItemsRef.current.length === 0 && window.location.pathname.includes('checkout')) {
                    toast.error('Your cart is empty');
                    navigate('/cart');
                }
            }, 2000); // Increased to 2 second delay to be safer
            
            return () => clearTimeout(timer);
        }
    }, [user, navigate, isLoading, isInitialized]);

    // Separate effect to handle cart items changes without navigation
    useEffect(() => {
        if (isInitialized && cartItems.length === 0) {
            // Cart became empty after page load - this might be a sync issue
            console.warn('Cart became empty during checkout process');
        }
    }, [cartItems.length, isInitialized]);

    // Calculate shipping when country changes (using ref to avoid cartItems dependency)
    useEffect(() => {
        const calculateShippingForCountry = async () => {
            const currentCartItems = cartItemsRef.current;
            if (!shippingAddress.country || currentCartItems.length === 0) {
                setShippingCost(0);
                return;
            }

            try {
                const response = await fetch(SummaryApi.calculateShippingCost.url, {
                    method: SummaryApi.calculateShippingCost.method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        country: shippingAddress.country,
                        totalAmount: totalAmount,
                        items: currentCartItems,
                        totalWeight: currentCartItems.reduce((sum, item) => sum + (item.weight || 1) * item.quantity, 0)
                    })
                });

                const data = await response.json();
                
                if (data.success) {
                    setShippingCost(data.data.shippingCost);
                } else {
                    console.error('Shipping calculation error:', data.message);
                    setShippingCost(0);
                }
            } catch (error) {
                console.error('Error calculating shipping:', error);
                setShippingCost(0);
            }
        };

        // Only calculate shipping if we have a stable cart (not during sync)
        if (isInitialized && !isLoading) {
            calculateShippingForCountry();
        }
    }, [shippingAddress.country, totalAmount, isInitialized, isLoading]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const handleStepNext = () => {
        if (currentStep === 1) {
            // Validate customer info
            if (!customerInfo.fullName || !customerInfo.email) {
                toast.error('Please fill in all required fields');
                return;
            }
            setCurrentStep(2);
        } else if (currentStep === 2) {
            // Validate shipping address
            if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode || !shippingAddress.country) {
                toast.error('Please fill in all shipping address fields including country');
                return;
            }
            setCurrentStep(3);
        } else if (currentStep === 3) {
            // Validate payment method selection
            if (!selectedPaymentMethod) {
                toast.error('Please select a payment method');
                return;
            }
            setCurrentStep(4);
        }
    };

    // Prevent form submission on Enter key press
    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Don't do anything - let button clicks handle navigation
        return false;
    };

    const handleStepBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handlePaymentSuccess = async (paymentData) => {
        setIsProcessingOrder(true);
        
        try {
            // Prepare cart items for the order
            const orderCartItems = cartItems.map(item => ({
                productId: item._id,
                quantity: item.quantity,
                productName: item.productName,
                sellingPrice: item.sellingPrice || item.price
            }));

            const orderData = {
                cartItems: orderCartItems,
                shippingAddress,
                orderNotes,
                paymentMethod: selectedPaymentMethod,
                paymentId: paymentData?.paymentIntentId || `${selectedPaymentMethod}_${Date.now()}`,
                customerInfo
            };

            const response = await fetch(SummaryApi.buyMultipleProducts.url, {
                method: SummaryApi.buyMultipleProducts.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(orderData)
            });

            const result = await response.json();
            
            if (result.success) {
                // Clear cart and show success
                await clearCart();
                setCompletedOrder({
                    orderId: 'ORD-' + Date.now(),
                    totalAmount: finalTotal,
                    itemCount: cartItems.length,
                    paymentId: paymentData.paymentIntentId,
                    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
                });
                setOrderComplete(true);
                toast.success(`${result.data.orderCount} orders placed successfully!`);
            } else {
                toast.error(result.message || 'Failed to create orders');
            }
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error('Failed to create order. Please contact support.');
        } finally {
            setIsProcessingOrder(false);
        }
    };

    const handleCompleteOrder = () => {
        if (selectedPaymentMethod === 'stripe') {
            // Stripe payment will be handled by CardForm component
            return;
        } else {
            // Handle non-Stripe payments
            const paymentData = {
                paymentMethodId: selectedPaymentMethod,
                paymentIntentId: `${selectedPaymentMethod}_${Date.now()}`,
                status: selectedPaymentMethod === 'cashOnDelivery' ? 'pending' : 'processing'
            };
            handlePaymentSuccess(paymentData);
        }
    };

    // Order completion page
    if (orderComplete && completedOrder) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="mb-6">
                        <FaCheckCircle className="mx-auto text-6xl text-green-500 mb-4" />
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
                        <p className="text-gray-600">Thank you for your purchase</p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left">
                        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Order ID:</span>
                                <span className="font-mono">{completedOrder.orderId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Items:</span>
                                <span>{completedOrder.itemCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Total Amount:</span>
                                <span className="font-semibold">{formatPrice(completedOrder.totalAmount)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Payment ID:</span>
                                <span className="font-mono text-sm">{completedOrder.paymentId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Estimated Delivery:</span>
                                <span>{completedOrder.estimatedDelivery}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/my-orders')}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            View My Orders
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Show loading while cart is initializing
    if (isLoading || !isInitialized) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
                        <div className="text-lg">Loading checkout...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (isProcessingOrder) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
                        <div className="text-lg">Processing your order...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/cart')}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <FaArrowLeft />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center">
                        {[1, 2, 3, 4].map((step) => (
                            <React.Fragment key={step}>
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                                    currentStep >= step 
                                        ? 'bg-blue-600 border-blue-600 text-white' 
                                        : 'border-gray-300 text-gray-400'
                                }`}>
                                    {step}
                                </div>
                                {step < 4 && (
                                    <div className={`h-1 w-12 mx-2 ${
                                        currentStep > step ? 'bg-blue-600' : 'bg-gray-300'
                                    }`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-2 max-w-lg mx-auto">
                        <span>Customer Info</span>
                        <span>Shipping</span>
                        <span>Payment Method</span>
                        <span>Complete Order</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleFormSubmit}>
                        {currentStep === 1 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold mb-6">Customer Information</h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={customerInfo.fullName}
                                            onChange={(e) => setCustomerInfo({...customerInfo, fullName: e.target.value})}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            value={customerInfo.email}
                                            onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter your email"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={customerInfo.phone}
                                            onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter your phone number"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleStepNext}
                                    className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Continue to Shipping
                                </button>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Street Address *
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingAddress.street}
                                            onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="123 Main Street"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                value={shippingAddress.city}
                                                onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="City"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                ZIP Code *
                                            </label>
                                            <input
                                                type="text"
                                                value={shippingAddress.zipCode}
                                                onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="12345"
                                            />
                                        </div>
                                    </div>

                                    {/* Country and State Selector */}
                                    <CountryStateSelector
                                        selectedCountry={shippingAddress.country}
                                        selectedState={shippingAddress.state}
                                        onCountryChange={(country) => {
                                            setShippingAddress(prev => ({
                                                ...prev, 
                                                country: country, 
                                                state: ''
                                            }));
                                        }}
                                        onStateChange={(state) => {
                                            setShippingAddress(prev => ({
                                                ...prev, 
                                                state: state
                                            }));
                                        }}
                                        required={true}
                                        className="mt-4"
                                    />

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Order Notes (Optional)
                                        </label>
                                        <textarea
                                            value={orderNotes}
                                            onChange={(e) => setOrderNotes(e.target.value)}
                                            rows={3}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Any special instructions for your order..."
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={handleStepBack}
                                        className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleStepNext}
                                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Continue to Payment
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <PaymentMethodSelector
                                    cartItems={cartItems}
                                    shippingAddress={shippingAddress}
                                    selectedPaymentMethod={selectedPaymentMethod}
                                    onPaymentMethodChange={setSelectedPaymentMethod}
                                />

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={handleStepBack}
                                        className="bg-gray-100 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        <FaArrowLeft className="inline mr-2" />
                                        Back to Shipping
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleStepNext}
                                        disabled={!selectedPaymentMethod}
                                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Continue to Payment
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold mb-6">
                                    {selectedPaymentMethod === 'stripe' ? 'Payment Information' : 
                                     selectedPaymentMethod === 'paypal' ? 'PayPal Payment' :
                                     selectedPaymentMethod === 'cashOnDelivery' ? 'Confirm Order' :
                                     selectedPaymentMethod === 'bankTransfer' ? 'Bank Transfer Instructions' :
                                     'Complete Payment'}
                                </h2>
                                
                                {selectedPaymentMethod === 'stripe' && (
                                    <PaymentForm
                                        paymentMethod="stripe"
                                        onPaymentSuccess={handlePaymentSuccess}
                                        orderData={{
                                            buyerDetails: customerInfo,
                                            shippingAddress,
                                            orderNotes
                                        }}
                                        totalAmount={finalTotal}
                                    />
                                )}

                                {selectedPaymentMethod === 'paypal' && (
                                    <div className="space-y-4">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <h3 className="font-semibold text-blue-800 mb-2">PayPal Payment</h3>
                                            <p className="text-blue-700 text-sm">
                                                You will be redirected to PayPal to complete your payment securely.
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleCompleteOrder}
                                            disabled={isProcessingOrder}
                                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                        >
                                            {isProcessingOrder ? (
                                                <>
                                                    <FaSpinner className="animate-spin inline mr-2" />
                                                    Processing...
                                                </>
                                            ) : (
                                                'Continue with PayPal'
                                            )}
                                        </button>
                                    </div>
                                )}

                                {selectedPaymentMethod === 'cashOnDelivery' && (
                                    <div className="space-y-4">
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <h3 className="font-semibold text-green-800 mb-2">Cash on Delivery</h3>
                                            <p className="text-green-700 text-sm mb-2">
                                                Pay with cash when your order is delivered to your doorstep.
                                            </p>
                                            <ul className="text-green-600 text-xs space-y-1">
                                                <li>• Have exact amount ready</li>
                                                <li>• Valid ID may be required</li>
                                                <li>• Delivery agent will collect payment</li>
                                            </ul>
                                        </div>
                                        <button
                                            onClick={handleCompleteOrder}
                                            disabled={isProcessingOrder}
                                            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                        >
                                            {isProcessingOrder ? (
                                                <>
                                                    <FaSpinner className="animate-spin inline mr-2" />
                                                    Placing Order...
                                                </>
                                            ) : (
                                                'Confirm Order (Cash on Delivery)'
                                            )}
                                        </button>
                                    </div>
                                )}

                                {selectedPaymentMethod === 'bankTransfer' && (
                                    <div className="space-y-4">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <h3 className="font-semibold text-blue-800 mb-2">Bank Transfer Instructions</h3>
                                            <p className="text-blue-700 text-sm mb-3">
                                                After confirming your order, you will receive bank details via email. 
                                                Your order will be processed once payment is received (2-3 business days).
                                            </p>
                                            <div className="text-xs text-blue-600 space-y-1">
                                                <p>• Include your order ID in the transfer reference</p>
                                                <p>• Send payment confirmation to support</p>
                                                <p>• Order ships after payment verification</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleCompleteOrder}
                                            disabled={isProcessingOrder}
                                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                        >
                                            {isProcessingOrder ? (
                                                <>
                                                    <FaSpinner className="animate-spin inline mr-2" />
                                                    Creating Order...
                                                </>
                                            ) : (
                                                'Confirm Order (Bank Transfer)'
                                            )}
                                        </button>
                                    </div>
                                )}

                                {selectedPaymentMethod === 'cryptocurrency' && (
                                    <div className="space-y-4">
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                            <h3 className="font-semibold text-purple-800 mb-2">Cryptocurrency Payment</h3>
                                            <p className="text-purple-700 text-sm mb-2">
                                                Pay with Bitcoin, Ethereum, or other supported cryptocurrencies.
                                            </p>
                                            <p className="text-xs text-purple-600">
                                                You will receive wallet address and payment instructions after order confirmation.
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleCompleteOrder}
                                            disabled={isProcessingOrder}
                                            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                                        >
                                            {isProcessingOrder ? (
                                                <>
                                                    <FaSpinner className="animate-spin inline mr-2" />
                                                    Processing...
                                                </>
                                            ) : (
                                                'Continue with Cryptocurrency'
                                            )}
                                        </button>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={handleStepBack}
                                    className="w-full mt-4 bg-gray-100 text-gray-800 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Back to Payment Method
                                </button>
                            </div>
                        )}
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                            
                            {/* Cart Items */}
                            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="flex items-center gap-3 pb-3 border-b">
                                        <img
                                            src={item.productImage?.[0] || '/api/placeholder/50/50'}
                                            alt={item.productName}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-sm">{item.productName}</h4>
                                            <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                                        </div>
                                        <span className="font-semibold text-sm">
                                            {formatPrice((item.sellingPrice || item.price) * item.quantity)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-2 mb-6">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(totalAmount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className={shippingCost === 0 ? "text-green-600" : "text-gray-800"}>
                                        {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax</span>
                                    <span>{formatPrice(tax)}</span>
                                </div>
                                <hr />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span className="text-red-600">{formatPrice(finalTotal)}</span>
                                </div>
                            </div>

                            {/* Security Info */}
                            <div className="bg-green-50 p-3 rounded-lg mb-4">
                                <div className="flex items-center gap-2 text-green-800 text-sm">
                                    <FaShieldAlt />
                                    <span>SSL encrypted checkout</span>
                                </div>
                            </div>

                            {/* Trust Indicators */}
                            <TrustIndicators className="mb-4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
