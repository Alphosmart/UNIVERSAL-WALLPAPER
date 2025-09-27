import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import { FaTruck, FaBox, FaDollarSign, FaStar, FaCheck, FaTimes, FaClock, FaShippingFast } from 'react-icons/fa';

const ShippingCompanyDashboard = () => {
    
    const [stats, setStats] = useState({
        totalQuotes: 0,
        acceptedQuotes: 0,
        completedDeliveries: 0,
        totalEarnings: 0,
        averageRating: 0,
        pendingOrders: 0
    });
    
    const [availableOrders, setAvailableOrders] = useState([]);
    const [quotes, setQuotes] = useState([]);
    const [activeTab, setActiveTab] = useState('available');
    const [loading, setLoading] = useState(false);
    const [quoteModalOrder, setQuoteModalOrder] = useState(null);
    const [quoteData, setQuoteData] = useState({
        price: '',
        estimatedDeliveryDays: '',
        notes: ''
    });

    useEffect(() => {
        fetchStats();
        fetchAvailableOrders();
        fetchQuotes();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch(SummaryApi.getShippingCompanyStats.url, {
                method: SummaryApi.getShippingCompanyStats.method,
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                setStats(data.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchAvailableOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch(SummaryApi.getAvailableOrders.url, {
                method: SummaryApi.getAvailableOrders.method,
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                setAvailableOrders(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching available orders:', error);
            toast.error('Failed to fetch available orders');
        } finally {
            setLoading(false);
        }
    };

    const fetchQuotes = async () => {
        try {
            const response = await fetch(SummaryApi.getShippingQuotes.url, {
                method: SummaryApi.getShippingQuotes.method,
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                // Ensure quotes is always an array
                const quotesData = data.data || data.quotes || [];
                setQuotes(Array.isArray(quotesData) ? quotesData : []);
            } else {
                // If API fails, set empty array
                setQuotes([]);
            }
        } catch (error) {
            console.error('Error fetching quotes:', error);
            // If there's an error, set empty array to prevent map error
            setQuotes([]);
        }
    };

    const submitQuote = async () => {
        if (!quoteData.price || !quoteData.estimatedDeliveryDays) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const response = await fetch(SummaryApi.submitShippingQuote.url, {
                method: SummaryApi.submitShippingQuote.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    orderId: quoteModalOrder._id,
                    price: parseFloat(quoteData.price),
                    estimatedDeliveryDays: parseInt(quoteData.estimatedDeliveryDays),
                    notes: quoteData.notes
                })
            });

            if (response.ok) {
                toast.success('Quote submitted successfully!');
                setQuoteModalOrder(null);
                setQuoteData({ price: '', estimatedDeliveryDays: '', notes: '' });
                fetchQuotes();
                fetchAvailableOrders();
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to submit quote');
            }
        } catch (error) {
            console.error('Error submitting quote:', error);
            toast.error('Failed to submit quote');
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            accepted: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            completed: 'bg-blue-100 text-blue-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending: <FaClock className="w-4 h-4" />,
            accepted: <FaCheck className="w-4 h-4" />,
            rejected: <FaTimes className="w-4 h-4" />,
            completed: <FaShippingFast className="w-4 h-4" />
        };
        return icons[status] || <FaClock className="w-4 h-4" />;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Shipping Company Dashboard</h1>
                    <p className="text-gray-600 mt-2">Manage your delivery orders and quotes</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <FaBox className="w-6 h-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Quotes</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalQuotes}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <FaCheck className="w-6 h-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Accepted</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.acceptedQuotes}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                            <FaTruck className="w-6 h-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Completed</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.completedDeliveries}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                            <FaDollarSign className="w-6 h-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalEarnings)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                            <FaStar className="w-6 h-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Rating</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-red-100 text-red-600">
                            <FaClock className="w-6 h-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Pending</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex">
                        <button
                            onClick={() => setActiveTab('available')}
                            className={`py-4 px-6 text-sm font-medium ${
                                activeTab === 'available'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Available Orders ({availableOrders.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('quotes')}
                            className={`py-4 px-6 text-sm font-medium ${
                                activeTab === 'quotes'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            My Quotes ({quotes.length})
                        </button>
                    </nav>
                </div>

                {/* Available Orders Tab */}
                {activeTab === 'available' && (
                    <div className="p-6">
                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-4 text-gray-600">Loading available orders...</p>
                            </div>
                        ) : availableOrders.length === 0 ? (
                            <div className="text-center py-8">
                                <FaBox className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No available orders</h3>
                                <p className="mt-1 text-sm text-gray-500">No orders are currently available for quotes.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {availableOrders.map((order) => (
                                    <div key={order._id} className="border border-gray-200 rounded-lg p-6">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        Order #{order.trackingId || order._id.slice(-8)}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                                                        {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                                    </span>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <p className="text-sm text-gray-600">Customer</p>
                                                        <p className="font-medium">{order.buyer?.name || 'Customer'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">Total Value</p>
                                                        <p className="font-medium">{formatCurrency(order.totalPrice)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">Items</p>
                                                        <p className="font-medium">{order.products?.length || 0} items</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">Order Date</p>
                                                        <p className="font-medium">{formatDate(order.createdAt)}</p>
                                                    </div>
                                                </div>

                                                {order.deliveryAddress && (
                                                    <div className="mb-4">
                                                        <p className="text-sm text-gray-600">Delivery Address</p>
                                                        <p className="font-medium">
                                                            {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state}
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={() => setQuoteModalOrder(order)}
                                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                                    >
                                                        Submit Quote
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* My Quotes Tab */}
                {activeTab === 'quotes' && (
                    <div className="p-6">
                        {!quotes || !Array.isArray(quotes) || quotes.length === 0 ? (
                            <div className="text-center py-8">
                                <FaDollarSign className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No quotes submitted</h3>
                                <p className="mt-1 text-sm text-gray-500">You haven't submitted any quotes yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {quotes.map((quote) => (
                                    <div key={quote._id} className="border border-gray-200 rounded-lg p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Quote for Order #{quote.order?.trackingId || quote.order?._id?.slice(-8)}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(quote.status)}`}>
                                                {getStatusIcon(quote.status)}
                                                {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Quote Price</p>
                                                <p className="font-medium text-lg text-green-600">{formatCurrency(quote.price)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Delivery Time</p>
                                                <p className="font-medium">{quote.estimatedDeliveryDays} days</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Submitted</p>
                                                <p className="font-medium">{formatDate(quote.createdAt)}</p>
                                            </div>
                                        </div>

                                        {quote.notes && (
                                            <div className="mb-4">
                                                <p className="text-sm text-gray-600">Notes</p>
                                                <p className="font-medium">{quote.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Quote Modal */}
            {quoteModalOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">
                            Submit Quote for Order #{quoteModalOrder.trackingId || quoteModalOrder._id.slice(-8)}
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Quote Price (NGN) *
                                </label>
                                <input
                                    type="number"
                                    value={quoteData.price}
                                    onChange={(e) => setQuoteData({...quoteData, price: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter delivery price"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Estimated Delivery Days *
                                </label>
                                <input
                                    type="number"
                                    value={quoteData.estimatedDeliveryDays}
                                    onChange={(e) => setQuoteData({...quoteData, estimatedDeliveryDays: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Number of days"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Additional Notes
                                </label>
                                <textarea
                                    value={quoteData.notes}
                                    onChange={(e) => setQuoteData({...quoteData, notes: e.target.value})}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Any special handling requirements or notes..."
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setQuoteModalOrder(null)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitQuote}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Submit Quote
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShippingCompanyDashboard;
