import React, { useState, useEffect } from 'react';
import { FaUserCog, FaUsers, FaChartBar } from 'react-icons/fa';
import SummaryApi from '../common/index';

const StaffManagement = () => {
    const [activeTab, setActiveTab] = useState('all-staff');
    const [staff, setStaff] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [uploadStats, setUploadStats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [permissions, setPermissions] = useState({
        canUploadProducts: false,
        canEditProducts: false,
        canDeleteProducts: false,
        canManageOrders: false
    });

    useEffect(() => {
        if (activeTab === 'all-staff') {
            fetchAllStaff();
        } else if (activeTab === 'all-users') {
            fetchAllUsers();
        } else if (activeTab === 'upload-stats') {
            fetchUploadStats();
        }
    }, [activeTab]);

    const fetchAllStaff = async () => {
        setLoading(true);
        try {
            const response = await fetch(SummaryApi.getAllStaff.url, {
                method: SummaryApi.getAllStaff.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.success) {
                setStaff(data.data);
            }
        } catch (error) {
            console.error('Error fetching staff:', error);
        }
        setLoading(false);
    };

    const fetchAllUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(SummaryApi.getAllUsers.url, {
                method: SummaryApi.getAllUsers.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.success) {
                setAllUsers(data.data.filter(user => user.role === 'GENERAL'));
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
        setLoading(false);
    };

    const fetchUploadStats = async () => {
        setLoading(true);
        try {
            const response = await fetch(SummaryApi.getUploadStats.url, {
                method: SummaryApi.getUploadStats.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.success) {
                setUploadStats(data.data);
            }
        } catch (error) {
            console.error('Error fetching upload stats:', error);
        }
        setLoading(false);
    };

    const promoteToAdmin = async (userId) => {
        if (!window.confirm('Are you sure you want to promote this user to Admin? This action gives full system access.')) {
            return;
        }

        try {
            const response = await fetch(SummaryApi.promoteToAdmin.url, {
                method: SummaryApi.promoteToAdmin.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId })
            });
            const data = await response.json();
            
            if (data.success) {
                alert('User promoted to Admin successfully!');
                fetchAllStaff();
                fetchAllUsers();
            } else {
                alert(data.message || 'Failed to promote user');
            }
        } catch (error) {
            console.error('Error promoting user:', error);
            alert('Error promoting user');
        }
    };

    const openPermissionModal = (user) => {
        setSelectedUser(user);
        setPermissions({
            canUploadProducts: user.permissions?.canUploadProducts || false,
            canEditProducts: user.permissions?.canEditProducts || false,
            canDeleteProducts: user.permissions?.canDeleteProducts || false,
            canManageOrders: user.permissions?.canManageOrders || false
        });
        setShowPermissionModal(true);
    };

    const grantPermissions = async () => {
        try {
            const response = await fetch(SummaryApi.grantPermissions.url, {
                method: SummaryApi.grantPermissions.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    userId: selectedUser._id, 
                    permissions 
                })
            });
            const data = await response.json();
            
            if (data.success) {
                alert('Permissions updated successfully!');
                setShowPermissionModal(false);
                fetchAllStaff();
                fetchAllUsers();
            } else {
                alert(data.message || 'Failed to update permissions');
            }
        } catch (error) {
            console.error('Error updating permissions:', error);
            alert('Error updating permissions');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Staff Management</h1>

                {/* Navigation Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="flex border-b">
                        <button
                            onClick={() => setActiveTab('all-staff')}
                            className={`flex items-center px-6 py-3 text-sm font-medium ${
                                activeTab === 'all-staff'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <FaUsers className="mr-2" />
                            All Staff
                        </button>
                        <button
                            onClick={() => setActiveTab('all-users')}
                            className={`flex items-center px-6 py-3 text-sm font-medium ${
                                activeTab === 'all-users'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <FaUserCog className="mr-2" />
                            General Users
                        </button>
                        <button
                            onClick={() => setActiveTab('upload-stats')}
                            className={`flex items-center px-6 py-3 text-sm font-medium ${
                                activeTab === 'upload-stats'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <FaChartBar className="mr-2" />
                            Upload Statistics
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-lg shadow-sm">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <>
                            {/* All Staff Tab */}
                            {activeTab === 'all-staff' && (
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold mb-4">Staff Members</h2>
                                    {staff.length === 0 ? (
                                        <p className="text-gray-500 text-center py-8">No staff members found</p>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full table-auto">
                                                <thead>
                                                    <tr className="bg-gray-50">
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Name
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Email
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Role
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Permissions
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Granted By
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {staff.map((member) => (
                                                        <tr key={member._id}>
                                                            <td className="px-4 py-4 whitespace-nowrap">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {member.name}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-500">
                                                                    {member.email}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4 whitespace-nowrap">
                                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                    member.role === 'ADMIN' 
                                                                        ? 'bg-red-100 text-red-800'
                                                                        : 'bg-blue-100 text-blue-800'
                                                                }`}>
                                                                    {member.role}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-4">
                                                                <div className="flex flex-wrap gap-1">
                                                                    {member.permissions?.canUploadProducts && (
                                                                        <span className="inline-flex px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                                                                            Upload
                                                                        </span>
                                                                    )}
                                                                    {member.permissions?.canEditProducts && (
                                                                        <span className="inline-flex px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                                                                            Edit
                                                                        </span>
                                                                    )}
                                                                    {member.permissions?.canDeleteProducts && (
                                                                        <span className="inline-flex px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                                                                            Delete
                                                                        </span>
                                                                    )}
                                                                    {member.permissions?.canManageOrders && (
                                                                        <span className="inline-flex px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                                                                            Orders
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {member.permissions?.grantedBy?.name || 'System'}
                                                            </td>
                                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                                                <button
                                                                    onClick={() => openPermissionModal(member)}
                                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                                >
                                                                    Edit Permissions
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* General Users Tab */}
                            {activeTab === 'all-users' && (
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold mb-4">General Users (Promotable)</h2>
                                    {allUsers.length === 0 ? (
                                        <p className="text-gray-500 text-center py-8">No general users found</p>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full table-auto">
                                                <thead>
                                                    <tr className="bg-gray-50">
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Name
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Email
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Join Date
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {allUsers.map((user) => (
                                                        <tr key={user._id}>
                                                            <td className="px-4 py-4 whitespace-nowrap">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {user.name}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-500">
                                                                    {user.email}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatDate(user.createdAt)}
                                                            </td>
                                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                                                <button
                                                                    onClick={() => openPermissionModal(user)}
                                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                                >
                                                                    Grant Permissions
                                                                </button>
                                                                <button
                                                                    onClick={() => promoteToAdmin(user._id)}
                                                                    className="text-red-600 hover:text-red-900"
                                                                >
                                                                    Promote to Admin
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Upload Statistics Tab */}
                            {activeTab === 'upload-stats' && (
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold mb-4">Product Upload Statistics</h2>
                                    {uploadStats.length === 0 ? (
                                        <p className="text-gray-500 text-center py-8">No upload statistics found</p>
                                    ) : (
                                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                            {uploadStats.map((stat) => (
                                                <div key={stat._id} className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900">
                                                                {stat.name}
                                                            </h3>
                                                            <p className="text-sm text-gray-600">{stat.email}</p>
                                                            <p className="text-xs text-blue-600 font-medium">{stat.role}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-2xl font-bold text-blue-600">
                                                                {stat.totalUploads}
                                                            </div>
                                                            <div className="text-sm text-gray-500">Products</div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 pt-4 border-t border-blue-200">
                                                        <p className="text-sm text-gray-600">
                                                            Last upload: {formatDate(stat.latestUpload)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Permission Modal */}
                {showPermissionModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold mb-4">
                                Manage Permissions - {selectedUser?.name}
                            </h3>
                            
                            <div className="space-y-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={permissions.canUploadProducts}
                                        onChange={(e) => setPermissions({
                                            ...permissions,
                                            canUploadProducts: e.target.checked
                                        })}
                                        className="mr-3"
                                    />
                                    Can Upload Products
                                </label>
                                
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={permissions.canEditProducts}
                                        onChange={(e) => setPermissions({
                                            ...permissions,
                                            canEditProducts: e.target.checked
                                        })}
                                        className="mr-3"
                                    />
                                    Can Edit Products
                                </label>
                                
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={permissions.canDeleteProducts}
                                        onChange={(e) => setPermissions({
                                            ...permissions,
                                            canDeleteProducts: e.target.checked
                                        })}
                                        className="mr-3"
                                    />
                                    Can Delete Products
                                </label>
                                
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={permissions.canManageOrders}
                                        onChange={(e) => setPermissions({
                                            ...permissions,
                                            canManageOrders: e.target.checked
                                        })}
                                        className="mr-3"
                                    />
                                    Can Manage Orders
                                </label>
                            </div>
                            
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowPermissionModal(false)}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={grantPermissions}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Update Permissions
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffManagement;