import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaBoxOpen, FaChartBar, FaCog, FaSignOutAlt } from 'react-icons/fa';

const AdminPanel = () => {
  const user = useSelector(state => state?.user?.user);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and is admin
    if (!user?._id) {
      navigate('/login');
      return;
    }
    
    if (user?.role !== 'ADMIN') {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  // Show loading or redirect if not admin
  if (!user?._id || user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
          <Link to="/" className="text-blue-600 hover:text-blue-800">Go to Homepage</Link>
        </div>
      </div>
    );
  }

  const adminMenuItems = [
    {
      label: 'All Products',
      path: '/admin-panel/all-products',
      icon: <FaBox />
    },
    {
      label: 'All Users',
      path: '/admin-panel/all-users',
      icon: <FaUsers />
    },
    {
      label: 'Analytics',
      path: '/admin-panel/analytics',
      icon: <FaChartBar />
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
