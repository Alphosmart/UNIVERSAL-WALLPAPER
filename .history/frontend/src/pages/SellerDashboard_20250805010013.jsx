import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    FaBox, 
    FaShoppingCart, 
    FaDollarSign, 
    FaClock, 
    FaShippingFast, 
    FaCheck, 
    FaEye,
    FaPlus,
    FaCog,
    FaChartLine,
    FaTimes
} from 'react-icons/fa';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const SellerDashboard = () => {
    const [stats, setStats] = useState({});
    const [recentOrders, setRecentOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

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

    // Fetch recent orders (last 5)
    const fetchRecentOrders = async () => {
        try {
            const response = await fetch(SummaryApi.getSellerOrders.url, {
                method: SummaryApi.getSellerOrders.method,
                credentials: 'include'
            });

            const result = await response.json();
            if (result.success) {
                // Get last 5 orders
                setRecentOrders(result.data.slice(0, 5));
            }
        } catch (error) {
            console.error('Error fetching recent orders:', error);
        }
    };

    // Fetch seller products
    const fetchProducts = async () => {
        try {
            const response = await fetch(SummaryApi.getUserProducts.url, {
                method: SummaryApi.getUserProducts.method,
                credentials: 'include'
            });

            const result = await response.json();
            if (result.success) {
                setProducts(result.data.slice(0, 6)); // Show 6 recent products
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    fetchOrderStats(),
                    fetchRecentOrders(),
                    fetchProducts()
                ]);
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    // Get status badge color
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
                return 'bg-purple-100 text-purple-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
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
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Seller Dashboard</h1>
                    <p className="text-gray-600 mt-2">Welcome to your seller control center</p>
                </div>
                <div className="flex space-x-3">
                    <Link
                        to="/add-product"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                    >
                        <FaPlus />
                        <span>Add Product</span>
                    </Link>
                    <Link
                        to="/seller-account-settings"
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                    >
                        <FaCog />
                        <span>Settings</span>
                    </Link>
                </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders || 0}</p>
                            <p className="text-xs text-gray-500 mt-1">All time</p>
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
                            <p className="text-xs text-gray-500 mt-1">Need attention</p>
                        </div>
                        <FaClock className="text-yellow-600 text-2xl" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Products</p>
                            <p className="text-2xl font-bold text-purple-600">{products.length}</p>
                            <p className="text-xs text-gray-500 mt-1">Active listings</p>
                        </div>
                        <FaShoppingCart className="text-purple-600 text-2xl" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                            <p className="text-2xl font-bold text-green-600">
                                ₦{(stats.totalRevenue || 0).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">All time earnings</p>
                        </div>
                        <FaDollarSign className="text-green-600 text-2xl" />
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link
                        to="/seller-orders"
                        className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                        <FaBox className="text-blue-600 text-2xl mb-2" />
                        <span className="text-sm font-medium text-gray-700">Manage Orders</span>
                        {stats.ordersByStatus?.pending?.count > 0 && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full mt-1">
                                {stats.ordersByStatus.pending.count} pending
                            </span>
                        )}
                    </Link>

                    <Link
                        to="/my-products"
                        className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                    >
                        <FaShoppingCart className="text-green-600 text-2xl mb-2" />
                        <span className="text-sm font-medium text-gray-700">My Products</span>
                        <span className="text-xs text-gray-500 mt-1">{products.length} products</span>
                    </Link>

                    <Link
                        to="/add-product"
                        className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                    >
                        <FaPlus className="text-purple-600 text-2xl mb-2" />
                        <span className="text-sm font-medium text-gray-700">Add Product</span>
                        <span className="text-xs text-gray-500 mt-1">List new item</span>
                    </Link>

                    <Link
                        to="/analytics"
                        className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
                    >
                        <FaChartLine className="text-orange-600 text-2xl mb-2" />
                        <span className="text-sm font-medium text-gray-700">Analytics</span>
                        <span className="text-xs text-gray-500 mt-1">View reports</span>
                    </Link>
                </div>
            </div>

            {/* Recent Orders and Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
                        <Link
                            to="/seller-orders"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            View all
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {recentOrders.length > 0 ? (
                            recentOrders.map((order) => (
                                <div key={order._id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center space-x-3">
                                        {order.productDetails.productImage && order.productDetails.productImage[0] && (
                                            <img
                                                src={order.productDetails.productImage[0]}
                                                alt={order.productDetails.productName}
                                                className="w-10 h-10 object-cover rounded"
                                            />
                                        )}
                                        <div>
                                            <p className="font-medium text-sm">{order.productDetails.productName}</p>
                                            <p className="text-xs text-gray-500">{order.buyer.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-sm">₦{order.totalAmount.toLocaleString()}</p>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(order.orderStatus)}`}>
                                            {order.orderStatus}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <FaBox className="mx-auto text-gray-400 text-3xl mb-2" />
                                <p className="text-gray-500">No orders yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Products */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Your Products</h2>
                        <Link
                            to="/my-products"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            View all
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <div key={product._id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center space-x-3">
                                        {product.productImage && product.productImage[0] && (
                                            <img
                                                src={product.productImage[0]}
                                                alt={product.productName}
                                                className="w-10 h-10 object-cover rounded"
                                            />
                                        )}
                                        <div>
                                            <p className="font-medium text-sm">{product.productName}</p>
                                            <p className="text-xs text-gray-500">{product.category}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-sm">₦{product.sellingPrice?.toLocaleString()}</p>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            product.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {product.status || 'Active'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <FaShoppingCart className="mx-auto text-gray-400 text-3xl mb-2" />
                                <p className="text-gray-500 mb-2">No products yet</p>
                                <Link
                                    to="/add-product"
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    Add your first product
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Order Status Breakdown */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Status Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                        <FaClock className="mx-auto text-yellow-600 text-2xl mb-2" />
                        <p className="text-lg font-bold text-yellow-800">
                            {stats.ordersByStatus?.pending?.count || 0}
                        </p>
                        <p className="text-sm text-yellow-600">Pending</p>
                    </div>

                    <div className="text-center p-4 border border-blue-200 rounded-lg bg-blue-50">
                        <FaCheck className="mx-auto text-blue-600 text-2xl mb-2" />
                        <p className="text-lg font-bold text-blue-800">
                            {stats.ordersByStatus?.confirmed?.count || 0}
                        </p>
                        <p className="text-sm text-blue-600">Confirmed</p>
                    </div>

                    <div className="text-center p-4 border border-purple-200 rounded-lg bg-purple-50">
                        <FaShippingFast className="mx-auto text-purple-600 text-2xl mb-2" />
                        <p className="text-lg font-bold text-purple-800">
                            {stats.ordersByStatus?.shipped?.count || 0}
                        </p>
                        <p className="text-sm text-purple-600">Shipped</p>
                    </div>

                    <div className="text-center p-4 border border-green-200 rounded-lg bg-green-50">
                        <FaCheck className="mx-auto text-green-600 text-2xl mb-2" />
                        <p className="text-lg font-bold text-green-800">
                            {stats.ordersByStatus?.delivered?.count || 0}
                        </p>
                        <p className="text-sm text-green-600">Delivered</p>
                    </div>

                    <div className="text-center p-4 border border-red-200 rounded-lg bg-red-50">
                        <FaTimes className="mx-auto text-red-600 text-2xl mb-2" />
                        <p className="text-lg font-bold text-red-800">
                            {stats.ordersByStatus?.cancelled?.count || 0}
                        </p>
                        <p className="text-sm text-red-600">Cancelled</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;
