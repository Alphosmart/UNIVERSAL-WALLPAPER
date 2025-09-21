import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaPinterest, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaCreditCard,
  FaShieldAlt,
  FaTruck
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-white'>
      {/* Main Footer Content */}
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          
          {/* Company Information */}
          <div className='space-y-4'>
            <div className='flex items-center space-x-2'>
              <div className='bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg'>
                <FaTruck className='text-white text-xl' />
              </div>
              <h3 className='text-xl font-bold'>Universal Wallpaper</h3>
            </div>
            <p className='text-gray-300 text-sm leading-relaxed'>
              Your premier destination for high-quality wallpapers and home décor solutions. 
              Transform your space with our extensive collection from trusted sellers worldwide.
            </p>
            <div className='space-y-2'>
              <div className='flex items-center space-x-3 text-gray-300'>
                <FaMapMarkerAlt className='text-blue-400 flex-shrink-0' />
                <span className='text-sm'>123 Design Street, Creative District, NY 10001</span>
              </div>
              <div className='flex items-center space-x-3 text-gray-300'>
                <FaPhone className='text-green-400 flex-shrink-0' />
                <span className='text-sm'>+1 (555) 123-4567</span>
              </div>
              <div className='flex items-center space-x-3 text-gray-300'>
                <FaEnvelope className='text-purple-400 flex-shrink-0' />
                <span className='text-sm'>info@universalwallpaper.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className='space-y-4'>
            <h4 className='text-lg font-semibold border-b border-gray-700 pb-2'>Quick Links</h4>
            <ul className='space-y-2'>
              <li>
                <Link to="/" className='text-gray-300 hover:text-blue-400 transition-colors text-sm'>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search" className='text-gray-300 hover:text-blue-400 transition-colors text-sm'>
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about-us" className='text-gray-300 hover:text-blue-400 transition-colors text-sm'>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/search" className='text-gray-300 hover:text-blue-400 transition-colors text-sm'>
                  Browse Products
                </Link>
              </li>
              <li>
                <Link to="/how-to-order" className='text-gray-300 hover:text-blue-400 transition-colors text-sm'>
                  How to Order
                </Link>
              </li>
              <li>
                <Link to="/track-order" className='text-gray-300 hover:text-blue-400 transition-colors text-sm'>
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/help-center" className='text-gray-300 hover:text-blue-400 transition-colors text-sm'>
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className='text-gray-300 hover:text-blue-400 transition-colors text-sm'>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className='space-y-4'>
            <h4 className='text-lg font-semibold border-b border-gray-700 pb-2'>Customer Service</h4>
            <ul className='space-y-2'>
              <li>
                <Link to="/payment-options" className='text-gray-300 hover:text-blue-400 transition-colors text-sm'>
                  Payment Options
                </Link>
              </li>
              <li>
                <Link to="/return-refund-policy" className='text-gray-300 hover:text-blue-400 transition-colors text-sm'>
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/cancel-order" className='text-gray-300 hover:text-blue-400 transition-colors text-sm'>
                  Cancel Order
                </Link>
              </li>
              <li>
                <a href="mailto:support@universalwallpaper.com" className='text-gray-300 hover:text-blue-400 transition-colors text-sm'>
                  Support Email
                </a>
              </li>
              <li>
                <span className='text-gray-300 text-sm'>
                  Support Hours: Mon-Fri 9AM-6PM EST
                </span>
              </li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div className='space-y-4'>
            <h4 className='text-lg font-semibold border-b border-gray-700 pb-2'>Legal & Social</h4>
            <ul className='space-y-2'>
              <li>
                <Link to="/privacy-policy" className='text-gray-300 hover:text-blue-400 transition-colors text-sm'>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className='text-gray-300 hover:text-blue-400 transition-colors text-sm'>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className='text-gray-300 hover:text-blue-400 transition-colors text-sm'>
                  Cookie Policy
                </Link>
              </li>
            </ul>
            
            {/* Social Media Links */}
            <div className='pt-4'>
              <h5 className='text-sm font-medium text-gray-400 mb-3'>Follow Us</h5>
              <div className='flex space-x-3'>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                   className='bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition-colors'>
                  <FaFacebook className='text-white' />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                   className='bg-pink-600 hover:bg-pink-700 p-2 rounded-lg transition-colors'>
                  <FaInstagram className='text-white' />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                   className='bg-blue-400 hover:bg-blue-500 p-2 rounded-lg transition-colors'>
                  <FaTwitter className='text-white' />
                </a>
                <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer"
                   className='bg-red-600 hover:bg-red-700 p-2 rounded-lg transition-colors'>
                  <FaPinterest className='text-white' />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Trust Indicators */}
      <div className='border-t border-gray-800'>
        <div className='container mx-auto px-4 py-6'>
          <div className='flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0'>
            
            {/* Payment & Security Icons */}
            <div className='flex items-center space-x-6'>
              <div className='flex items-center space-x-2'>
                <FaCreditCard className='text-green-400 text-lg' />
                <span className='text-gray-400 text-sm'>Secure Payments</span>
              </div>
              <div className='flex items-center space-x-2'>
                <FaShieldAlt className='text-blue-400 text-lg' />
                <span className='text-gray-400 text-sm'>SSL Protected</span>
              </div>
              <div className='flex items-center space-x-2'>
                <FaTruck className='text-purple-400 text-lg' />
                <span className='text-gray-400 text-sm'>Fast Shipping</span>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className='flex items-center space-x-3'>
              <span className='text-gray-400 text-sm'>Stay updated:</span>
              <div className='flex'>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className='bg-gray-800 border border-gray-600 rounded-l-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500'
                />
                <button className='bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg text-sm font-medium transition-colors'>
                  Subscribe
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className='border-t border-gray-800 bg-gray-950'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex flex-col md:flex-row items-center justify-between text-center md:text-left'>
            <p className='text-gray-400 text-sm'>
              © {new Date().getFullYear()} Universal Wallpaper. All rights reserved.
            </p>
            <div className='mt-2 md:mt-0'>
              <p className='text-gray-500 text-xs'>
                Developed with ❤️ by{' '}
                <span className='text-blue-400 font-medium' title="YouTube Channel">
                  Dynamic Coding with Alphonsus
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;