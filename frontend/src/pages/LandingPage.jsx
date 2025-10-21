import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { trackLandingPageInteraction, trackShopButtonClick, trackNewsletterSignup, trackUserEngagement } from '../utils/analytics';
import { 
  FaPlay, 
  FaStar, 
  FaShieldAlt, 
  FaTruck, 
  FaHeadset, 
  FaUsers, 
  FaAward,
  FaQuoteLeft,
  FaArrowRight,
  FaCheck,
  FaHeart,
  FaPalette,
  FaHome,
  FaBrush,
  FaRuler
} from 'react-icons/fa';

const LandingPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      trackNewsletterSignup('landing_page');
      // Here you would typically send the email to your backend
      console.log('Newsletter signup:', email);
      setEmail('');
      alert('Thank you for subscribing!');
    }
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Interior Designer",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b788?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "Universal Wallpaper has transformed my design business. The quality and variety are unmatched, and my clients are always thrilled with the results."
    },
    {
      name: "Michael Chen",
      role: "Homeowner",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "I renovated my entire home using products from this platform. The customer service was exceptional and the shipping was incredibly fast."
    },
    {
      name: "Emma Rodriguez",
      role: "Business Owner",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "As a seller on this platform, I've been able to reach customers worldwide. The tools and support provided are fantastic."
    }
  ];

  const services = [
    {
      icon: FaPalette,
      title: "Design Consultation",
      description: "Professional interior design advice from certified experts to help you choose the perfect products for your space."
    },
    {
      icon: FaRuler,
      title: "Custom Measurements",
      description: "Precise measurement services to ensure your wallpaper and materials fit perfectly in your space."
    },
    {
      icon: FaBrush,
      title: "Professional Installation",
      description: "Expert installation services by trained professionals to ensure flawless results."
    },
    {
      icon: FaHeadset,
      title: "24/7 Support",
      description: "Round-the-clock customer support to assist you throughout your design journey."
    }
  ];

  const featuredProducts = {
    wallpapers: [
      {
        id: 1,
        name: "Luxury Floral Pattern",
        price: "$45.99",
        originalPrice: "$65.99",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
        rating: 4.8,
        reviews: 127
      },
      {
        id: 2,
        name: "Modern Geometric Design",
        price: "$38.50",
        originalPrice: "$52.00",
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=300&h=300&fit=crop",
        rating: 4.9,
        reviews: 203
      },
      {
        id: 3,
        name: "Vintage Botanical Print",
        price: "$42.75",
        originalPrice: "$58.99",
        image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=300&fit=crop",
        rating: 4.7,
        reviews: 89
      }
    ],
    paints: [
      {
        id: 4,
        name: "Premium Matte Finish",
        price: "$32.99",
        originalPrice: "$45.99",
        image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=300&h=300&fit=crop",
        rating: 4.6,
        reviews: 156
      },
      {
        id: 5,
        name: "Eco-Friendly Paint",
        price: "$28.50",
        originalPrice: "$39.99",
        image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop",
        rating: 4.8,
        reviews: 94
      }
    ],
    decor: [
      {
        id: 6,
        name: "Wall Art Canvas Set",
        price: "$89.99",
        originalPrice: "$129.99",
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=300&h=300&fit=crop",
        rating: 4.9,
        reviews: 78
      },
      {
        id: 7,
        name: "Decorative Mirror",
        price: "$125.00",
        originalPrice: "$175.00",
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop",
        rating: 4.7,
        reviews: 112
      }
    ]
  };

  const stats = [
    { number: "50K+", label: "Happy Customers", icon: FaUsers },
    { number: "15K+", label: "Products Available", icon: FaHome },
    { number: "500+", label: "Trusted Sellers", icon: FaAward },
    { number: "99.9%", label: "Customer Satisfaction", icon: FaHeart }
  ];

  return (
    <div className="min-h-screen">
      {/* Floating Shop Button */}
      <Link 
        to="/search" 
        onClick={() => trackShopButtonClick('floating_button', '/search')}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 z-50 flex items-center gap-2"
      >
        🛒 Shop Now
      </Link>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Transform Your Space with 
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  {" "}Premium Wallpapers
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-100 leading-relaxed">
                Discover thousands of high-quality wallpapers, paints, and décor items from trusted sellers worldwide. 
                Professional installation and design consultation included.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/search" 
                  onClick={() => trackShopButtonClick('hero_section', '/search')}
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                >
                  🛍️ Shop Now <FaArrowRight />
                </Link>
                <button 
                  onClick={() => trackLandingPageInteraction('watch_demo', 'hero_section')}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all flex items-center justify-center gap-2"
                >
                  <FaPlay /> Watch Demo
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-green-300" />
                  <span className="text-sm">SSL Secured</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaTruck className="text-blue-300" />
                  <span className="text-sm">Fast Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaAward className="text-yellow-300" />
                  <span className="text-sm">Award Winning</span>
                </div>
              </div>
            </div>

            {/* Hero Image/Video */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <img 
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop" 
                  alt="Beautiful wallpaper interior" 
                  className="rounded-xl w-full h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <stat.icon className="text-2xl text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked collection of premium wallpapers, paints, and décor items
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              {[
                { key: 'wallpapers', label: 'Wallpapers' },
                { key: 'paints', label: 'Paints' },
                { key: 'decor', label: 'Home Décor' }
              ].map((category) => (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`px-6 py-3 rounded-md font-medium transition-all ${
                    selectedCategory === category.key
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts[selectedCategory]?.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all transform hover:-translate-y-2">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={`text-sm ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-blue-600">{product.price}</span>
                      <span className="text-gray-500 line-through">{product.originalPrice}</span>
                    </div>
                    <Link 
                      to="/search" 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 font-medium"
                    >
                      🛒 Shop
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/search" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-5 rounded-xl font-bold text-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 inline-flex items-center gap-3 shadow-2xl"
            >
              🛍️ Explore All Products <FaArrowRight />
            </Link>
            <p className="text-gray-600 mt-4 text-lg">
              Over 15,000+ premium products waiting for you!
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Premium Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We don't just sell products – we provide end-to-end solutions for your interior design needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <service.icon className="text-2xl text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>
                <Link 
                  to="/search" 
                  className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                >
                  Shop Now <FaArrowRight className="text-sm" />
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/search" 
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all transform hover:scale-105 inline-flex items-center gap-2"
            >
              🛒 Start Shopping with Professional Support
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-8">Why Choose Universal Wallpaper?</h2>
              
              <div className="space-y-6">
                {[
                  "Premium quality products from verified sellers worldwide",
                  "Professional installation and design consultation services",
                  "30-day money-back guarantee on all purchases",
                  "Fast and reliable shipping nationwide",
                  "24/7 customer support from design experts",
                  "Secure payment processing with buyer protection"
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                      <FaCheck className="text-green-600" />
                    </div>
                    <p className="text-gray-700 text-lg">{feature}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link 
                  to="/about-us" 
                  className="text-blue-600 font-semibold text-lg hover:text-blue-700 inline-flex items-center gap-2"
                >
                  Learn More About Us <FaArrowRight />
                </Link>
              </div>
            </div>

            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=500&fit=crop" 
                alt="Beautiful interior design" 
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-8 -left-8 bg-white rounded-xl p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <FaAward className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">Award Winning</div>
                    <div className="text-gray-600 text-sm">Design Excellence 2025</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied customers who have transformed their spaces
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg relative">
                <FaQuoteLeft className="text-blue-200 text-3xl mb-4" />
                
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.text}"</p>
                
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-800">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Stay Updated with Latest Trends</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get exclusive access to new products, design tips, and special offers delivered to your inbox
          </p>
          
          <div className="max-w-md mx-auto">
            <form onSubmit={handleNewsletterSubmit} className="flex gap-4">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              <button 
                type="submit"
                className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
              >
                Subscribe
              </button>
            </form>
            <p className="text-sm mt-4 opacity-80">
              No spam, unsubscribe at any time. Your privacy is protected.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Ready to Transform Your Space?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers and start your interior design journey today
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/search" 
              onClick={() => trackShopButtonClick('final_cta', '/search')}
              className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-10 py-5 rounded-xl font-bold text-xl hover:from-green-600 hover:to-blue-700 transition-all transform hover:scale-105 inline-flex items-center gap-3 shadow-2xl"
            >
              🛍️ Start Shopping Now <FaArrowRight />
            </Link>
            <Link 
              to="/contact-us" 
              onClick={() => trackLandingPageInteraction('get_consultation', 'final_cta')}
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-600 hover:text-white transition-colors"
            >
              Get Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;