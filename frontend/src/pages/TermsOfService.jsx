import React from 'react';
import { FaGavel, FaShoppingCart, FaExclamationTriangle, FaHandshake } from 'react-icons/fa';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 rounded-full p-4">
              <FaGavel className="text-3xl text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="text-gray-600 mt-2">
            Please read these terms carefully before using our services.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          
          {/* Acceptance */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <p className="text-yellow-800">
                <strong>By accessing and using Universal Wallpaper, you agree to be bound by these Terms of Service.</strong>
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed">
              These Terms of Service ("Terms") govern your use of the Universal Wallpaper website and services. 
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          {/* Account Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Account Registration</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">Account Requirements</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• You must be 18 years or older</li>
                  <li>• Provide accurate and complete information</li>
                  <li>• Maintain the security of your account</li>
                  <li>• One account per person or business</li>
                </ul>
              </div>
              <p className="text-gray-700">
                You are responsible for all activities that occur under your account. You must immediately notify us 
                of any unauthorized use of your account or any other breach of security.
              </p>
            </div>
          </section>

          {/* User Types */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Categories</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <FaShoppingCart className="text-green-600 text-xl mb-2" />
                <h3 className="font-medium text-green-800 mb-2">Buyers</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Browse and purchase products</li>
                  <li>• Leave reviews and ratings</li>
                  <li>• Track orders</li>
                </ul>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <FaHandshake className="text-purple-600 text-xl mb-2" />
                <h3 className="font-medium text-purple-800 mb-2">Sellers</h3>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• List products for sale</li>
                  <li>• Manage inventory</li>
                  <li>• Process orders</li>
                </ul>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <FaExclamationTriangle className="text-orange-600 text-xl mb-2" />
                <h3 className="font-medium text-orange-800 mb-2">Admins</h3>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Platform management</li>
                  <li>• User moderation</li>
                  <li>• System oversight</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Seller Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Seller Obligations</h2>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">Product Listings</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide accurate product descriptions and images</li>
                <li>Set fair and competitive pricing</li>
                <li>Maintain adequate inventory levels</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
              
              <h3 className="text-lg font-medium text-gray-800">Order Fulfillment</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Process orders within specified timeframes</li>
                <li>Provide tracking information when available</li>
                <li>Handle customer service inquiries professionally</li>
                <li>Honor return and refund policies</li>
              </ul>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Prohibited Activities</h2>
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <h3 className="font-medium text-red-800 mb-2">The following activities are strictly prohibited:</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">General Prohibitions</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Fraudulent or illegal activities</li>
                  <li>• Harassment or abuse of other users</li>
                  <li>• Spamming or unsolicited communications</li>
                  <li>• Violating intellectual property rights</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Selling Restrictions</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Counterfeit or stolen goods</li>
                  <li>• Dangerous or regulated items</li>
                  <li>• False or misleading listings</li>
                  <li>• Price manipulation or fixing</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Payment Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Payment and Fees</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2">For Buyers</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Payment is due at the time of purchase</li>
                  <li>• We accept major credit cards and digital payments</li>
                  <li>• All prices include applicable taxes</li>
                  <li>• Currency conversion fees may apply</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2">For Sellers</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Commission fees apply to all sales</li>
                  <li>• Payment processing fees may be deducted</li>
                  <li>• Payouts are processed according to our schedule</li>
                  <li>• Minimum payout thresholds may apply</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              All content on Universal Wallpaper, including but not limited to text, graphics, logos, images, 
              and software, is the property of Universal Wallpaper or its content suppliers and is protected 
              by copyright and other intellectual property laws.
            </p>
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">Your Content</h3>
              <p className="text-sm text-blue-700">
                By uploading content to our platform, you grant us a non-exclusive, worldwide license to use, 
                display, and distribute your content in connection with our services.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-yellow-800 text-sm">
                <strong>IMPORTANT:</strong> Universal Wallpaper acts as a marketplace platform. We are not responsible 
                for the quality, safety, or legality of products listed by sellers, or the ability of sellers to 
                complete transactions.
              </p>
            </div>
            <p className="text-gray-700 mt-4">
              To the maximum extent permitted by law, Universal Wallpaper shall not be liable for any indirect, 
              incidental, special, or consequential damages arising out of or in connection with your use of our services.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Account Termination</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">By You</h3>
                <p className="text-sm text-gray-700">
                  You may terminate your account at any time by contacting our customer service team or 
                  using the account deletion option in your settings.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">By Us</h3>
                <p className="text-sm text-gray-700">
                  We may terminate or suspend your account immediately if you violate these Terms or 
                  engage in prohibited activities.
                </p>
              </div>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Governing Law</h2>
            <p className="text-gray-700">
              These Terms are governed by and construed in accordance with the laws of [Your Jurisdiction]. 
              Any disputes arising under these Terms will be subject to the exclusive jurisdiction of the 
              courts in [Your Jurisdiction].
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Information</h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>Email:</strong> legal@universalwallpaper.com
                </p>
                <p className="text-gray-700">
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
                <p className="text-gray-700">
                  <strong>Address:</strong> [Your Business Address]
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default TermsOfService;