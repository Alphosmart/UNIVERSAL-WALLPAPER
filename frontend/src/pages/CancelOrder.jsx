import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaTimes, FaExclamationTriangle, FaInfoCircle, FaClock, FaCheckCircle, FaSearch, FaUndo } from 'react-icons/fa';
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const CancelOrder = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [orderFound, setOrderFound] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancellationSuccess, setCancellationSuccess] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    if (orderId) {
      setOrderNumber(orderId);
      fetchOrderDetails(orderId);
    }
  }, [searchParams]);

  const fetchOrderDetails = async (orderId) => {
    try {
      setLoading(true);
      // Fetch user orders and find the specific order
      const response = await fetch(SummaryApi.userOrders.url, {
        method: SummaryApi.userOrders.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        const order = data.data.find(order => order._id === orderId);
        if (order) {
          setOrderDetails(order);
          setOrderFound(true);
        } else {
          toast.error('Order not found or you do not have access to this order');
          setOrderFound(false);
        }
      } else {
        toast.error(data.message || 'Failed to fetch orders');
        setOrderFound(false);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to fetch order details');
      setOrderFound(false);
    } finally {
      setLoading(false);
    }
  };

  const cancelReasons = [
    'Changed my mind',
    'Found better price elsewhere',
    'Ordered by mistake',
    'Product no longer needed',
    'Shipping too slow',
    'Wrong item ordered',
    'Other'
  ];

  const handleSearchOrder = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    
    await fetchOrderDetails(orderNumber.trim());
  };

  const handleCancelOrder = async (e) => {
    e.preventDefault();
    if (!cancelReason) {
      toast.error('Please select a cancellation reason');
      return;
    }

    if (!orderDetails) {
      toast.error('Order details not found');
      return;
    }

    // Check if order can be cancelled
    const nonCancellableStatuses = ['shipped', 'delivered', 'cancelled'];
    if (nonCancellableStatuses.includes(orderDetails.orderStatus?.toLowerCase())) {
      toast.error(`Cannot cancel order that is already ${orderDetails.orderStatus}`);
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch(`${SummaryApi.updateOrderStatus.url}/${orderNumber}`, {
        method: SummaryApi.updateOrderStatus.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderStatus: 'cancelled',
          cancellationReason: cancelReason
        })
      });

      const data = await response.json();

      if (data.success) {
        setCancellationSuccess(true);
        toast.success('Order cancelled successfully');
      } else {
        toast.error(data.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cancellationSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-md p-8">
              <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Cancelled Successfully</h1>
              <p className="text-gray-600 mb-6">
                Your order <span className="font-mono text-blue-600">#{orderNumber}</span> has been cancelled successfully.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-green-800 mb-2">What happens next?</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Refund will be processed within 3-5 business days</li>
                  <li>• You'll receive an email confirmation</li>
                  <li>• Money will be credited to your original payment method</li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/my-orders" 
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View My Orders
                </Link>
                <Link 
                  to="/" 
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link to="/help-center" className="hover:text-blue-600">Help Center</Link>
            <span>/</span>
            <span className="text-gray-900">Cancel Order</span>
          </div>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FaTimes className="text-6xl text-red-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cancel Your Order</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Need to cancel an order? We'll help you through the process quickly and easily.
          </p>
        </div>

        {/* Warning Notice */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <FaExclamationTriangle className="text-yellow-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-yellow-800 mb-2">Important Cancellation Information</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Orders can only be cancelled before they are shipped</li>
                  <li>• Once an item is shipped, you can only return it after delivery</li>
                  <li>• Refunds are processed within 3-5 business days after cancellation</li>
                  <li>• Some payment methods may take longer for refund processing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {!orderFound ? (
          /* Search Order Form */
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Find Your Order</h2>
              <form onSubmit={handleSearchOrder} className="space-y-6">
                <div>
                  <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Order Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="orderNumber"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      placeholder="Enter your order number (e.g., ORD123456789)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    You can find your order number in the confirmation email or your order history.
                  </p>
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !orderNumber.trim()}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <FaSearch />
                      <span>Find Order</span>
                    </>
                  )}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <Link 
                  to="/my-orders" 
                  className="text-blue-600 hover:underline text-sm"
                >
                  Or view all your orders →
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Order Details & Cancellation Form */
          <div className="max-w-4xl mx-auto">
            {/* Order Details */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order Details</h2>
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Order Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Number:</span>
                        <span className="font-mono text-blue-600">#{orderNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Date:</span>
                        <span>August 8, 2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-semibold">₹2,499</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span>Credit Card ****1234</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Current Status</h3>
                    <div className="flex items-center space-x-2 mb-4">
                      <FaClock className="text-orange-500" />
                      <span className="font-medium text-orange-600">Processing</span>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <FaCheckCircle className="text-green-500" />
                        <span className="text-sm font-medium text-green-800">Eligible for Cancellation</span>
                      </div>
                      <p className="text-xs text-green-700 mt-1">This order hasn't been shipped yet and can be cancelled.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cancellation Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Cancel This Order</h2>
              <form onSubmit={handleCancelOrder} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Reason for Cancellation *
                  </label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {cancelReasons.map((reason, index) => (
                      <label key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="cancelReason"
                          value={reason}
                          checked={cancelReason === reason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{reason}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <FaInfoCircle className="text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-red-800 mb-2">Before You Cancel</h3>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• This action cannot be undone</li>
                        <li>• You'll receive a refund within 3-5 business days</li>
                        <li>• Any applied discounts or offers will be lost</li>
                        <li>• Consider contacting support for other options</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={loading || !cancelReason}
                    className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Cancelling...</span>
                      </>
                    ) : (
                      <>
                        <FaTimes />
                        <span>Cancel Order</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderFound(false)}
                    className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <FaUndo />
                    <span>Go Back</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Cancellation FAQ</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I cancel my order after it's shipped?</h3>
                <p className="text-gray-600">No, orders cannot be cancelled once they're shipped. However, you can return the item after delivery for a full refund.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How long does it take to get my refund?</h3>
                <p className="text-gray-600">Refunds are typically processed within 3-5 business days. The time to reflect in your account depends on your payment method and bank.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Will I lose my discount if I cancel?</h3>
                <p className="text-gray-600">Yes, any discounts, coupons, or promotional offers applied to the cancelled order will be lost and cannot be reapplied to future orders.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I cancel just one item from my order?</h3>
                <p className="text-gray-600">Currently, you can only cancel the entire order. For partial cancellations, please contact our customer support team.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="text-center bg-gray-100 rounded-lg p-8 mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-6">Our support team is here to assist you with any questions about order cancellation.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/help-center" 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Visit Help Center
            </Link>
            <button 
              onClick={() => {
                alert('Live chat feature coming soon!');
              }}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Start Live Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelOrder;
