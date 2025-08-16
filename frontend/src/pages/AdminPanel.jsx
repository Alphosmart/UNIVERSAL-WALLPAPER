import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUsers, FaBoxOpen, FaChartBar, FaCog, FaUserCheck, FaShippingFast, FaImage, FaEnvelope } from 'react-icons/fa';

const AdminPanel = () => {
  const user = useSelector(state => state?.user?.user);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    if (!user?._id) {
      console.log('No user logged in, redirecting to login');
      navigate('/login');
      return;
    }
    
    // Check if user has admin role
    if (user?.role !== 'ADMIN') {
      console.log('User is not admin, redirecting to home');
      navigate('/');
      return;
    }
  }, [user, navigate]);

  // Show debug info if user is logged in but not admin
  if (user?._id && user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center bg-red-50 p-8 rounded-lg border border-red-200 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Access Required</h2>
            <p className="text-gray-600 mb-4">You are logged in as: <strong>{user.name}</strong></p>
            <p className="text-gray-600 mb-4">Email: <strong>{user.email}</strong></p>
            <p className="text-gray-600 mb-4">Current Role: <strong>{user.role || 'GENERAL'}</strong></p>
            <p className="text-red-600 mb-4">This area requires ADMIN privileges</p>
            <div className="space-x-4 mb-6">
              <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block">
                Go to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading or redirect if not logged in
  if (!user?._id) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center bg-blue-50 p-8 rounded-lg border border-blue-200 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
            <p className="text-gray-600 mb-4">You need to be logged in to access the admin panel.</p>
            <div className="space-x-4 mb-6">
              <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block">
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const adminMenuItems = [
    {
      label: 'Dashboard',
      path: '/admin-panel/dashboard',
      icon: <FaHome />
    },
    {
      label: 'All Products',
      path: '/admin-panel/all-products',
      icon: <FaBoxOpen />
    },
    {
      label: 'All Users',
      path: '/admin-panel/all-users',
      icon: <FaUsers />
    },
    {
      label: 'Contact Messages',
      path: '/admin-panel/contact-messages',
      icon: <FaEnvelope />
    },
    {
      label: 'Banner Management',
      path: '/admin-panel/banners',
      icon: <FaImage />
    },
    {
      label: 'Seller Applications',
      path: '/admin-panel/seller-applications',
      icon: <FaUserCheck />
    },
    {
      label: 'Analytics',
      path: '/admin-panel/analytics',
      icon: <FaChartBar />
    },
    {
      label: 'Site Content',
      path: '/admin-panel/site-content',
      icon: <FaCog />
    },
    {
      label: 'Shipping Settings',
      path: '/admin-panel/shipping-settings',
      icon: <FaShippingFast />
    },
    {
      label: 'Settings',
      path: '/admin-panel/settings',
      icon: <FaCog />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Panel</h1>
            <nav className="space-y-2">
              {adminMenuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
          
          {/* User Info */}
          <div className="absolute bottom-0 w-64 p-6 border-t bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-600">Admin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
