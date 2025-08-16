import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';

const OrderTracking = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const statusSteps = [
        { key: 'pending', label: 'Order Placed', icon: '📝' },
        { key: 'confirmed', label: 'Confirmed', icon: '✅' },
        { key: 'processing', label: 'Processing', icon: '📦' },
        { key: 'shipped', label: 'Shipped', icon: '🚚' },
        { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🚛' },
        { key: 'delivered', label: 'Delivered', icon: '✨' }
    ];

    useEffect(() => {
        const fetchOrderTracking = async () => {
            try {
                setLoading(true);
                const response = await fetch(SummaryApi.getOrderTracking.url.replace(':orderId', orderId), {
                    method: SummaryApi.getOrderTracking.method,
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (data.success) {
                    setOrderData(data.data);
                } else {
                    setError(data.message);
                }
            } catch (err) {
                setError('Failed to fetch order tracking information');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderTracking();
    }, [orderId]);

    const getCurrentStatusIndex = () => {
        return statusSteps.findIndex(step => step.key === orderData?.orderStatus);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>{error}</p>
                    <button 
                        onClick={() => navigate('/user/orders')}
                        className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    const currentStatusIndex = getCurrentStatusIndex();

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <button 
                    onClick={() => navigate('/user/orders')}
                    className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
                >
                    ← Back to Orders
                </button>
                <h1 className="text-3xl font-bold text-gray-800">Order Tracking</h1>
                <p className="text-gray-600">Order ID: {orderData?.orderId}</p>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <p><strong>Product:</strong> {orderData?.productDetails?.productName}</p>
                        <p><strong>Brand:</strong> {orderData?.productDetails?.brandName}</p>
                        <p><strong>Quantity:</strong> {orderData?.quantity}</p>
                        <p><strong>Total Amount:</strong> ₦{orderData?.totalAmount?.toLocaleString()}</p>
                    </div>
                    <div>
                        <p><strong>Order Date:</strong> {formatDate(orderData?.createdAt)}</p>
                        <p><strong>Payment Status:</strong> 
                            <span className={`ml-2 px-2 py-1 rounded text-sm ${
                                orderData?.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                                orderData?.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                                {orderData?.paymentStatus}
                            </span>
                        </p>
                        {orderData?.trackingInfo?.trackingNumber && (
                            <p><strong>Tracking Number:</strong> {orderData.trackingInfo.trackingNumber}</p>
                        )}
                        {orderData?.trackingInfo?.carrier && (
                            <p><strong>Carrier:</strong> {orderData.trackingInfo.carrier}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-6">Order Status</h2>
                
                <div className="relative">
                    {statusSteps.map((step, index) => {
                        const isCompleted = index <= currentStatusIndex;
                        const isCurrent = index === currentStatusIndex;
                        
                        return (
                            <div key={step.key} className="relative flex items-center mb-8">
                                {/* Timeline line */}
                                {index < statusSteps.length - 1 && (
                                    <div className={`absolute left-6 top-12 w-0.5 h-16 ${
                                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                                    }`}></div>
                                )}
                                
                                {/* Status icon */}
                                <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                                    isCompleted ? 'bg-green-500 border-green-500 text-white' :
                                    isCurrent ? 'bg-blue-500 border-blue-500 text-white' :
                                    'bg-white border-gray-300 text-gray-400'
                                }`}>
                                    <span className="text-lg">{step.icon}</span>
                                </div>
                                
                                {/* Status label */}
                                <div className="ml-4">
                                    <h3 className={`font-semibold ${
                                        isCompleted ? 'text-green-600' :
                                        isCurrent ? 'text-blue-600' :
                                        'text-gray-400'
                                    }`}>
                                        {step.label}
                                    </h3>
                                    {isCurrent && orderData?.trackingInfo?.currentLocation && (
                                        <p className="text-sm text-gray-600">
                                            Current Location: {orderData.trackingInfo.currentLocation}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Estimated Delivery */}
                {orderData?.trackingInfo?.estimatedDelivery && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-blue-800">
                            <strong>Estimated Delivery:</strong> {formatDate(orderData.trackingInfo.estimatedDelivery)}
                        </p>
                    </div>
                )}
            </div>

            {/* Status History */}
            {orderData?.statusHistory && orderData.statusHistory.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Status History</h2>
                    <div className="space-y-4">
                        {orderData.statusHistory.map((history, index) => (
                            <div key={index} className="flex justify-between items-start border-b pb-3">
                                <div>
                                    <p className="font-medium capitalize">{history.status.replace('_', ' ')}</p>
                                    {history.note && <p className="text-sm text-gray-600">{history.note}</p>}
                                    {history.location && <p className="text-sm text-gray-500">Location: {history.location}</p>}
                                </div>
                                <div className="text-sm text-gray-500 text-right">
                                    {formatDate(history.timestamp)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-8">
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                <div className="text-gray-700">
                    <p>{orderData?.shippingAddress?.street}</p>
                    <p>{orderData?.shippingAddress?.city}, {orderData?.shippingAddress?.state} {orderData?.shippingAddress?.zipCode}</p>
                    <p>{orderData?.shippingAddress?.country}</p>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
