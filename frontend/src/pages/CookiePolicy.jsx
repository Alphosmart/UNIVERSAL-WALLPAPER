import React, { useState } from 'react';
import { FaCookie, FaCog, FaShieldAlt, FaChartBar, FaUsers, FaCheck } from 'react-icons/fa';

const CookiePolicy = () => {
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Always enabled
    analytics: false,
    marketing: false,
    personalization: false
  });

  const handlePreferenceChange = (type) => {
    if (type === 'necessary') return; // Cannot disable necessary cookies
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-100 rounded-full p-4">
              <FaCookie className="text-3xl text-orange-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="text-gray-600 mt-2">
            This policy explains how we use cookies and similar technologies.
          </p>
        </div>

        {/* Cookie Preferences Panel */}
        <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Manage Your Cookie Preferences</h2>
          <div className="grid md:grid-cols-2 gap-4">
            
            {/* Necessary Cookies */}
            <div className="bg-white rounded-lg p-4 border-2 border-green-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <FaShieldAlt className="text-green-600 mr-2" />
                  <h3 className="font-medium text-gray-800">Necessary Cookies</h3>
                </div>
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                  Always Active
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Essential for the website to function properly. Cannot be disabled.
              </p>
              <div className="flex items-center">
                <FaCheck className="text-green-600 mr-2" />
                <span className="text-sm text-gray-700">Required for security and functionality</span>
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <FaChartBar className="text-blue-600 mr-2" />
                  <h3 className="font-medium text-gray-800">Analytics Cookies</h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={cookiePreferences.analytics}
                    onChange={() => handlePreferenceChange('analytics')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <p className="text-sm text-gray-600">
                Help us understand how visitors interact with our website.
              </p>
            </div>

            {/* Marketing Cookies */}
            <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <FaUsers className="text-purple-600 mr-2" />
                  <h3 className="font-medium text-gray-800">Marketing Cookies</h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={cookiePreferences.marketing}
                    onChange={() => handlePreferenceChange('marketing')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
              <p className="text-sm text-gray-600">
                Used to deliver relevant advertisements and track campaign performance.
              </p>
            </div>

            {/* Personalization Cookies */}
            <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <FaCog className="text-orange-600 mr-2" />
                  <h3 className="font-medium text-gray-800">Personalization</h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={cookiePreferences.personalization}
                    onChange={() => handlePreferenceChange('personalization')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
              </div>
              <p className="text-sm text-gray-600">
                Remember your preferences and provide personalized content.
              </p>
            </div>

          </div>
          
          <div className="mt-6 text-center">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Save Preferences
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          
          {/* What Are Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. What Are Cookies?</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                Cookies are small text files that are stored on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and 
                understanding how you use our site.
              </p>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">Types of Information Cookies Store</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Login status and session information</li>
                  <li>• Shopping cart contents</li>
                  <li>• Language and region preferences</li>
                  <li>• Site navigation patterns</li>
                  <li>• Marketing campaign effectiveness</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Cookies</h2>
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* First Party Cookies */}
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <FaShieldAlt className="text-green-600 mr-2" />
                  <h3 className="font-medium text-green-800">First-Party Cookies</h3>
                </div>
                <p className="text-sm text-green-700 mb-3">
                  Set directly by our website for essential functionality.
                </p>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• User authentication</li>
                  <li>• Shopping cart management</li>
                  <li>• Security protection</li>
                  <li>• Site preferences</li>
                </ul>
              </div>

              {/* Third Party Cookies */}
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <FaUsers className="text-orange-600 mr-2" />
                  <h3 className="font-medium text-orange-800">Third-Party Cookies</h3>
                </div>
                <p className="text-sm text-orange-700 mb-3">
                  Set by external services we use to enhance functionality.
                </p>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Google Analytics</li>
                  <li>• Social media integrations</li>
                  <li>• Payment processors</li>
                  <li>• Advertising networks</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cookie Categories */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Cookie Categories</h2>
            <div className="space-y-6">
              
              {/* Necessary Cookies */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <FaShieldAlt className="text-green-600 mr-3" />
                  <h3 className="text-lg font-medium text-gray-800">Strictly Necessary Cookies</h3>
                  <span className="ml-auto bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                    Always Active
                  </span>
                </div>
                <p className="text-gray-700 mb-4">
                  These cookies are essential for the website to function and cannot be switched off. 
                  They are usually only set in response to actions made by you.
                </p>
                <div className="bg-gray-50 rounded p-3">
                  <h4 className="font-medium text-gray-800 mb-2">Examples include:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Session management and user authentication</li>
                    <li>• Security and fraud prevention</li>
                    <li>• Shopping cart functionality</li>
                    <li>• Form submission and error messages</li>
                    <li>• Load balancing and site performance</li>
                  </ul>
                </div>
              </div>

              {/* Performance Cookies */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <FaChartBar className="text-blue-600 mr-3" />
                  <h3 className="text-lg font-medium text-gray-800">Performance/Analytics Cookies</h3>
                  <span className="ml-auto bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                    Optional
                  </span>
                </div>
                <p className="text-gray-700 mb-4">
                  These cookies help us understand how visitors interact with our website by 
                  collecting and reporting information anonymously.
                </p>
                <div className="bg-gray-50 rounded p-3">
                  <h4 className="font-medium text-gray-800 mb-2">We collect data on:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Page views and user journeys</li>
                    <li>• Time spent on pages</li>
                    <li>• Bounce rates and exit pages</li>
                    <li>• Device and browser information</li>
                    <li>• Geographic location (country/region)</li>
                  </ul>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <FaCog className="text-purple-600 mr-3" />
                  <h3 className="text-lg font-medium text-gray-800">Functional/Personalization Cookies</h3>
                  <span className="ml-auto bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                    Optional
                  </span>
                </div>
                <p className="text-gray-700 mb-4">
                  These cookies enable enhanced functionality and personalization, such as 
                  remembering your preferences and providing personalized content.
                </p>
                <div className="bg-gray-50 rounded p-3">
                  <h4 className="font-medium text-gray-800 mb-2">Features enabled:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Language and currency preferences</li>
                    <li>• Recently viewed products</li>
                    <li>• Personalized recommendations</li>
                    <li>• Social media integrations</li>
                    <li>• Live chat functionality</li>
                  </ul>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <FaUsers className="text-orange-600 mr-3" />
                  <h3 className="text-lg font-medium text-gray-800">Marketing/Advertising Cookies</h3>
                  <span className="ml-auto bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">
                    Optional
                  </span>
                </div>
                <p className="text-gray-700 mb-4">
                  These cookies are used to deliver advertisements more relevant to you and 
                  your interests, and to measure the effectiveness of advertising campaigns.
                </p>
                <div className="bg-gray-50 rounded p-3">
                  <h4 className="font-medium text-gray-800 mb-2">Used for:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Targeted advertising</li>
                    <li>• Retargeting campaigns</li>
                    <li>• Social media advertising</li>
                    <li>• Conversion tracking</li>
                    <li>• Cross-device advertising</li>
                  </ul>
                </div>
              </div>

            </div>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Third-Party Services</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                We use various third-party services that may set their own cookies. Here are the main services we use:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium text-blue-800 mb-2">Google Services</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Google Analytics (analytics)</li>
                    <li>• Google Ads (advertising)</li>
                    <li>• Google Maps (location services)</li>
                    <li>• reCAPTCHA (security)</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-medium text-purple-800 mb-2">Social Media</h3>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Facebook Pixel (advertising)</li>
                    <li>• Instagram integration</li>
                    <li>• Twitter widgets</li>
                    <li>• Pinterest sharing</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-medium text-green-800 mb-2">Payment & Commerce</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Stripe (payment processing)</li>
                    <li>• PayPal (payment processing)</li>
                    <li>• Shipping integrations</li>
                    <li>• Tax calculation services</li>
                  </ul>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4">
                  <h3 className="font-medium text-orange-800 mb-2">Support & Communication</h3>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Live chat services</li>
                    <li>• Email marketing platforms</li>
                    <li>• Customer support tools</li>
                    <li>• Feedback collection</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Managing Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Managing Your Cookies</h2>
            <div className="space-y-6">
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <h3 className="font-medium text-yellow-800 mb-2">Browser Settings</h3>
                <p className="text-yellow-700 text-sm mb-3">
                  You can control cookies through your browser settings. However, disabling certain 
                  cookies may affect the functionality of our website.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-1">Popular Browsers:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Chrome: Settings {'->'} Privacy & Security {'->'} Cookies</li>
                      <li>• Firefox: Settings {'->'} Privacy & Security</li>
                      <li>• Safari: Preferences {'->'} Privacy</li>
                      <li>• Edge: Settings {'->'} Cookies and site permissions</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-1">Mobile Browsers:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• iOS Safari: Settings {'->'} Safari {'->'} Privacy & Security</li>
                      <li>• Android Chrome: Chrome menu {'->'} Settings {'->'} Privacy</li>
                      <li>• Check your browser's help section for specific instructions</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">Opt-Out Tools</h3>
                <p className="text-blue-700 text-sm mb-3">
                  You can opt out of certain types of tracking using these tools:
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Google Analytics Opt-out Browser Add-on</li>
                  <li>• NAI Consumer Opt-Out page</li>
                  <li>• DAA Consumer Choice page</li>
                  <li>• Your Online Choices (Europe)</li>
                </ul>
              </div>

            </div>
          </section>

          {/* Cookie Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookie Retention</h2>
            <div className="grid md:grid-cols-2 gap-4">
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2">Session Cookies</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Temporary cookies that are deleted when you close your browser.
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Shopping cart contents</li>
                  <li>• Login sessions</li>
                  <li>• Form data</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2">Persistent Cookies</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Stored on your device for a specific period (typically 1-24 months).
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• User preferences</li>
                  <li>• Analytics data</li>
                  <li>• Marketing tracking</li>
                </ul>
              </div>

            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Policy Updates</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our practices 
                or for other operational, legal, or regulatory reasons.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>How we notify you:</strong> Policy updates will be posted on this page with 
                  an updated "Last modified" date.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Your consent:</strong> Continued use of our website after policy updates 
                  constitutes acceptance of the changes.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Us</h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                If you have any questions about our use of cookies, please contact us:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-blue-800 mb-2">General Inquiries</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li><strong>Email:</strong> privacy@universalwallpaper.com</li>
                    <li><strong>Phone:</strong> +1 (555) 123-4567</li>
                    <li><strong>Hours:</strong> Mon-Fri 9AM-6PM EST</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-blue-800 mb-2">Mailing Address</h3>
                  <address className="text-sm text-blue-700 not-italic">
                    Universal Wallpaper Privacy Team<br />
                    [Your Business Address]<br />
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

export default CookiePolicy;