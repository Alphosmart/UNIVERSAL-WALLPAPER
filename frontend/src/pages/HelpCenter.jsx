import React from 'react';
import { Link } from 'react-router-dom';
import { FaQuestionCircle, FaShoppingCart, FaCreditCard, FaShippingFast, FaUndo, FaComments, FaSearch } from 'react-icons/fa';

const HelpCenter = () => {
  const helpTopics = [
    {
      title: "Getting Started",
      icon: FaQuestionCircle,
      color: "blue",
      items: [
        { title: "How to create an account", link: "/help/create-account" },
        { title: "Account verification", link: "/help/verification" },
        { title: "Setting up your profile", link: "/help/profile-setup" }
      ]
    },
    {
      title: "Orders & Shopping",
      icon: FaShoppingCart,
      color: "green",
      items: [
        { title: "How to place an order", link: "/how-to-order" },
        { title: "Modifying your order", link: "/help/modify-order" },
        { title: "Order confirmation", link: "/help/order-confirmation" }
      ]
    },
    {
      title: "Payment & Billing",
      icon: FaCreditCard,
      color: "purple",
      items: [
        { title: "Payment methods", link: "/payment-options" },
        { title: "Payment security", link: "/help/payment-security" },
        { title: "Billing issues", link: "/help/billing" }
      ]
    },
    {
      title: "Shipping & Delivery",
      icon: FaShippingFast,
      color: "orange",
      items: [
        { title: "Track your order", link: "/track-order" },
        { title: "Delivery options", link: "/help/delivery" },
        { title: "Shipping costs", link: "/help/shipping-costs" }
      ]
    },
    {
      title: "Returns & Cancellations",
      icon: FaUndo,
      color: "indigo",
      items: [
        { title: "Cancel an order", link: "/cancel-order" },
        { title: "Return policy", link: "/returns-refunds" },
        { title: "Refund process", link: "/help/refunds" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600 mb-8">
            Find answers to your questions and get the help you need
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help articles..."
                className="w-full px-6 py-4 pr-12 text-lg border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <FaSearch className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link to="/track-order" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
            <FaShippingFast className="text-3xl text-orange-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Track Your Order</h3>
            <p className="text-gray-600">Check the status of your recent orders</p>
          </Link>
          
          <Link to="/returns-refunds" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
            <FaUndo className="text-3xl text-indigo-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Returns & Refunds</h3>
            <p className="text-gray-600">Start a return or check refund status</p>
          </Link>
          
          <button 
            onClick={() => alert('Live chat feature coming soon!')}
            className="bg-orange-500 text-white p-6 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <FaComments className="text-3xl mb-4" />
            <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
            <p>Get instant help from our support team</p>
          </button>
        </div>

        {/* Help Topics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {helpTopics.map((topic, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className={`bg-${topic.color}-50 p-6 border-b border-gray-200`}>
                <div className="flex items-center gap-3">
                  <topic.icon className={`text-2xl text-${topic.color}-600`} />
                  <h3 className={`text-lg font-semibold text-${topic.color}-900`}>{topic.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {topic.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Link 
                        to={item.link} 
                        className="text-gray-700 hover:text-blue-600 transition-colors block py-1"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still need help?</h2>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Contact Support
            </button>
            <Link 
              to="/faq" 
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
