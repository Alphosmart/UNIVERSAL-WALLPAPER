import React from 'react';
import { FaShieldAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 rounded-full p-4">
              <FaShieldAlt className="text-3xl text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="text-gray-600 mt-2">
            We are committed to protecting your privacy and ensuring the security of your personal information.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Universal Wallpaper ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. 
              This privacy policy explains how we collect, use, and safeguard your information when you visit our website 
              or use our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Personal Information</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Name, email address, phone number</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment information (processed securely through our payment providers)</li>
                  <li>Account credentials and preferences</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Usage Information</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Browsing behavior and purchase history</li>
                  <li>Device information and IP address</li>
                  <li>Cookies and tracking technologies</li>
                  <li>Customer service interactions</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Process orders and manage your account</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Send order confirmations and shipping updates</li>
              <li>Improve our website and personalize your experience</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Comply with legal obligations and prevent fraud</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <p className="text-yellow-800">
                <strong>We do not sell your personal information to third parties.</strong>
              </p>
            </div>
            <p className="text-gray-700 mb-4">We may share your information with:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Service providers who help us operate our business</li>
              <li>Shipping companies for order fulfillment</li>
              <li>Payment processors for transaction processing</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-medium text-green-800 mb-2">Security Measures</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>SSL encryption for data transmission</li>
                  <li>Secure servers and databases</li>
                  <li>Regular security audits</li>
                  <li>Access controls and monitoring</li>
                </ul>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">Your Responsibilities</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>Keep your account credentials secure</li>
                  <li>Use strong passwords</li>
                  <li>Log out of shared devices</li>
                  <li>Report suspicious activity</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-800">Access & Control</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• View your personal data</li>
                  <li>• Update your information</li>
                  <li>• Delete your account</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-gray-800">Marketing Preferences</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Unsubscribe from emails</li>
                  <li>• Opt out of marketing</li>
                  <li>• Manage cookie preferences</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies & Tracking</h2>
            <p className="text-gray-700 mb-4">
              We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, 
              and personalize content. You can manage your cookie preferences through your browser settings.
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">Types of Cookies We Use:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li><strong>Essential:</strong> Required for website functionality</li>
                <li><strong>Performance:</strong> Help us analyze website usage</li>
                <li><strong>Functional:</strong> Remember your preferences</li>
                <li><strong>Marketing:</strong> Deliver relevant advertisements</li>
              </ul>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Us</h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                If you have questions about this privacy policy or your personal data, please contact us:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-blue-600" />
                  <span className="text-gray-700">privacy@universalwallpaper.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaPhoneAlt className="text-blue-600" />
                  <span className="text-gray-700">+1 (555) 123-4567</span>
                </div>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Policy Updates</h2>
            <p className="text-gray-700">
              We may update this privacy policy periodically. When we make changes, we will notify you by 
              updating the "Last updated" date and, for significant changes, we may provide additional notice 
              through our website or email.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;