import React from 'react';
import { Link } from 'react-router-dom';
import { FaCreditCard, FaPaypal, FaGooglePay, FaApplePay, FaUniversity, FaMobile, FaShieldAlt, FaLock, FaCheckCircle } from 'react-icons/fa';

const PaymentOptions = () => {
  const paymentMethods = [
    {
      icon: <FaCreditCard className="text-4xl text-blue-600" />,
      title: "Credit & Debit Cards",
      description: "Visa, Mastercard, American Express, and Discover",
      features: ["Instant payment processing", "Secure encryption", "Cashback eligible"],
      popular: true
    },
    {
      icon: <FaPaypal className="text-4xl text-blue-500" />,
      title: "PayPal",
      description: "Pay with your PayPal account or PayPal Credit",
      features: ["Buyer protection", "No card details shared", "Pay in 4 available"]
    },
    {
      icon: <FaGooglePay className="text-4xl text-green-600" />,
      title: "Google Pay",
      description: "Quick and secure payments with Google Pay",
      features: ["One-tap checkout", "Biometric authentication", "Transaction history"]
    },
    {
      icon: <FaApplePay className="text-4xl text-gray-800" />,
      title: "Apple Pay",
      description: "Pay securely with Touch ID or Face ID",
      features: ["Contactless payment", "Privacy protection", "Works across devices"]
    },
    {
      icon: <FaUniversity className="text-4xl text-purple-600" />,
      title: "Bank Transfer",
      description: "Direct bank transfer or wire transfer",
      features: ["Lower fees", "High transfer limits", "Bank-level security"]
    },
    {
      icon: <FaMobile className="text-4xl text-orange-600" />,
      title: "Mobile Wallets",
      description: "UPI, PhonePe, Paytm, and other mobile wallets",
      features: ["Instant transfers", "QR code payments", "Cashback offers"]
    }
  ];

  const securityFeatures = [
    {
      icon: <FaShieldAlt className="text-green-500" />,
      title: "SSL Encryption",
      description: "All transactions are protected with 256-bit SSL encryption"
    },
    {
      icon: <FaLock className="text-blue-500" />,
      title: "PCI Compliance",
      description: "We are PCI DSS compliant for secure payment processing"
    },
    {
      icon: <FaCheckCircle className="text-purple-500" />,
      title: "Fraud Protection",
      description: "Advanced fraud detection and prevention systems"
    }
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
            <span className="text-gray-900">Payment Options</span>
          </div>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Options</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We offer multiple secure payment methods to make your shopping experience convenient and safe.
          </p>
        </div>

        {/* Payment Methods Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Available Payment Methods</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paymentMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow relative">
                {method.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-4">
                  {method.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">{method.title}</h3>
                <p className="text-gray-600 mb-4 text-center">{method.description}</p>
                <ul className="space-y-2">
                  {method.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                      <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Your Security is Our Priority</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Process */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">How Payment Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Add to Cart</h3>
              <p className="text-gray-600 text-sm">Select your products and add them to cart</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Checkout</h3>
              <p className="text-gray-600 text-sm">Review your order and shipping details</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Pay Securely</h3>
              <p className="text-gray-600 text-sm">Choose your preferred payment method</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Order Confirmed</h3>
              <p className="text-gray-600 text-sm">Receive confirmation and tracking info</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Payment FAQ</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Is my payment information secure?</h3>
              <p className="text-gray-600">Yes, we use industry-standard SSL encryption and are PCI DSS compliant. Your payment information is never stored on our servers.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">When will my payment be charged?</h3>
              <p className="text-gray-600">Your payment is charged immediately when you place your order. For pre-orders, payment is charged when the item ships.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I change my payment method after ordering?</h3>
              <p className="text-gray-600">Payment methods cannot be changed after an order is placed. If you need to make changes, please cancel your order and place a new one.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you accept international payments?</h3>
              <p className="text-gray-600">Yes, we accept international credit cards and PayPal. Additional fees may apply for currency conversion.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What if my payment fails?</h3>
              <p className="text-gray-600">If your payment fails, please check your card details and try again. Contact your bank if the issue persists or try an alternative payment method.</p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="text-center bg-gray-100 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 mb-6">Our support team is here to help with any payment-related questions.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/help-center" 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Visit Help Center
            </Link>
            <button 
              onClick={() => {
                // Handle live chat functionality
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

export default PaymentOptions;
