import React from 'react';
import { FaUndo, FaCreditCard, FaClock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const ReturnRefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 rounded-full p-4">
              <FaUndo className="text-3xl text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Return & Refund Policy</h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="text-gray-600 mt-2">
            We want you to be completely satisfied with your purchase.
          </p>
        </div>

        {/* Quick Overview */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Overview</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <FaClock className="text-green-600 text-2xl mx-auto mb-2" />
              <h3 className="font-medium text-gray-800">30-Day Returns</h3>
              <p className="text-sm text-gray-600">For most products</p>
            </div>
            <div className="text-center">
              <FaCreditCard className="text-blue-600 text-2xl mx-auto mb-2" />
              <h3 className="font-medium text-gray-800">Full Refunds</h3>
              <p className="text-sm text-gray-600">Original payment method</p>
            </div>
            <div className="text-center">
              <FaCheckCircle className="text-purple-600 text-2xl mx-auto mb-2" />
              <h3 className="font-medium text-gray-800">Easy Process</h3>
              <p className="text-sm text-gray-600">Simple return procedure</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          
          {/* Return Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Return Policy</h2>
            <div className="space-y-4">
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <h3 className="font-medium text-green-800 mb-2">30-Day Return Window</h3>
                <p className="text-green-700 text-sm">
                  You have 30 days from the date of delivery to initiate a return for most products.
                </p>
              </div>
              
              <h3 className="text-lg font-medium text-gray-800">Eligible for Return</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Products in original, unused condition</li>
                <li>Items with original packaging and tags</li>
                <li>Products not damaged by normal wear and tear</li>
                <li>Items that match the original product description</li>
              </ul>
            </div>
          </section>

          {/* Return Categories */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Product Categories</h2>
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Returnable */}
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <FaCheckCircle className="text-green-600 mr-2" />
                  <h3 className="font-medium text-green-800">Fully Returnable</h3>
                </div>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Wallpapers (unopened rolls)</li>
                  <li>• Decorative accessories</li>
                  <li>• Tools and equipment</li>
                  <li>• Lighting fixtures (unused)</li>
                  <li>• Furniture (unassembled)</li>
                </ul>
              </div>

              {/* Non-Returnable */}
              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <FaExclamationCircle className="text-red-600 mr-2" />
                  <h3 className="font-medium text-red-800">Non-Returnable</h3>
                </div>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Custom-made products</li>
                  <li>• Cut wallpaper pieces</li>
                  <li>• Perishable items</li>
                  <li>• Digital products</li>
                  <li>• Opened paint containers</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Return Process */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How to Return Items</h2>
            <div className="space-y-6">
              
              {/* Step 1 */}
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Initiate Return Request</h3>
                  <p className="text-gray-700 text-sm">
                    Log into your account and go to "My Orders" or contact our customer service team. 
                    Provide your order number and reason for return.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Receive Return Authorization</h3>
                  <p className="text-gray-700 text-sm">
                    We'll review your request and provide a Return Authorization (RA) number along with 
                    return shipping instructions.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Package and Ship</h3>
                  <p className="text-gray-700 text-sm">
                    Securely package the item(s) with the RA number clearly marked. Use the provided 
                    shipping label or arrange your own shipping.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold">4</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Processing & Refund</h3>
                  <p className="text-gray-700 text-sm">
                    Once we receive and inspect your return, we'll process your refund within 3-5 business days.
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* Refund Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Refund Information</h2>
            <div className="space-y-4">
              
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">Refund Methods</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Refunds are issued to the original payment method</li>
                  <li>• Credit card refunds may take 3-10 business days to appear</li>
                  <li>• PayPal refunds typically process within 1-3 business days</li>
                  <li>• Bank transfers may take 5-7 business days</li>
                </ul>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="font-medium text-yellow-800 mb-2">Refund Amounts</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Full product price for eligible returns</li>
                  <li>• Original shipping costs (if item was defective)</li>
                  <li>• Return shipping costs may be deducted</li>
                  <li>• Processing fees are non-refundable</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Exchanges */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Exchanges</h2>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-purple-700 mb-4">
                We currently process exchanges as a return followed by a new purchase. This ensures 
                you get the current pricing and availability for your desired item.
              </p>
              <div className="space-y-2">
                <h3 className="font-medium text-purple-800">Exchange Process:</h3>
                <ol className="list-decimal pl-6 text-sm text-purple-700 space-y-1">
                  <li>Initiate a return for the original item</li>
                  <li>Place a new order for the desired item</li>
                  <li>Once the return is processed, you'll receive a refund</li>
                  <li>Your new order will be shipped according to normal processing times</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Damaged/Defective Items */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Damaged or Defective Items</h2>
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <h3 className="font-medium text-red-800 mb-2">Report Issues Immediately</h3>
              <p className="text-red-700 text-sm mb-3">
                If you receive a damaged or defective item, please contact us within 48 hours of delivery.
              </p>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Take photos of the damage or defect</li>
                <li>• Keep all original packaging</li>
                <li>• Contact customer service with your order number</li>
                <li>• We'll arrange a replacement or full refund</li>
              </ul>
            </div>
          </section>

          {/* International Returns */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. International Returns</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2">Special Considerations</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Extended return window (45 days)</li>
                  <li>• Customer responsible for return shipping</li>
                  <li>• Customs fees are non-refundable</li>
                  <li>• Additional processing time may apply</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2">Required Documentation</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Customs declaration form</li>
                  <li>• Original purchase receipt</li>
                  <li>• Return authorization number</li>
                  <li>• Proof of return shipping</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Need Help?</h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                Our customer service team is here to help with your return or refund questions:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-blue-800 mb-2">Contact Information</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li><strong>Email:</strong> returns@universalwallpaper.com</li>
                    <li><strong>Phone:</strong> +1 (555) 123-4567</li>
                    <li><strong>Hours:</strong> Mon-Fri 9AM-6PM EST</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-blue-800 mb-2">Return Address</h3>
                  <address className="text-sm text-blue-700 not-italic">
                    Universal Wallpaper Returns<br />
                    [Your Return Address]<br />
                    [City, State ZIP]<br />
                    [Country]
                  </address>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default ReturnRefundPolicy;