import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
        // Simple mock data
        setUsers([
          {
            _id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'GENERAL',
            createdAt: new Date().toISOString()
          },
          {
            _id: '2',
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'ADMIN',
            createdAt: new Date().toISOString()
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error fetching users');
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
        fetchAllUsers();
      } else {
        toast.error(data.message || 'Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Error updating user role');
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">All Users</h1>
        <div className="bg-blue-100 px-4 py-2 rounded-lg">
          <span className="text-sm font-medium text-blue-800">
            Total Users: {users.length}
          </span>
        </div>
      </div>

      {/* Simple Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {user.name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
