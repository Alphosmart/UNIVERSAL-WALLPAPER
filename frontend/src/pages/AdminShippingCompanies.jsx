import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaEye, FaCheck, FaTimes, FaSearch, FaFilter, FaShippingFast, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import SummaryApi from '../common';

const AdminShippingCompanies = () => {
    const [shippingCompanies, setShippingCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchShippingCompanies();
    }, []);

    const fetchShippingCompanies = async () => {
        try {
            setLoading(true);
            const response = await fetch(SummaryApi.getAllShippingCompanies.url, {
                method: SummaryApi.getAllShippingCompanies.method,
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setShippingCompanies(data.data || []);
            } else {
                toast.error('Failed to fetch shipping companies');
            }
        } catch (error) {
            console.error('Error fetching shipping companies:', error);
            toast.error('Failed to fetch shipping companies');
        } finally {
            setLoading(false);
        }
    };

    const updateCompanyStatus = async (companyId, newStatus, reason = '') => {
        try {
            setActionLoading(companyId);
            const response = await fetch(SummaryApi.updateShippingCompanyStatus.url, {
                method: SummaryApi.updateShippingCompanyStatus.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    companyId: companyId,
                    status: newStatus,
                    rejectionReason: reason
                })
            });

            if (response.ok) {
                toast.success(`Shipping company ${newStatus} successfully`);
                fetchShippingCompanies();
                setShowDetailModal(false);
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('Error updating company status:', error);
            toast.error('Failed to update status');
        } finally {
            setActionLoading(null);
        }
    };

    const filteredCompanies = shippingCompanies.filter(company => {
        const matchesStatus = statusFilter === 'all' || company.shippingCompanyStatus === statusFilter;
        const matchesSearch = 
            company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.companyInfo?.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getStatusBadgeColor = (status) => {
        const colors = {
            'pending_verification': 'bg-yellow-100 text-yellow-800',
            'verified': 'bg-green-100 text-green-800',
            'rejected': 'bg-red-100 text-red-800',
            'suspended': 'bg-gray-100 text-gray-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const CompanyDetailModal = ({ company, onClose }) => {
        const [rejectionReason, setRejectionReason] = useState('');
        const [showRejectForm, setShowRejectForm] = useState(false);

        if (!company) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-xl font-semibold">Shipping Company Details</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <FaTimes className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        {/* Company Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Contact Name</label>
                                        <p className="text-gray-900">{company.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Email</label>
                                        <p className="text-gray-900 flex items-center">
                                            <FaEnvelope className="w-4 h-4 mr-2" />
                                            {company.email}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Phone</label>
                                        <p className="text-gray-900 flex items-center">
                                            <FaPhone className="w-4 h-4 mr-2" />
                                            {company.phone}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Registration Date</label>
                                        <p className="text-gray-900">{formatDate(company.createdAt)}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4">Company Information</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Company Name</label>
                                        <p className="text-gray-900">{company.companyInfo?.companyName}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Company Type</label>
                                        <p className="text-gray-900">{company.companyInfo?.companyType}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Registration Number</label>
                                        <p className="text-gray-900">{company.companyInfo?.registrationNumber}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Description</label>
                                        <p className="text-gray-900">{company.companyInfo?.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        {company.address && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Address</h3>
                                <p className="text-gray-900 flex items-center">
                                    <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                                    {company.address.street}, {company.address.city}, {company.address.state}, {company.address.country}
                                </p>
                            </div>
                        )}

                        {/* Service Areas */}
                        {company.serviceAreas && company.serviceAreas.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Service Areas</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {company.serviceAreas.map((area, index) => (
                                        <div key={index} className="border rounded-lg p-4">
                                            <h4 className="font-medium mb-2">Area {index + 1}</h4>
                                            <p className="text-sm text-gray-600">
                                                Cities: {area.cities?.join(', ') || 'Not specified'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Shipping Services */}
                        {company.shippingServices && company.shippingServices.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Shipping Services</h3>
                                <div className="space-y-4">
                                    {company.shippingServices.map((service, index) => (
                                        <div key={index} className="border rounded-lg p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium">{service.serviceName}</h4>
                                                    <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">₦{service.pricePerKg}/kg</p>
                                                    <p className="text-sm text-gray-600">Max: {service.maxWeight}kg</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Current Status */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Current Status</h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(company.shippingCompanyStatus)}`}>
                                {company.shippingCompanyStatus?.replace('_', ' ').toUpperCase()}
                            </span>
                        </div>

                        {/* Action Buttons */}
                        {company.shippingCompanyStatus === 'pending_verification' && (
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold mb-4">Admin Actions</h3>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => updateCompanyStatus(company._id, 'verified')}
                                        disabled={actionLoading === company._id}
                                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                                    >
                                        <FaCheck className="w-4 h-4 mr-2" />
                                        {actionLoading === company._id ? 'Approving...' : 'Approve'}
                                    </button>
                                    
                                    <button
                                        onClick={() => setShowRejectForm(!showRejectForm)}
                                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                    >
                                        <FaTimes className="w-4 h-4 mr-2" />
                                        Reject
                                    </button>
                                </div>

                                {showRejectForm && (
                                    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Rejection Reason
                                        </label>
                                        <textarea
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                            placeholder="Provide a reason for rejection..."
                                        />
                                        <div className="flex gap-2 mt-3">
                                            <button
                                                onClick={() => updateCompanyStatus(company._id, 'rejected', rejectionReason)}
                                                disabled={!rejectionReason.trim() || actionLoading === company._id}
                                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                                            >
                                                {actionLoading === company._id ? 'Rejecting...' : 'Confirm Rejection'}
                                            </button>
                                            <button
                                                onClick={() => setShowRejectForm(false)}
                                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {company.shippingCompanyStatus === 'verified' && (
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold mb-4">Admin Actions</h3>
                                <button
                                    onClick={() => updateCompanyStatus(company._id, 'suspended')}
                                    disabled={actionLoading === company._id}
                                    className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50"
                                >
                                    <FaClock className="w-4 h-4 mr-2" />
                                    {actionLoading === company._id ? 'Suspending...' : 'Suspend'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Shipping Companies Management</h1>
                    <p className="text-gray-600 mt-1">Review and manage shipping company applications</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by company name, email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaFilter className="text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="pending_verification">Pending Verification</option>
                            <option value="verified">Verified</option>
                            <option value="rejected">Rejected</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Companies Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading shipping companies...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Company
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Registration Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredCompanies.map((company) => (
                                    <tr key={company._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <FaShippingFast className="text-blue-600" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {company.companyInfo?.companyName || 'N/A'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {company.companyInfo?.companyType || 'Not specified'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{company.name}</div>
                                            <div className="text-sm text-gray-500">{company.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(company.shippingCompanyStatus)}`}>
                                                {company.shippingCompanyStatus?.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(company.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedCompany(company);
                                                        setShowDetailModal(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                                                >
                                                    <FaEye />
                                                    <span>View</span>
                                                </button>
                                                {company.shippingCompanyStatus === 'pending_verification' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateCompanyStatus(company._id, 'verified')}
                                                            disabled={actionLoading === company._id}
                                                            className="text-green-600 hover:text-green-900 flex items-center space-x-1 disabled:opacity-50"
                                                        >
                                                            <FaCheck />
                                                            <span>Approve</span>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedCompany(company);
                                                                setShowDetailModal(true);
                                                            }}
                                                            className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                                                        >
                                                            <FaTimes />
                                                            <span>Reject</span>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && filteredCompanies.length === 0 && (
                    <div className="text-center py-12">
                        <FaShippingFast className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No shipping companies found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {statusFilter === 'all' ? 'No shipping companies have registered yet.' : `No ${statusFilter.replace('_', ' ')} shipping companies found.`}
                        </p>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedCompany && (
                <CompanyDetailModal
                    company={selectedCompany}
                    onClose={() => {
                        setShowDetailModal(false);
                        setSelectedCompany(null);
                    }}
                />
            )}
        </div>
    );
};

export default AdminShippingCompanies;
