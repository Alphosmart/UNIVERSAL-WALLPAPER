import React, { useState, useEffect } from 'react';

const AdminSellerApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'approve' or 'reject'

    // Fetch seller applications
    const fetchApplications = async () => {
        try {
            setLoading(true);
            const url = filterStatus === 'pending' 
                ? 'http://localhost:8080/api/admin/pending-seller-applications'
                : 'http://localhost:8080/api/admin/seller-applications';
            
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Seller Applications API Response:', data);
                
                let applicationsArray = Array.isArray(data.data) ? data.data : [];
                
                // Filter by status if not 'all' or 'pending'
                if (filterStatus !== 'all' && filterStatus !== 'pending') {
                    applicationsArray = applicationsArray.filter(app => app.sellerStatus === filterStatus);
                }
                
                setApplications(applicationsArray);
            } else {
                console.error('API Error:', response.status, response.statusText);
                setApplications([]);
                setError('Failed to fetch seller applications');
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            setApplications([]);
            setError('Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterStatus]);

    // Filter applications by search term
    const filteredApplications = applications.filter(app => 
        app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.businessType?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Update seller application status
    const updateApplicationStatus = async (userId, status, reason = '') => {
        try {
            const response = await fetch(`http://localhost:8080/api/admin/update-seller-status/${userId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status,
                    rejectionReason: reason
                })
            });

            if (response.ok) {
                fetchApplications(); // Refresh the list
                setShowModal(false);
                setSelectedApplication(null);
                setRejectionReason('');
                setError('');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to update application status');
            }
        } catch (error) {
            console.error('Error updating application:', error);
            setError('Network error occurred');
        }
    };

    // Handle approve/reject actions
    const handleApprove = (application) => {
        setSelectedApplication(application);
        setModalType('approve');
        setShowModal(true);
    };

    const handleReject = (application) => {
        setSelectedApplication(application);
        setModalType('reject');
        setShowModal(true);
    };

    const confirmAction = () => {
        if (modalType === 'approve') {
            updateApplicationStatus(selectedApplication._id, 'verified');
        } else if (modalType === 'reject') {
        if (!rejectionReason.trim()) {
            setError('Please provide a rejection reason');
            return;
        }
        updateApplicationStatus(selectedApplication._id, 'rejected', rejectionReason);
    }
};

// Handle seller suspension/unsuspension
const setSellerSuspension = async (sellerId, suspend) => {
    const action = suspend ? 'suspend' : 'unsuspend';
    if (window.confirm(`Are you sure you want to ${action} this seller?`)) {
        try {
            const response = await fetch(`http://localhost:8080/api/admin/seller-suspension/${sellerId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ suspend })
            });

            if (response.ok) {
                fetchApplications();
                setError('');
                alert(`Seller ${action}ed successfully`);
            } else {
                setError(`Failed to ${action} seller`);
            }
        } catch (error) {
            console.error(`Error ${action}ing seller:`, error);
            setError(`Error ${action}ing seller: ${error.message}`);
        }
    }
};    // Get status badge styling
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending_verification':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'verified':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'suspended':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Format status text
    const formatStatus = (status) => {
        switch (status) {
            case 'pending_verification':
                return 'Pending';
            case 'verified':
                return 'Approved';
            case 'rejected':
                return 'Rejected';
            case 'suspended':
                return 'Suspended';
            default:
                return status;
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    // Format address object to string
    const formatAddress = (address) => {
        if (!address) return 'Not provided';
        if (typeof address === 'string') return address;
        
        const { street, city, state, zipCode, country } = address;
        const parts = [street, city, state, zipCode, country].filter(Boolean);
        return parts.length > 0 ? parts.join(', ') : 'Not provided';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-600">Loading seller applications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Seller Management</h1>
                    <p className="text-gray-600 mt-2">Manage seller applications, approvals, and suspensions</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {/* Filters and Search */}
                <div className="bg-white rounded-lg shadow mb-6 p-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        {/* Status Filter */}
                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Applications</option>
                                <option value="pending">Pending Only</option>
                                <option value="pending_verification">Pending</option>
                                <option value="verified">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="suspended">Suspended</option>
                            </select>
                        </div>

                        {/* Search */}
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search by name, email, or business type..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900">Total Applications</h3>
                        <p className="text-3xl font-bold text-blue-600">{applications.length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900">Pending</h3>
                        <p className="text-3xl font-bold text-yellow-600">
                            {applications.filter(app => app.sellerStatus === 'pending_verification').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900">Approved</h3>
                        <p className="text-3xl font-bold text-green-600">
                            {applications.filter(app => app.sellerStatus === 'verified').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900">Rejected</h3>
                        <p className="text-3xl font-bold text-red-600">
                            {applications.filter(app => app.sellerStatus === 'rejected').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900">Suspended</h3>
                        <p className="text-3xl font-bold text-orange-600">
                            {applications.filter(app => app.sellerStatus === 'suspended').length}
                        </p>
                    </div>
                </div>

                {/* Applications List */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {filteredApplications.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-lg text-gray-500">No seller applications found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Applicant
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Business Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Application Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Action Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredApplications.map((application) => (
                                        <tr key={application._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {application.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {application.email}
                                                    </div>
                                                    {application.phone && (
                                                        <div className="text-sm text-gray-500">
                                                            {application.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">
                                                    {application.businessType || 'Not specified'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeClass(application.sellerStatus)}`}>
                                                    {formatStatus(application.sellerStatus)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatDate(application.sellerApplicationDate)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {application.sellerStatus === 'verified' && formatDate(application.verifiedAt)}
                                                {application.sellerStatus === 'rejected' && 'Rejected'}
                                                {application.sellerStatus === 'pending_verification' && 'Pending'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    {application.sellerStatus === 'pending_verification' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(application)}
                                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(application)}
                                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors"
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                    {application.sellerStatus !== 'suspended' ? (
                                                        <button
                                                            onClick={() => setSellerSuspension(application._id, true)}
                                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors"
                                                        >
                                                            Suspend
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => setSellerSuspension(application._id, false)}
                                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors"
                                                        >
                                                            Unsuspend
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => setSelectedApplication(application)}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors"
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Application Details Modal */}
                {selectedApplication && !showModal && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
                            <div className="mt-3">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Application Details</h3>
                                    <button
                                        onClick={() => setSelectedApplication(null)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        ✕
                                    </button>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <p className="text-sm text-gray-900">{selectedApplication.name}</p>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <p className="text-sm text-gray-900">{selectedApplication.email}</p>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                                        <p className="text-sm text-gray-900">{selectedApplication.phone || 'Not provided'}</p>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Address</label>
                                        <p className="text-sm text-gray-900">{formatAddress(selectedApplication.address)}</p>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Business Type</label>
                                        <p className="text-sm text-gray-900">{selectedApplication.businessType || 'Not specified'}</p>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Status</label>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeClass(selectedApplication.sellerStatus)}`}>
                                            {formatStatus(selectedApplication.sellerStatus)}
                                        </span>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Application Date</label>
                                        <p className="text-sm text-gray-900">{formatDate(selectedApplication.sellerApplicationDate)}</p>
                                    </div>
                                    
                                    {selectedApplication.verifiedAt && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Approved Date</label>
                                            <p className="text-sm text-gray-900">{formatDate(selectedApplication.verifiedAt)}</p>
                                        </div>
                                    )}
                                    
                                    {selectedApplication.rejectionReason && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Rejection Reason</label>
                                            <p className="text-sm text-gray-900">{selectedApplication.rejectionReason}</p>
                                        </div>
                                    )}
                                    
                                    {selectedApplication.verificationDocuments && selectedApplication.verificationDocuments.length > 0 && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Verification Documents</label>
                                            <div className="space-y-2">
                                                {selectedApplication.verificationDocuments.map((doc, index) => (
                                                    <div key={index} className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-900">{doc.type}</span>
                                                        <a
                                                            href={doc.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                                        >
                                                            View Document
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="mt-6 flex justify-end space-x-3">
                                    {selectedApplication.sellerStatus === 'pending_verification' && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(selectedApplication)}
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                            >
                                                Approve Application
                                            </button>
                                            <button
                                                onClick={() => handleReject(selectedApplication)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                            >
                                                Reject Application
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => setSelectedApplication(null)}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Confirmation Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                            <div className="mt-3">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    {modalType === 'approve' ? 'Approve Application' : 'Reject Application'}
                                </h3>
                                
                                <p className="text-sm text-gray-600 mb-4">
                                    {modalType === 'approve' 
                                        ? `Are you sure you want to approve ${selectedApplication?.name}'s seller application?`
                                        : `Are you sure you want to reject ${selectedApplication?.name}'s seller application?`
                                    }
                                </p>

                                {modalType === 'reject' && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Rejection Reason *
                                        </label>
                                        <textarea
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            placeholder="Please provide a reason for rejection..."
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows="3"
                                        />
                                    </div>
                                )}

                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => {
                                            setShowModal(false);
                                            setRejectionReason('');
                                        }}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmAction}
                                        className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                                            modalType === 'approve' 
                                                ? 'bg-green-600 hover:bg-green-700' 
                                                : 'bg-red-600 hover:bg-red-700'
                                        }`}
                                    >
                                        {modalType === 'approve' ? 'Approve' : 'Reject'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSellerApplications;
