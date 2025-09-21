import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaEdit, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaDownload, FaCalendarAlt, FaUserCheck, FaUserTimes } from 'react-icons/fa';
import SummaryApi from '../common';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  
  // Advanced Filter States
  const [advancedFilters, setAdvancedFilters] = useState({
    dateRange: 'all', // all, today, week, month, year, custom
    location: 'all', // all, specific cities/states
    verificationStatus: 'all', // all, verified, unverified
    lastLogin: 'all', // all, active, inactive
    sellerStatus: 'all', // all, sellers, non-sellers
    customStartDate: '',
    customEndDate: ''
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [exportFormat, setExportFormat] = useState('csv');

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.adminAllUsers.url, {
        method: SummaryApi.adminAllUsers.method,
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data || []);
      } else {
        toast.error(data.message || 'Failed to fetch users');
        // For now, use mock data since endpoint doesn't exist yet
        setUsers([
          {
            _id: '1',
            name: 'Adebayo Okafor',
            email: 'adebayo@example.com',
            role: 'GENERAL',
            phone: '+2348012345678',
            address: { city: 'Lagos', state: 'Lagos', country: 'Nigeria' },
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
            emailVerified: true,
            sellerStatus: 'verified',
            lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
          },
          {
            _id: '2',
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'ADMIN',
            phone: '+2347098765432',
            address: { city: 'Abuja', state: 'FCT Abuja', country: 'Nigeria' },
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
            emailVerified: true,
            sellerStatus: 'none',
            lastLogin: new Date().toISOString() // today
          },
          {
            _id: '3',
            name: 'Amina Hassan',
            email: 'amina@example.com',
            role: 'GENERAL',
            phone: '+2348123456789',
            address: { city: 'Kano', state: 'Kano', country: 'Nigeria' },
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
            emailVerified: false,
            sellerStatus: 'pending_verification',
            lastLogin: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
          },
          {
            _id: '4',
            name: 'Kwame Asante',
            email: 'kwame@example.com',
            role: 'GENERAL',
            phone: '+233201234567',
            address: { city: 'Accra', state: 'Greater Accra', country: 'Ghana' },
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            emailVerified: true,
            sellerStatus: 'none',
            lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
          },
          {
            _id: '5',
            name: 'Fatima Al-Rashid',
            email: 'fatima@example.com',
            role: 'GENERAL',
            phone: '+201234567890',
            address: { city: 'Cairo', state: 'Cairo', country: 'Egypt' },
            createdAt: new Date().toISOString(), // today
            emailVerified: false,
            sellerStatus: 'rejected',
            lastLogin: new Date().toISOString() // today
          },
          {
            _id: '6',
            name: 'John Mwangi',
            email: 'john@example.com',
            role: 'GENERAL',
            phone: '+254712345678',
            address: { city: 'Nairobi', state: 'Nairobi', country: 'Kenya' },
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
            emailVerified: true,
            sellerStatus: 'verified',
            lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
          },
          {
            _id: '7',
            name: 'Thandiwe Mbeki',
            email: 'thandiwe@example.com',
            role: 'GENERAL',
            phone: '+27821234567',
            address: { city: 'Johannesburg', state: 'Gauteng', country: 'South Africa' },
            createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
            emailVerified: true,
            sellerStatus: 'pending_verification',
            lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
          },
          {
            _id: '8',
            name: 'Youssef Ben Ali',
            email: 'youssef@example.com',
            role: 'GENERAL',
            phone: '+212612345678',
            address: { city: 'Casablanca', state: 'Casablanca-Settat', country: 'Morocco' },
            createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
            emailVerified: true,
            sellerStatus: 'none',
            lastLogin: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() // 4 days ago
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error fetching users');
      // Mock data for demonstration
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(`${SummaryApi.adminUpdateUserRole.url}/${userId}`, {
        method: SummaryApi.adminUpdateUserRole.method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ role: newRole })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('User role updated successfully');
        fetchAllUsers(); // Refresh the list
      } else {
        toast.error(data.message || 'Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Error updating user role');
    }
  };

  // Export functionality
  const exportUsers = () => {
    const dataToExport = filteredUsers.map(user => ({
      Name: user.name,
      Email: user.email,
      Role: user.role,
      Phone: user.phone || 'N/A',
      City: user.address?.city || 'N/A',
      State: user.address?.state || 'N/A',
      Country: user.address?.country || 'N/A',
      'Joined Date': new Date(user.createdAt).toLocaleDateString(),
      'Verification Status': user.emailVerified ? 'Verified' : 'Unverified',
      'Seller Status': user.sellerStatus || 'None',
      'Last Login': user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'
    }));

    if (exportFormat === 'csv') {
      const csvContent = [
        Object.keys(dataToExport[0] || {}).join(','),
        ...dataToExport.map(row => Object.values(row).map(value => 
          typeof value === 'string' && value.includes(',') ? `"${value}"` : value
        ).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Users exported to CSV successfully!');
    } else if (exportFormat === 'json') {
      const jsonContent = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users_export_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Users exported to JSON successfully!');
    }
  };

  // Advanced filtering function
  const getFilteredUsers = () => {
    return users.filter(user => {
      // Basic search filter
      const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.phone?.includes(searchTerm);
      
      // Role filter
      const matchesRole = selectedRole === '' || user.role === selectedRole;
      
      // Date range filter
      const userDate = new Date(user.createdAt);
      const now = new Date();
      let matchesDateRange = true;
      
      switch (advancedFilters.dateRange) {
        case 'today':
          matchesDateRange = userDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDateRange = userDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDateRange = userDate >= monthAgo;
          break;
        case 'year':
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          matchesDateRange = userDate >= yearAgo;
          break;
        case 'custom':
          if (advancedFilters.customStartDate && advancedFilters.customEndDate) {
            const startDate = new Date(advancedFilters.customStartDate);
            const endDate = new Date(advancedFilters.customEndDate);
            matchesDateRange = userDate >= startDate && userDate <= endDate;
          }
          break;
        default:
          matchesDateRange = true;
      }
      
      // Location filter
      const matchesLocation = advancedFilters.location === 'all' || 
                             user.address?.city?.toLowerCase().includes(advancedFilters.location.toLowerCase()) ||
                             user.address?.state?.toLowerCase().includes(advancedFilters.location.toLowerCase()) ||
                             user.address?.country?.toLowerCase().includes(advancedFilters.location.toLowerCase());
      
      // Verification status filter
      const matchesVerification = advancedFilters.verificationStatus === 'all' ||
                                 (advancedFilters.verificationStatus === 'verified' && user.emailVerified) ||
                                 (advancedFilters.verificationStatus === 'unverified' && !user.emailVerified);
      
      // Seller status filter
      const matchesSellerStatus = advancedFilters.sellerStatus === 'all' ||
                                 (advancedFilters.sellerStatus === 'sellers' && user.sellerStatus && user.sellerStatus !== 'none') ||
                                 (advancedFilters.sellerStatus === 'non-sellers' && (!user.sellerStatus || user.sellerStatus === 'none'));
      
      return matchesSearch && matchesRole && matchesDateRange && matchesLocation && matchesVerification && matchesSellerStatus;
    });
  };

  // Get sorted and filtered users
  const filteredUsers = getFilteredUsers().sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    // Handle date sorting
    if (sortBy === 'createdAt') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    // Handle string sorting
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-3xl font-bold text-gray-800">All Users</h1>
          <p className="text-gray-600">Manage and monitor your user base</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="bg-blue-100 px-4 py-2 rounded-lg">
            <span className="text-sm font-medium text-blue-800">
              Total Users: {users.length}
            </span>
          </div>
          <div className="bg-green-100 px-4 py-2 rounded-lg">
            <span className="text-sm font-medium text-green-800">
              Admins: {users.filter(u => u.role === 'ADMIN').length}
            </span>
          </div>
          <div className="bg-purple-100 px-4 py-2 rounded-lg">
            <span className="text-sm font-medium text-purple-800">
              Sellers: {users.filter(u => u.sellerStatus && u.sellerStatus !== 'none').length}
            </span>
          </div>
          <div className="bg-yellow-100 px-4 py-2 rounded-lg">
            <span className="text-sm font-medium text-yellow-800">
              Filtered: {filteredUsers.length}
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Filters Panel */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        {/* Basic Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaUser className="inline mr-1" />
              Search Users
            </label>
            <input
              type="text"
              placeholder="Name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role Filter
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Roles</option>
              <option value="GENERAL">General Users</option>
              <option value="ADMIN">Administrators</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="createdAt">Join Date</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="role">Role</option>
            </select>
          </div>

          <div className="flex items-end space-x-2">
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              Filters
            </button>
          </div>
        </div>

        {/* Advanced Filters (Collapsible) */}
        {showAdvancedFilters && (
          <div className="border-t pt-4 space-y-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Advanced Filters</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-1" />
                  Registration Date
                </label>
                <select
                  value={advancedFilters.dateRange}
                  onChange={(e) => setAdvancedFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="year">Last Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-1" />
                  Location
                </label>
                <select
                  value={advancedFilters.location}
                  onChange={(e) => setAdvancedFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Locations</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="delhi">Delhi</option>
                  <option value="bangalore">Bangalore</option>
                  <option value="pune">Pune</option>
                  <option value="chennai">Chennai</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUserCheck className="inline mr-1" />
                  Email Verification
                </label>
                <select
                  value={advancedFilters.verificationStatus}
                  onChange={(e) => setAdvancedFilters(prev => ({ ...prev, verificationStatus: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Users</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUserTimes className="inline mr-1" />
                  Seller Status
                </label>
                <select
                  value={advancedFilters.sellerStatus}
                  onChange={(e) => setAdvancedFilters(prev => ({ ...prev, sellerStatus: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Users</option>
                  <option value="sellers">Sellers Only</option>
                  <option value="non-sellers">Non-Sellers</option>
                </select>
              </div>
            </div>

            {/* Custom Date Range */}
            {advancedFilters.dateRange === 'custom' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={advancedFilters.customStartDate}
                    onChange={(e) => setAdvancedFilters(prev => ({ ...prev, customStartDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={advancedFilters.customEndDate}
                    onChange={(e) => setAdvancedFilters(prev => ({ ...prev, customEndDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedRole('');
                    setAdvancedFilters({
                      dateRange: 'all',
                      location: 'all',
                      verificationStatus: 'all',
                      lastLogin: 'all',
                      sellerStatus: 'all',
                      customStartDate: '',
                      customEndDate: ''
                    });
                    setSortBy('createdAt');
                    setSortOrder('desc');
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
                >
                  Clear All Filters
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </select>
                <button
                  onClick={exportUsers}
                  className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                >
                  <FaDownload className="mr-2" />
                  Export ({filteredUsers.length})
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role & Seller Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration & Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    {users.length === 0 ? 'No users found' : 'No users match your filters'}
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                              {user.name?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaEnvelope className="mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {user.phone && (
                          <div className="flex items-center text-sm text-gray-900">
                            <FaPhone className="mr-2 text-gray-400" />
                            {user.phone}
                          </div>
                        )}
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.emailVerified 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.emailVerified ? (
                              <>
                                <FaUserCheck className="mr-1" />
                                Verified
                              </>
                            ) : (
                              <>
                                <FaUserTimes className="mr-1" />
                                Unverified
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.address && (
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="mr-2 text-gray-400" />
                            <div>
                              <div className="font-medium">{user.address.city}</div>
                              <div className="text-gray-500">{user.address.state}</div>
                              <div className="text-xs text-gray-400">{user.address.country}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                        {user.sellerStatus && user.sellerStatus !== 'none' && (
                          <div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.sellerStatus === 'verified' ? 'bg-green-100 text-green-800' :
                              user.sellerStatus === 'pending_verification' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              Seller: {user.sellerStatus.replace('_', ' ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="space-y-1">
                        <div>
                          <span className="font-medium">Joined:</span>
                          <div className="text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        {user.lastLogin && (
                          <div>
                            <span className="font-medium">Last Active:</span>
                            <div className="text-gray-500">
                              {new Date(user.lastLogin).toLocaleDateString()}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900 flex items-center" 
                          title="View Profile"
                        >
                          <FaUser className="mr-1" />
                          View
                        </button>
                        <button 
                          className="text-green-600 hover:text-green-900 flex items-center" 
                          title="Edit User"
                        >
                          <FaEdit className="mr-1" />
                          Edit
                        </button>
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className="ml-2 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="GENERAL">General</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastUser, filteredUsers.length)}
                </span>{' '}
                of <span className="font-medium">{filteredUsers.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === i + 1
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
