import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaUsers, FaBoxOpen, FaShoppingCart, FaTrendingUp } from 'react-icons/fa';
import SummaryApi from '../common';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: { total: 0, admin: 0, general: 0, recent: 0 },
    products: { total: 0, active: 0, sold: 0, recent: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.adminDashboardStats.url, {
        method: SummaryApi.adminDashboardStats.method,
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch dashboard stats');
        // Mock data for demonstration
        setStats({
          users: { total: 125, admin: 5, general: 120, recent: 12 },
          products: { total: 450, active: 380, sold: 70, recent: 25 }
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Error fetching dashboard stats');
      // Mock data for demonstration
      setStats({
        users: { total: 125, admin: 5, general: 120, recent: 12 },
        products: { total: 450, active: 380, sold: 70, recent: 25 }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the admin dashboard. Here's an overview of your platform.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <FaUsers className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.users.total}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-600">
              <span className="text-green-600 font-medium">+{stats.users.recent}</span>
              <span className="ml-1">new this week</span>
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <FaBoxOpen className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.products.total}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-600">
              <span className="text-green-600 font-medium">+{stats.products.recent}</span>
              <span className="ml-1">added this week</span>
            </div>
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <FaShoppingCart className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Products</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.products.active}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-600">
              <span className="text-gray-500">{stats.products.sold} sold</span>
            </div>
          </div>
        </div>

        {/* Admin Users */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <FaTrendingUp className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Admin Users</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.users.admin}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-600">
              <span className="text-gray-500">{stats.users.general} general users</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">User Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">General Users</span>
              <span className="text-sm font-semibold text-gray-900">{stats.users.general}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(stats.users.general / stats.users.total) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Admin Users</span>
              <span className="text-sm font-semibold text-gray-900">{stats.users.admin}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full" 
                style={{ width: `${(stats.users.admin / stats.users.total) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Product Status */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Active Products</span>
              <span className="text-sm font-semibold text-gray-900">{stats.products.active}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${(stats.products.active / stats.products.total) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Sold Products</span>
              <span className="text-sm font-semibold text-gray-900">{stats.products.sold}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-600 h-2 rounded-full" 
                style={{ width: `${(stats.products.sold / stats.products.total) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <FaUsers className="mr-2" />
            View All Users
          </button>
          <button className="flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
            <FaBoxOpen className="mr-2" />
            View All Products
          </button>
          <button className="flex items-center justify-center px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
            <FaTrendingUp className="mr-2" />
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
