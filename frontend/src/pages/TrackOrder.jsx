import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShippingFast, FaSearch, FaMapMarkerAlt, FaClock, FaTruck, FaBox, FaHome } from 'react-icons/fa';

const TrackOrder = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock tracking data
      setTrackingResult({
        trackingNumber: trackingNumber,
        status: 'In Transit',
        estimatedDelivery: '2025-08-12',
        currentLocation: 'Distribution Center, Mumbai',
        events: [
          {
            date: '2025-08-08',
            time: '14:30',
            status: 'Package shipped',
            location: 'Warehouse, Delhi',
            icon: <FaBox className="text-blue-500" />
          },
          {
            date: '2025-08-09',
            time: '09:15',
            status: 'In transit',
            location: 'Hub, Jaipur',
            icon: <FaTruck className="text-orange-500" />
          },
          {
            date: '2025-08-10',
            time: '16:45',
            status: 'Arrived at facility',
            location: 'Distribution Center, Mumbai',
            icon: <FaMapMarkerAlt className="text-purple-500" />
          },
          {
            date: '2025-08-12',
            time: 'Expected',
            status: 'Out for delivery',
            location: 'Your area',
            icon: <FaHome className="text-green-500" />
          }
        ]
      });
    } catch (err) {
      setError('Unable to track order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const trackingExamples = [
    { format: 'AS1234567890', description: 'Standard tracking number (12 digits)' },
    { format: 'TRK-2024-001234', description: 'Premium tracking code' },
    { format: 'ORD123456789', description: 'Order-based tracking' }
  ];

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
            <span className="text-gray-900">Track Order</span>
          </div>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FaShippingFast className="text-6xl text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Order</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enter your tracking number below to get real-time updates on your order status and delivery progress.
          </p>
        </div>

        {/* Tracking Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <form onSubmit={handleTrackOrder} className="space-y-6">
              <div>
                <label htmlFor="tracking" className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking Number / Order ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="tracking"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter your tracking number (e.g., AS1234567890)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                {error && (
                  <p className="text-red-600 text-sm mt-2">{error}</p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Tracking...</span>
                  </>
                ) : (
                  <>
                    <FaSearch />
                    <span>Track Order</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Tracking Result */}
        {trackingResult && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="border-b border-gray-200 pb-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Order Status</h2>
                    <p className="text-gray-600">Tracking Number: <span className="font-mono text-blue-600">{trackingResult.trackingNumber}</span></p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <div className="flex items-center space-x-2">
                      <FaClock className="text-green-500" />
                      <span className="text-sm text-gray-600">Estimated Delivery:</span>
                      <span className="font-semibold text-green-600">{trackingResult.estimatedDelivery}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FaMapMarkerAlt className="text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Current Status: {trackingResult.status}</p>
                      <p className="text-blue-700">{trackingResult.currentLocation}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tracking Timeline */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Shipping Timeline</h3>
                <div className="space-y-6">
                  {trackingResult.events.map((event, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {event.icon}
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{event.status}</p>
                            <p className="text-gray-600">{event.location}</p>
                          </div>
                          <div className="mt-1 md:mt-0 text-sm text-gray-500">
                            {event.date} {event.time !== 'Expected' && `at ${event.time}`}
                          </div>
                        </div>
                      </div>
                      {index < trackingResult.events.length - 1 && (
                        <div className="absolute left-5 mt-10 w-0.5 h-6 bg-gray-200"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tracking Number Examples */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Tracking Number Formats</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {trackingExamples.map((example, index) => (
                <div key={index} className="text-center">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="font-mono text-lg text-blue-600 mb-2">{example.format}</p>
                    <p className="text-sm text-gray-600">{example.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <p className="text-gray-600">
                You can find your tracking number in the order confirmation email or in your 
                <Link to="/my-orders" className="text-blue-600 hover:underline ml-1">order history</Link>.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Tracking FAQ</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How long does it take for tracking to update?</h3>
                <p className="text-gray-600">Tracking information typically updates within 24 hours of shipment. During peak seasons, updates may take up to 48 hours.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What if my tracking number isn't working?</h3>
                <p className="text-gray-600">Please ensure you've entered the correct tracking number. If it still doesn't work, contact our support team with your order details.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I track multiple orders at once?</h3>
                <p className="text-gray-600">Currently, you can track one order at a time. Visit your order history to see all your recent orders and their tracking numbers.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What if my package is delayed?</h3>
                <p className="text-gray-600">Delays can occur due to weather, high volume, or other factors. If your package is significantly delayed, please contact our support team.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="text-center bg-gray-100 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Need Additional Help?</h2>
          <p className="text-gray-600 mb-6">Can't find your tracking information or have questions about your order?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/help-center" 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Visit Help Center
            </Link>
            <Link 
              to="/my-orders" 
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
