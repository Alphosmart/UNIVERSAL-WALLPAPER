import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaBox, FaTruck, FaReceipt } from 'react-icons/fa';

const OrderConfirmation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const orderData = location.state?.orderData;

    // Redirect if no order data
    if (!orderData) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h1>
                    <p className="text-gray-600 mb-6">We couldn't find your order information.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                {/* Success Header */}
                <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-8">
                    <FaCheckCircle className="mx-auto text-6xl text-green-500 mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
                    <p className="text-gray-600 mb-4">Thank you for your purchase. Your order has been received and is being processed.</p>
                    <div className="bg-green-50 p-4 rounded-lg inline-block">
                        <p className="text-green-800 font-semibold">
                            Order ID: #{orderData.orderId}
                        </p>
                        {orderData.trackingNumber && (
                            <p className="text-green-700 font-medium mt-2">
                                Tracking Number: {orderData.trackingNumber}
                            </p>
                        )}
                    </div>
                </div>

                {/* Order Details */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <FaReceipt className="text-blue-600" />
                        Order Details
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-3">Customer Information</h3>
                            <div className="space-y-2 text-sm">
                                <p><span className="font-medium">Name:</span> {orderData.customerInfo.fullName}</p>
                                <p><span className="font-medium">Email:</span> {orderData.customerInfo.email}</p>
                                {orderData.customerInfo.phone && (
                                    <p><span className="font-medium">Phone:</span> {orderData.customerInfo.phone}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-800 mb-3">Shipping Address</h3>
                            <div className="text-sm">
                                <p>{orderData.shippingAddress.street}</p>
                                <p>{orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.zipCode}</p>
                                <p>{orderData.shippingAddress.country}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t">
                        <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <span>Items ({orderData.itemCount})</span>
                                <span>{formatPrice(orderData.subtotal)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span>Shipping</span>
                                <span className="text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span>Tax</span>
                                <span>{formatPrice(orderData.tax)}</span>
                            </div>
                            <hr className="my-2" />
                            <div className="flex justify-between items-center font-bold text-lg">
                                <span>Total</span>
                                <span className="text-red-600">{formatPrice(orderData.totalAmount)}</span>
                            </div>
                        </div>
                    </div>

                    {orderData.paymentId && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <span className="font-medium">Payment ID:</span> {orderData.paymentId}
                            </p>
                        </div>
                    )}
                </div>

                {/* Next Steps */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-6">What's Next?</h2>
                    
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-100 p-2 rounded-full">
                                <FaBox className="text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Order Processing</h3>
                                <p className="text-gray-600 text-sm">Your order is being prepared and will be packaged soon.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-yellow-100 p-2 rounded-full">
                                <FaTruck className="text-yellow-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Shipping</h3>
                                <p className="text-gray-600 text-sm">
                                    Estimated delivery: {orderData.estimatedDelivery}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-green-100 p-2 rounded-full">
                                <FaCheckCircle className="text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Order Updates</h3>
                                <p className="text-gray-600 text-sm">
                                    You'll receive email updates about your order status.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate('/my-orders')}
                            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                            Track Your Order
                        </button>
                        
                        <button
                            onClick={() => navigate('/')}
                            className="flex-1 bg-gray-100 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                        >
                            Continue Shopping
                        </button>
                    </div>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                            Need help? Contact our{' '}
                            <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
                                customer support
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
