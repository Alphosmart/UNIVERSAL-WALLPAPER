import React from 'react';
import { FaUsers, FaGlobe, FaAward, FaShieldAlt, FaHeart, FaClock, FaTruck, FaHeadset } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About Universal Wallpaper</h1>
          <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto">
            Transforming spaces worldwide with premium wallpapers and interior decoration solutions 
            through our innovative e-commerce marketplace.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        
        {/* Our Story */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Founded with a vision to revolutionize the interior decoration industry, Universal Wallpaper 
                began as a passionate endeavor to connect homeowners, designers, and businesses with 
                premium quality wallpapers and décor solutions from trusted sellers worldwide.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                What started as a simple idea has evolved into a comprehensive marketplace platform 
                that serves thousands of customers globally, offering an extensive collection of 
                wallpapers, paints, decorative accessories, and professional installation services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Today, we continue to innovate and expand our offerings while maintaining our core 
                commitment to quality, customer satisfaction, and transforming spaces into beautiful, 
                personalized environments.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <FaUsers className="text-blue-600 text-2xl" />
                  </div>
                  <h3 className="font-semibold text-gray-800">10K+</h3>
                  <p className="text-gray-600 text-sm">Happy Customers</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <FaGlobe className="text-green-600 text-2xl" />
                  </div>
                  <h3 className="font-semibold text-gray-800">50+</h3>
                  <p className="text-gray-600 text-sm">Countries Served</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <FaAward className="text-purple-600 text-2xl" />
                  </div>
                  <h3 className="font-semibold text-gray-800">500+</h3>
                  <p className="text-gray-600 text-sm">Trusted Sellers</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <FaShieldAlt className="text-orange-600 text-2xl" />
                  </div>
                  <h3 className="font-semibold text-gray-800">99.9%</h3>
                  <p className="text-gray-600 text-sm">Secure Transactions</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              To democratize interior design by providing accessible, high-quality wallpapers and décor 
              solutions while supporting a global community of sellers and creators.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaHeart className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Quality First</h3>
              <p className="text-gray-600">
                We carefully curate our collection to ensure every product meets our high standards 
                for quality, durability, and aesthetic appeal.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Customer Centric</h3>
              <p className="text-gray-600">
                Our customers are at the heart of everything we do. We strive to provide exceptional 
                service and support throughout their shopping journey.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaGlobe className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Global Reach</h3>
              <p className="text-gray-600">
                We connect buyers and sellers across the globe, fostering international trade and 
                cultural exchange through beautiful interior designs.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Core Values</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-blue-600 text-3xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Trust & Security</h3>
              <p className="text-gray-600 text-sm">
                We prioritize secure transactions and protect customer data with industry-leading security measures.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <FaClock className="text-green-600 text-3xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Reliability</h3>
              <p className="text-gray-600 text-sm">
                Consistent quality, on-time delivery, and dependable customer service you can count on.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <FaTruck className="text-purple-600 text-3xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Innovation</h3>
              <p className="text-gray-600 text-sm">
                Continuously improving our platform and services to enhance the customer experience.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <FaHeadset className="text-orange-600 text-3xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Support</h3>
              <p className="text-gray-600 text-sm">
                Dedicated customer support team available to help with any questions or concerns.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Why Choose Universal Wallpaper?</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 rounded-lg p-2 flex-shrink-0">
                    <FaAward className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Premium Quality Products</h3>
                    <p className="text-gray-600 text-sm">
                      Carefully selected wallpapers and décor items from verified sellers worldwide.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 rounded-lg p-2 flex-shrink-0">
                    <FaShieldAlt className="text-green-600 text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Secure Shopping</h3>
                    <p className="text-gray-600 text-sm">
                      SSL encryption, secure payment processing, and buyer protection policies.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 rounded-lg p-2 flex-shrink-0">
                    <FaTruck className="text-purple-600 text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Fast & Reliable Shipping</h3>
                    <p className="text-gray-600 text-sm">
                      Quick processing and delivery with real-time tracking and shipping updates.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 rounded-lg p-2 flex-shrink-0">
                    <FaHeadset className="text-orange-600 text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">24/7 Customer Support</h3>
                    <p className="text-gray-600 text-sm">
                      Dedicated support team available around the clock to assist with your needs.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 rounded-lg p-2 flex-shrink-0">
                    <FaHeart className="text-red-600 text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Easy Returns</h3>
                    <p className="text-gray-600 text-sm">
                      Hassle-free return policy with full refunds for eligible items within 30 days.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-100 rounded-lg p-2 flex-shrink-0">
                    <FaGlobe className="text-yellow-600 text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Global Marketplace</h3>
                    <p className="text-gray-600 text-sm">
                      Access to unique designs and products from sellers across the world.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Leadership Team</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaUsers className="text-white text-4xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Executive Team</h3>
              <p className="text-gray-600 mb-3">Experienced leaders driving innovation</p>
              <p className="text-gray-500 text-sm">
                Our executive team brings decades of experience in e-commerce, interior design, 
                and international trade to guide our strategic vision.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaHeadset className="text-white text-4xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Customer Success</h3>
              <p className="text-gray-600 mb-3">Dedicated to your satisfaction</p>
              <p className="text-gray-500 text-sm">
                Our customer success team works tirelessly to ensure every interaction 
                with Universal Wallpaper exceeds your expectations.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaClock className="text-white text-4xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Operations</h3>
              <p className="text-gray-600 mb-3">Ensuring seamless experiences</p>
              <p className="text-gray-500 text-sm">
                Our operations team manages logistics, quality control, and platform 
                maintenance to deliver reliable service every day.
              </p>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl text-white p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Space?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of satisfied customers who have discovered the perfect wallpapers 
              and décor solutions through our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/" 
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Start Shopping
              </a>
              <a 
                href="/contact-us" 
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutUs;