import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Link } from 'react-router-dom';
import { FaHome, FaUsers, FaBoxOpen, FaChartBar, FaCog, FaImage, FaEnvelope, FaUserCog, FaTags } from 'react-icons/fa';
// FaShippingFast removed - single company model

const AdminPanel = () => {
  const user = useSelector(state => state?.user?.user);

  // AdminRoute already handles authentication, so we can render directly

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
      label: 'Category Management',
      path: '/admin-panel/categories',
      icon: <FaTags />
    },
    {
      label: 'All Users',
      path: '/admin-panel/all-users',
      icon: <FaUsers />
    },
    {
      label: 'Staff Management',
      path: '/admin-panel/staff-management',
      icon: <FaUserCog />
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
    // {
    //   label: 'Seller Applications',
    //   path: '/admin-panel/seller-applications',
    //   icon: <FaUserCheck />
    // },
    // Shipping Companies removed - single company model
    // {
    //   label: 'Shipping Companies',
    //   path: '/admin-panel/shipping-companies',
    //   icon: <FaShippingFast />
    // },
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
    // Shipping Settings removed - single company model
    // {
    //   label: 'Shipping Settings',
    //   path: '/admin-panel/shipping-settings',
    //   icon: <FaShippingFast />
    // },
    {
      label: 'Email Templates',
      path: '/admin-panel/email-templates',
      icon: <FaEnvelope />
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
