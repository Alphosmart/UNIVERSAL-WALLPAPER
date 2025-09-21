import React, { useState, useEffect } from 'react';
import { FaEye, FaCheck, FaBox, FaClock, FaSearch, FaFilter } from 'react-icons/fa';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
// Shipping functionality removed - single company model
// import ShippingQuoteSelector from '../components/ShippingQuoteSelector';

const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    // Shipping functionality removed - single company model
    // const [showShippingModal, setShowShippingModal] = useState(false);
    // const [shippingOrder, setShippingOrder] = useState(null);

    // Fetch seller orders
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch(SummaryApi.getSellerOrders.url, {
                method: SummaryApi.getSellerOrders.method,
                credentials: 'include'
            });

            const result = await response.json();

            if (result.success) {
                setOrders(result.data);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    // Fetch seller order statistics
    const fetchOrderStats = async () => {
        try {
            const response = await fetch(SummaryApi.getSellerOrderStats.url, {
                method: SummaryApi.getSellerOrderStats.method,
                credentials: 'include'
            });

            const result = await response.json();

            if (result.success) {
                setStats(result.data);
            }
        } catch (error) {
            console.error('Error fetching order stats:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchOrderStats();
    }, []);

    // Update order status
    const updateOrderStatus = async (orderId, newStatus, carrier = '', estimatedDelivery = '') => {
        try {
            const response = await fetch(`${SummaryApi.updateSellerOrderStatus.url}/${orderId}/status`, {
                method: SummaryApi.updateSellerOrderStatus.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    orderStatus: newStatus,
                    carrier,
                    estimatedDelivery
                })
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Order status updated successfully');
                fetchOrders();
                fetchOrderStats();
                setShowDetailModal(false);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('Failed to update order status');
        }
    };

    // Shipping functionality removed - single company model
    // const handleSelectShipping = (order) => {
    //     setShippingOrder(order);
    //     setShowShippingModal(true);
    // };

    // const onShippingSelected = (selectedQuote) => {
    //     // Refresh orders to get updated shipping information
    //     fetchOrders();
    //     fetchOrderStats();
    //     setShowShippingModal(false);
    //     setShippingOrder(null);
    // };

    // Filter orders based on status and search term
    const filteredOrders = orders.filter(order => {
        const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
        const matchesSearch = order.productDetails.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order._id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // Get status badge color
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-orange-100 text-orange-800';
            case 'shipped':
                return 'bg-purple-100 text-purple-800';
            case 'out_for_delivery':
                return 'bg-indigo-100 text-indigo-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Order Detail Modal
    const OrderDetailModal = ({ order, onClose, onUpdateStatus }) => {
        const [newStatus, setNewStatus] = useState(order.orderStatus);
        const trackingNumber = order.trackingInfo?.trackingNumber || '';
        const [carrier, setCarrier] = useState(order.trackingInfo?.carrier || '');
        const [estimatedDelivery, setEstimatedDelivery] = useState('');

        const handleStatusUpdate = () => {
            onUpdateStatus(order._id, newStatus, carrier, estimatedDelivery);
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-xl font-semibold">Order Details</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            ✕
                        </button>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        {/* Order Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-medium text-gray-700">Order ID</h3>
                                <p className="text-sm text-gray-600">{order._id}</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-700">Order Date</h3>
                                <p className="text-sm text-gray-600">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="border rounded-lg p-4">
                            <h3 className="font-medium text-gray-700 mb-3">Product Details</h3>
                            <div className="flex space-x-4">
                                {order.productDetails.productImage && order.productDetails.productImage[0] && (
                                    <img
                                        src={order.productDetails.productImage[0]}
                                        alt={order.productDetails.productName}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                )}
                                <div>
                                    <p className="font-medium">{order.productDetails.productName}</p>
                                    <p className="text-sm text-gray-600">{order.productDetails.brandName}</p>
                                    <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
                                    <p className="text-sm font-medium">Total: ₦{order.totalAmount.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="border rounded-lg p-4">
                            <h3 className="font-medium text-gray-700 mb-3">Customer Details</h3>
                            <div className="space-y-2">
                                <p><span className="font-medium">Name:</span> {order.buyer.name}</p>
                                <p><span className="font-medium">Email:</span> {order.buyer.email}</p>
                                {order.buyer.phone && (
                                    <p><span className="font-medium">Phone:</span> {order.buyer.phone}</p>
                                )}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="border rounded-lg p-4">
                            <h3 className="font-medium text-gray-700 mb-3">Shipping Address</h3>
                            <div className="space-y-1">
                                <p>{order.shippingAddress.street}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                                <p>{order.shippingAddress.zipCode}, {order.shippingAddress.country}</p>
                            </div>
                        </div>

                        {/* Order Status Update */}
                        <div className="border rounded-lg p-4">
                            <h3 className="font-medium text-gray-700 mb-3">Update Order Status</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Order Status
                                    </label>
                                    <select
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="out_for_delivery">Out for Delivery</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>

                                {(newStatus === 'processing' || newStatus === 'shipped' || newStatus === 'out_for_delivery' || newStatus === 'delivered') && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tracking Number (Auto-Generated)
                                            </label>
                                            <input
                                                type="text"
                                                value={trackingNumber}
                                                readOnly
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                                                placeholder="Auto-generated tracking ID"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Tracking ID is automatically generated and cannot be changed</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Carrier/Shipping Company (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                value={carrier}
                                                onChange={(e) => setCarrier(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="e.g., DHL, FedEx, Local Courier"
                                            />
                                        </div>
                                    </>
                                )}

                                {(newStatus === 'processing' || newStatus === 'shipped' || newStatus === 'out_for_delivery') && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Estimated Delivery (Optional)
                                        </label>
                                        <input
                                            type="date"
                                            value={estimatedDelivery}
                                            onChange={(e) => setEstimatedDelivery(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                )}

                                <button
                                    onClick={handleStatusUpdate}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                                >
                                    Update Order Status
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
                <p className="text-gray-600 mt-2">Manage and track all your customer orders</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders || 0}</p>
                        </div>
                        <FaBox className="text-blue-600 text-2xl" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                            <p className="text-2xl font-bold text-yellow-600">
                                {stats.ordersByStatus?.pending?.count || 0}
                            </p>
                        </div>
                        <FaClock className="text-yellow-600 text-2xl" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Shipped Orders</p>
                            <p className="text-2xl font-bold text-purple-600">
                                {stats.ordersByStatus?.shipped?.count || 0}
                            </p>
                        </div>
                        <FaBox className="text-purple-600 text-2xl" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                            <p className="text-2xl font-bold text-green-600">
                                ₦{(stats.totalRevenue || 0).toLocaleString()}
                            </p>
                        </div>
                        <FaCheck className="text-green-600 text-2xl" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <FaFilter className="text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tracking
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            #{order._id.slice(-8)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{order.buyer.name}</div>
                                        <div className="text-sm text-gray-500">{order.buyer.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            {order.productDetails.productImage && order.productDetails.productImage[0] && (
                                                <img
                                                    src={order.productDetails.productImage[0]}
                                                    alt={order.productDetails.productName}
                                                    className="w-10 h-10 object-cover rounded"
                                                />
                                            )}
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {order.productDetails.productName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Qty: {order.quantity}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            ₦{order.totalAmount.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(order.orderStatus)}`}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {order.trackingInfo?.trackingNumber || 'Not assigned'}
                                        </div>
                                        {order.trackingInfo?.carrier && (
                                            <div className="text-xs text-gray-500">
                                                {order.trackingInfo.carrier}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setShowDetailModal(true);
                                                }}
                                                className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                                            >
                                                <FaEye />
                                                <span>View</span>
                                            </button>
                                            {/* Shipping functionality removed - single company model */}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredOrders.length === 0 && (
                    <div className="text-center py-12">
                        <FaBox className="mx-auto text-gray-400 text-6xl mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders found</h3>
                        <p className="text-gray-500">
                            {statusFilter === 'all' ? 'You haven\'t received any orders yet.' : `No ${statusFilter} orders found.`}
                        </p>
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            {showDetailModal && selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => {
                        setShowDetailModal(false);
                        setSelectedOrder(null);
                    }}
                    onUpdateStatus={updateOrderStatus}
                />
            )}

            {/* Shipping functionality removed - single company model */}
        </div>
    );
};

export default SellerOrders;
