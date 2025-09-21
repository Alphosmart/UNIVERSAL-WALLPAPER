import React, { useState } from 'react';
import SummaryApi from '../common';

const TrackByNumber = () => {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [trackingData, setTrackingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const statusSteps = [
        { key: 'pending', label: 'Order Placed', icon: '📝' },
        { key: 'confirmed', label: 'Confirmed', icon: '✅' },
        { key: 'processing', label: 'Processing', icon: '📦' },
        { key: 'shipped', label: 'Shipped', icon: '🚚' },
        { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🚛' },
        { key: 'delivered', label: 'Delivered', icon: '✨' }
    ];

    const handleTrack = async (e) => {
        e.preventDefault();
        
        if (!trackingNumber.trim()) {
            setError('Please enter a tracking number');
            return;
        }

        try {
            setLoading(true);
            setError('');
            
            const response = await fetch(SummaryApi.trackByNumber.url.replace(':trackingNumber', trackingNumber), {
                method: SummaryApi.trackByNumber.method,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                setTrackingData(data.data);
            } else {
                setError(data.message);
                setTrackingData(null);
            }
        } catch (err) {
            setError('Failed to track order. Please check your tracking number and try again.');
            setTrackingData(null);
        } finally {
            setLoading(false);
        }
    };

    const getCurrentStatusIndex = () => {
        if (!trackingData) return -1;
        return statusSteps.findIndex(step => step.key === trackingData.orderStatus);
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

    const currentStatusIndex = getCurrentStatusIndex();

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Track Your Order</h1>
                <p className="text-gray-600">Enter your tracking number to see the latest status of your order</p>
            </div>

            {/* Tracking Form */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            placeholder="Enter your tracking number"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Tracking...' : 'Track Order'}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}
            </div>

            {/* Tracking Results */}
            {trackingData && (
                <>
                    {/* Order Summary */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <p><strong>Product:</strong> {trackingData.productDetails?.productName}</p>
                                <p><strong>Brand:</strong> {trackingData.productDetails?.brandName}</p>
                                <p><strong>Quantity:</strong> {trackingData.quantity}</p>
                            </div>
                            <div>
                                <p><strong>Order Date:</strong> {formatDate(trackingData.orderDate)}</p>
                                <p><strong>Total Amount:</strong> ₦{trackingData.totalAmount?.toLocaleString()}</p>
                                {trackingData.trackingInfo?.carrier && (
                                    <p><strong>Carrier:</strong> {trackingData.trackingInfo.carrier}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Status Timeline */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-6">Tracking Status</h2>
                        
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
                                            {isCurrent && trackingData.trackingInfo?.currentLocation && (
                                                <p className="text-sm text-gray-600">
                                                    Current Location: {trackingData.trackingInfo.currentLocation}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Estimated Delivery */}
                        {trackingData.trackingInfo?.estimatedDelivery && (
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <p className="text-blue-800">
                                    <strong>Estimated Delivery:</strong> {formatDate(trackingData.trackingInfo.estimatedDelivery)}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Status History */}
                    {trackingData.statusHistory && trackingData.statusHistory.length > 0 && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Status History</h2>
                            <div className="space-y-4">
                                {trackingData.statusHistory.map((history, index) => (
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
                </>
            )}
        </div>
    );
};

export default TrackByNumber;
