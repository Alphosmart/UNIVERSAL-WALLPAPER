import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaBox, FaClock, FaCheck, FaTimes, FaEye, FaTruck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import SummaryApi from '../common';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetail, setShowOrderDetail] = useState(false);
    const user = useSelector(state => state?.user?.user);

    useEffect(() => {
        if (user?._id) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const response = await fetch(SummaryApi.userOrders.url, {
                method: SummaryApi.userOrders.method,
                credentials: 'include'
            });

            const result = await response.json();
            
            if (result.success) {
                setOrders(result.data);
            } else {
                toast.error(result.message || 'Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDING':
                return <FaClock className="text-yellow-600" />;
            case 'CONFIRMED':
                return <FaCheck className="text-blue-600" />;
            case 'SHIPPED':
                return <FaBox className="text-purple-600" />;
            case 'DELIVERED':
                return <FaCheck className="text-green-600" />;
            case 'CANCELLED':
                return <FaTimes className="text-red-600" />;
            default:
                return <FaClock className="text-gray-600" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'CONFIRMED':
                return 'bg-blue-100 text-blue-800';
            case 'SHIPPED':
                return 'bg-purple-100 text-purple-800';
            case 'DELIVERED':
                return 'bg-green-100 text-green-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const canCancelOrder = (status) => {
        return ['PENDING', 'CONFIRMED'].includes(status);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
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

    const viewOrderDetails = (order) => {
        setSelectedOrder(order);
        setShowOrderDetail(true);
    };

    if (!user?._id) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Please login to view your orders</h2>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg">Loading your orders...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center py-12">
                    <FaBox className="mx-auto text-6xl text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Order #{order._id.slice(-8)}
                                    </h3>
                                    <p className="text-gray-600">
                                        Placed on {formatDate(order.createdAt)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        {order.status}
                                    </span>
                                    <button
                                        onClick={() => viewOrderDetails(order)}
                                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                    >
                                        <FaEye />
                                        View Details
                                    </button>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={order.product?.productImage?.[0] || '/api/placeholder/80/80'}
                                        alt={order.product?.productName}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-800">
                                            {order.product?.productName}
                                        </h4>
                                        <p className="text-gray-600">
                                            {order.product?.brandName}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Quantity: {order.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-800">
                                            {formatPrice(order.totalPrice)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Order Detail Modal */}
            {showOrderDetail && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Order Details
                                </h2>
                                <button
                                    onClick={() => setShowOrderDetail(false)}
                                    className="text-gray-600 hover:text-gray-800 text-2xl"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Order Info */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-2">Order Information</h3>
                                            <p className="text-sm text-gray-600">
                                                Order ID: #{selectedOrder._id.slice(-8)}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Date: {formatDate(selectedOrder.createdAt)}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(selectedOrder.status)}`}>
                                                    {getStatusIcon(selectedOrder.status)}
                                                    {selectedOrder.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-2">Seller Information</h3>
                                            <p className="text-sm text-gray-600">
                                                Name: {selectedOrder.seller?.name || 'N/A'}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Email: {selectedOrder.seller?.email || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Product Details */}
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-4">Product Details</h3>
                                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                                        <img
                                            src={selectedOrder.product?.productImage?.[0] || '/api/placeholder/100/100'}
                                            alt={selectedOrder.product?.productName}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-800">
                                                {selectedOrder.product?.productName}
                                            </h4>
                                            <p className="text-gray-600">
                                                {selectedOrder.product?.brandName}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Category: {selectedOrder.product?.category}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Condition: {selectedOrder.product?.condition}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">
                                                Quantity: {selectedOrder.quantity}
                                            </p>
                                            <p className="text-lg font-bold text-gray-800">
                                                {formatPrice(selectedOrder.totalPrice)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Subtotal:</span>
                                            <span>{formatPrice(selectedOrder.totalPrice)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Shipping:</span>
                                            <span className="text-green-600">Free</span>
                                        </div>
                                        <hr />
                                        <div className="flex justify-between font-bold text-lg">
                                            <span>Total:</span>
                                            <span>{formatPrice(selectedOrder.totalPrice)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyOrders;
