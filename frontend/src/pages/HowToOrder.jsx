import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaSearch, FaUser, FaCreditCard, FaCheck } from 'react-icons/fa';

const HowToOrder = () => {
  const steps = [
    {
      number: 1,
      title: "Browse Products",
      description: "Search or browse through our wide selection of products",
      icon: FaSearch,
      details: [
        "Use the search bar to find specific items",
        "Browse by categories",
        "Filter by price, brand, or rating",
        "Read product reviews and descriptions"
      ]
    },
    {
      number: 2,
      title: "Add to Cart",
      description: "Select the products you want and add them to your cart",
      icon: FaShoppingCart,
      details: [
        "Choose product options (size, color, etc.)",
        "Select quantity",
        "Click 'Add to Cart'",
        "Continue shopping or proceed to checkout"
      ]
    },
    {
      number: 3,
      title: "Sign In or Create Account",
      description: "Log in to your account or create a new one",
      icon: FaUser,
      details: [
        "Click 'Login' or 'Sign Up'",
        "Fill in your information",
        "Verify your email address",
        "Complete your profile"
      ]
    },
    {
      number: 4,
      title: "Checkout & Payment",
      description: "Review your order and complete the payment",
      icon: FaCreditCard,
      details: [
        "Review items in your cart",
        "Enter shipping address",
        "Choose delivery method",
        "Select payment method and complete purchase"
      ]
    },
    {
      number: 5,
      title: "Order Confirmation",
      description: "Receive confirmation and track your order",
      icon: FaCheck,
      details: [
        "Get order confirmation email",
        "Receive tracking information",
        "Monitor delivery status",
        "Rate and review your purchase"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How to Place an Order</h1>
          <p className="text-xl text-gray-600">
            Follow these simple steps to complete your purchase
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={step.number} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start gap-6">
                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {step.number}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <step.icon className="text-2xl text-blue-600" />
                      <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    
                    {/* Details */}
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex justify-center">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-200 to-gray-200"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Ready to start shopping?</h2>
          <p className="text-blue-700 mb-6">
            Browse our products and place your first order today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/" 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </Link>
            <Link 
              to="/help-center" 
              className="px-6 py-3 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Back to Help Center
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Can I modify my order after placing it?</h4>
              <p className="text-gray-600">You can modify your order within 30 minutes of placing it. After that, please contact our customer service.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-600">We accept all major credit cards, debit cards, and digital payment methods like PayPal.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">How long does delivery take?</h4>
              <p className="text-gray-600">Standard delivery takes 3-5 business days. Express delivery options are available for faster shipping.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToOrder;
