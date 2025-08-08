import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUndo, FaBox, FaShippingFast, FaCreditCard, FaCheckCircle, FaExclamationTriangle, FaClock, FaInfoCircle } from 'react-icons/fa';

const ReturnsRefunds = () => {
  const [selectedTab, setSelectedTab] = useState('returns');

  const returnReasons = [
    { reason: 'Defective/Damaged', description: 'Item arrived damaged or not working properly', timeLimit: '30 days' },
    { reason: 'Wrong Item', description: 'Received different item than ordered', timeLimit: '30 days' },
    { reason: 'Size/Fit Issues', description: 'Item doesn\'t fit as expected', timeLimit: '15 days' },
    { reason: 'Not as Described', description: 'Item doesn\'t match product description', timeLimit: '30 days' },
    { reason: 'Changed Mind', description: 'No longer need the item', timeLimit: '7 days' },
    { reason: 'Quality Issues', description: 'Item quality below expectations', timeLimit: '15 days' }
  ];

  const returnProcess = [
    {
      step: 1,
      title: 'Initiate Return',
      description: 'Go to your orders and select the item you want to return',
      icon: <FaBox className="text-blue-500" />
    },
    {
      step: 2,
      title: 'Package Item',
      description: 'Pack the item in original packaging with all accessories',
      icon: <FaBox className="text-green-500" />
    },
    {
      step: 3,
      title: 'Schedule Pickup',
      description: 'We\'ll arrange free pickup from your address',
      icon: <FaShippingFast className="text-orange-500" />
    },
    {
      step: 4,
      title: 'Get Refund',
      description: 'Receive refund within 3-5 days after item verification',
      icon: <FaCreditCard className="text-purple-500" />
    }
  ];

  const eligibilityRules = [
    { category: 'Electronics', condition: 'Original packaging required', timeLimit: '15 days', refundable: true },
    { category: 'Clothing & Fashion', condition: 'Tags attached, unworn', timeLimit: '30 days', refundable: true },
    { category: 'Books', condition: 'Undamaged condition', timeLimit: '30 days', refundable: true },
    { category: 'Home & Kitchen', condition: 'Unused, original packaging', timeLimit: '15 days', refundable: true },
    { category: 'Beauty & Personal Care', condition: 'Unopened/unused only', timeLimit: '7 days', refundable: false },
    { category: 'Groceries & Food', condition: 'Non-returnable', timeLimit: 'N/A', refundable: false }
  ];

  const refundMethods = [
    { method: 'Original Payment Method', time: '3-5 business days', preferred: true },
    { method: 'Store Credit', time: 'Instant', preferred: false },
    { method: 'Bank Transfer', time: '5-7 business days', preferred: false }
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
            <span className="text-gray-900">Returns & Refunds</span>
          </div>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FaUndo className="text-6xl text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Returns & Refunds</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Easy returns and hassle-free refunds. We want you to shop with confidence knowing you can return items that don't meet your expectations.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setSelectedTab('returns')}
              className={`flex-1 py-3 px-6 text-sm font-medium rounded-md transition-colors ${
                selectedTab === 'returns'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Return Process
            </button>
            <button
              onClick={() => setSelectedTab('eligibility')}
              className={`flex-1 py-3 px-6 text-sm font-medium rounded-md transition-colors ${
                selectedTab === 'eligibility'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Return Eligibility
            </button>
            <button
              onClick={() => setSelectedTab('refunds')}
              className={`flex-1 py-3 px-6 text-sm font-medium rounded-md transition-colors ${
                selectedTab === 'refunds'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Refund Policy
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl mx-auto">
          {selectedTab === 'returns' && (
            <div className="space-y-8">
              {/* Return Process */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">How to Return an Item</h2>
                <div className="grid md:grid-cols-4 gap-6">
                  {returnProcess.map((step, index) => (
                    <div key={index} className="text-center">
                      <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        {step.icon}
                      </div>
                      <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-3">
                        <span className="text-sm font-bold text-blue-600">{step.step}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Return Reasons */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Valid Return Reasons</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {returnReasons.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">{item.reason}</h3>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{item.timeLimit}</span>
                      </div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Action */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ready to Return an Item?</h2>
                <p className="text-gray-600 mb-6">Access your order history to start a return request</p>
                <Link 
                  to="/my-orders" 
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaBox />
                  <span>View My Orders</span>
                </Link>
              </div>
            </div>
          )}

          {selectedTab === 'eligibility' && (
            <div className="space-y-8">
              {/* Eligibility Rules */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Return Eligibility by Category</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Condition</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Time Limit</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Refundable</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eligibilityRules.map((rule, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium text-gray-900">{rule.category}</td>
                          <td className="py-3 px-4 text-gray-600">{rule.condition}</td>
                          <td className="py-3 px-4 text-gray-600">{rule.timeLimit}</td>
                          <td className="py-3 px-4">
                            {rule.refundable ? (
                              <FaCheckCircle className="text-green-500" />
                            ) : (
                              <FaExclamationTriangle className="text-red-500" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Special Conditions */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Special Conditions</h2>
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <FaExclamationTriangle className="text-yellow-500 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-yellow-800 mb-2">Non-Returnable Items</h3>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          <li>• Personalized or customized products</li>
                          <li>• Perishable goods (food, flowers, etc.)</li>
                          <li>• Intimate or sanitary goods</li>
                          <li>• Digital downloads or software</li>
                          <li>• Gift cards and vouchers</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <FaInfoCircle className="text-blue-500 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-blue-800 mb-2">Exchange Only Items</h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Opened beauty products (can be exchanged if defective)</li>
                          <li>• Software with broken seals (if defective only)</li>
                          <li>• Mattresses and bedding (hygiene policy)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'refunds' && (
            <div className="space-y-8">
              {/* Refund Methods */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Refund Methods & Timeline</h2>
                <div className="space-y-4">
                  {refundMethods.map((method, index) => (
                    <div key={index} className={`border rounded-lg p-4 ${method.preferred ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className={`font-medium ${method.preferred ? 'text-blue-900' : 'text-gray-900'}`}>
                            {method.method}
                            {method.preferred && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Recommended</span>}
                          </h3>
                          <p className={`text-sm ${method.preferred ? 'text-blue-700' : 'text-gray-600'}`}>
                            Processing time: {method.time}
                          </p>
                        </div>
                        <FaClock className={method.preferred ? 'text-blue-500' : 'text-gray-400'} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Refund Policy Details */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Refund Policy Details</h2>
                <div className="prose max-w-none">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Processing Timeline</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li>• <strong>Item Inspection:</strong> 1-2 business days after we receive your return</li>
                        <li>• <strong>Refund Initiation:</strong> Within 24 hours of approval</li>
                        <li>• <strong>Credit Reflection:</strong> 3-5 business days (varies by payment method)</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Refund Amount</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li>• <strong>Product Price:</strong> Full refund for eligible returns</li>
                        <li>• <strong>Shipping Costs:</strong> Refunded only if item was defective or wrong</li>
                        <li>• <strong>Return Shipping:</strong> Free pickup provided for most returns</li>
                        <li>• <strong>Processing Fees:</strong> No additional fees for standard returns</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Special Circumstances</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li>• <strong>Damaged Items:</strong> Immediate full refund + compensation for inconvenience</li>
                        <li>• <strong>Wrong Items:</strong> Free return shipping + expedited replacement</li>
                        <li>• <strong>Quality Issues:</strong> Full refund + option to repurchase at discount</li>
                        <li>• <strong>Late Delivery:</strong> Shipping refund + possible compensation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Refund Status Tracking */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Track Your Refund Status</h2>
                <p className="text-gray-600 text-center mb-6">
                  Monitor the progress of your refund request in real-time
                </p>
                <div className="text-center">
                  <Link 
                    to="/my-orders" 
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <FaCreditCard />
                    <span>Check Refund Status</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I know if my item is eligible for return?</h3>
                <p className="text-gray-600">Check the return eligibility table above, or look for return information on the product page. Most items can be returned within 15-30 days.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Do I need to pay for return shipping?</h3>
                <p className="text-gray-600">No, we provide free return pickup for most items. You'll receive a prepaid return label via email.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I exchange an item instead of returning it?</h3>
                <p className="text-gray-600">Yes, you can choose to exchange for a different size, color, or model during the return process, subject to availability.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What if I lost my original packaging?</h3>
                <p className="text-gray-600">While original packaging is preferred, it's not always required. Contact support for guidance on your specific item.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How will I know when my refund is processed?</h3>
                <p className="text-gray-600">You'll receive email notifications at each step, and you can track the status in your order history.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="text-center bg-gray-100 rounded-lg p-8 mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Need Assistance?</h2>
          <p className="text-gray-600 mb-6">Our customer service team is ready to help with your return or refund questions.</p>
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

export default ReturnsRefunds;
