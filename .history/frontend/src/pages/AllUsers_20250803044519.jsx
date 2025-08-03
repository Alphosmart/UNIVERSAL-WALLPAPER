import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaEdit, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFilter, FaDownload, FaCalendarAlt, FaUserCheck, FaUserTimes } from 'react-icons/fa';
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
            name: 'John Doe',
            email: 'john@example.com',
            role: 'GENERAL',
            phone: '+1234567890',
            address: { city: 'Mumbai', state: 'Maharashtra' },
            createdAt: new Date().toISOString()
          },
          {
            _id: '2',
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'ADMIN',
            phone: '+0987654321',
            address: { city: 'Delhi', state: 'Delhi' },
            createdAt: new Date().toISOString()
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
      'Joined Date': new Date(user.createdAt).toLocaleDateString(),
      'Verification Status': user.emailVerified ? 'Verified' : 'Unverified',
      'Seller Status': user.sellerStatus || 'None'
    }));

    if (exportFormat === 'csv') {
      const csvContent = [
        Object.keys(dataToExport[0] || {}).join(','),
        ...dataToExport.map(row => Object.values(row).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Users exported successfully!');
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
                             user.address?.state?.toLowerCase().includes(advancedFilters.location.toLowerCase());
      
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">All Users</h1>
        <div className="flex space-x-4">
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
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Users
            </label>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
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
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedRole('');
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
            >
              Clear Filters
            </button>
          </div>
        </div>
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
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.phone && (
                        <div className="flex items-center">
                          <FaPhone className="mr-2 text-gray-400" />
                          {user.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.address && (
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="mr-2 text-gray-400" />
                          {user.address.city}, {user.address.state}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          user.role === 'ADMIN'
                            ? 'bg-red-100 text-red-800 focus:ring-red-500'
                            : 'bg-green-100 text-green-800 focus:ring-green-500'
                        }`}
                      >
                        <option value="GENERAL">General</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString()}
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
