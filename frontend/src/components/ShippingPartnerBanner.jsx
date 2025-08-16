import React from 'react';
import { Link } from 'react-router-dom';
import { FaTruck, FaMoneyBillWave, FaClock, FaUsers, FaChartLine, FaHandshake } from 'react-icons/fa';

const ShippingPartnerBanner = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4 my-12">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            🚚 Join Our Shipping Partner Network
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Partner with us to expand your delivery business and reach thousands of customers across Nigeria
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Benefit 1 */}
          <div className="text-center">
            <div className="bg-white bg-opacity-10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <FaMoneyBillWave className="text-3xl text-yellow-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Increase Revenue</h3>
            <p className="text-blue-100">
              Access hundreds of delivery orders daily and boost your earning potential
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="text-center">
            <div className="bg-white bg-opacity-10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-3xl text-green-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Expand Customer Base</h3>
            <p className="text-blue-100">
              Reach new customers and grow your delivery network across multiple cities
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="text-center">
            <div className="bg-white bg-opacity-10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <FaChartLine className="text-3xl text-purple-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Business Growth</h3>
            <p className="text-blue-100">
              Scale your operations with our professional platform and management tools
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="flex items-center space-x-3">
            <FaTruck className="text-yellow-300 text-xl" />
            <span className="text-lg">Professional Dashboard</span>
          </div>
          <div className="flex items-center space-x-3">
            <FaClock className="text-green-300 text-xl" />
            <span className="text-lg">Real-time Order Management</span>
          </div>
          <div className="flex items-center space-x-3">
            <FaHandshake className="text-purple-300 text-xl" />
            <span className="text-lg">Competitive Quote System</span>
          </div>
          <div className="flex items-center space-x-3">
            <FaMoneyBillWave className="text-yellow-300 text-xl" />
            <span className="text-lg">Flexible Pricing Options</span>
          </div>
          <div className="flex items-center space-x-3">
            <FaChartLine className="text-green-300 text-xl" />
            <span className="text-lg">Performance Analytics</span>
          </div>
          <div className="flex items-center space-x-3">
            <FaUsers className="text-purple-300 text-xl" />
            <span className="text-lg">Dedicated Support</span>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">Ready to Start Delivering?</h3>
            <p className="text-blue-100 text-lg">
              Join hundreds of shipping companies already partnered with us
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/shipping-company/register"
              className="bg-white text-blue-600 font-bold py-4 px-8 rounded-lg hover:bg-blue-50 transition-colors shadow-lg text-lg"
            >
              🚚 Register as Shipping Partner
            </Link>
            
            <Link 
              to="/contact-us"
              className="border-2 border-white text-white font-semibold py-4 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-colors text-lg"
            >
              📞 Contact Us for Details
            </Link>
          </div>
          
          <div className="mt-6 text-sm text-blue-200">
            <p>💡 Quick registration • 🔍 Instant verification • 🚀 Start earning immediately</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPartnerBanner;
