import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
    FaCheck, 
    FaTimes, 
    FaSpinner, 
    FaEye, 
    FaUser,
    FaBuilding,
    FaCalendar,
    FaEnvelope,
    FaIdCard,
    FaHome,
    FaUniversity
} from 'react-icons/fa';
import SummaryApi from '../common';

const SellerApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'approve', 'reject', 'view'

    const documentTypes = {
        'government_id': {
            name: 'Government ID',
            icon: FaIdCard
        },
        'address_proof': {
            name: 'Address Proof',
            icon: FaHome
        },
        'bank_statement': {
            name: 'Bank Statement',
            icon: FaUniversity
        },
        'business_license': {
            name: 'Business License',
            icon: FaBuilding
        }
    };

    useEffect(() => {
        fetchPendingApplications();
    }, []);

    const fetchPendingApplications = async () => {
        try {
            setLoading(true);
            const response = await fetch(SummaryApi.getPendingSellerApplications.url, {
                method: SummaryApi.getPendingSellerApplications.method,
                credentials: 'include'
            });

            const data = await response.json();
            
            if (data.success) {
                setApplications(data.data);
            } else {
                toast.error(data.message || 'Failed to fetch applications');
            }
        } catch (error) {
            toast.error('Error fetching applications');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewApplication = async (applicationId, action, reason = '') => {
        try {
            setProcessing(applicationId);
            
            const response = await fetch(`${SummaryApi.reviewSellerApplication.url}/${applicationId}`, {
                method: SummaryApi.reviewSellerApplication.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action,
                    rejectionReason: reason
                })
            });

            const data = await response.json();
            
            if (data.success) {
                toast.success(data.message);
                // Remove the processed application from the list
                setApplications(prev => prev.filter(app => app._id !== applicationId));
                setShowModal(false);
                setRejectionReason('');
            } else {
                toast.error(data.message || `Failed to ${action} application`);
            }
        } catch (error) {
            toast.error(`Error ${action}ing application`);
            console.error('Error:', error);
        } finally {
            setProcessing(null);
        }
    };

    const openModal = (application, type) => {
        setSelectedApplication(application);
        setModalType(type);
        setShowModal(true);
        if (type !== 'reject') {
            setRejectionReason('');
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedApplication(null);
        setRejectionReason('');
        setModalType('');
    };

    const getBusinessTypeIcon = (businessType) => {
        switch (businessType) {
            case 'individual': return <FaUser className="text-blue-600" />;
            case 'company': return <FaBuilding className="text-purple-600" />;
            case 'non_profit': return <FaBuilding className="text-green-600" />;
            default: return <FaUser className="text-gray-600" />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <FaSpinner className="text-4xl animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Seller Applications</h1>
                <div className="text-sm text-gray-600">
                    {applications.length} pending application{applications.length !== 1 ? 's' : ''}
                </div>
            </div>

            {applications.length === 0 ? (
                <div className="text-center py-12">
                    <FaCheck className="text-6xl text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">All caught up!</h3>
                    <p className="text-gray-600">No pending seller applications to review.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {applications.map((application) => (
                        <div key={application._id} className="bg-white rounded-lg shadow-lg border border-gray-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-lg">
                                                {application.name?.charAt(0)?.toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {application.name}
                                            </h3>
                                            <div className="flex items-center space-x-2 text-gray-600">
                                                <FaEnvelope className="text-sm" />
                                                <span className="text-sm">{application.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        {application.paymentDetails?.taxInfo?.businessType && (
                                            <div className="flex items-center space-x-1 px-3 py-1 bg-gray-100 rounded-full">
                                                {getBusinessTypeIcon(application.paymentDetails.taxInfo.businessType)}
                                                <span className="text-sm font-medium capitalize">
                                                    {application.paymentDetails.taxInfo.businessType}
                                                </span>
                                            </div>
                                        )}
                                        
                                        <div className="flex items-center space-x-1 text-gray-500">
                                            <FaCalendar className="text-sm" />
                                            <span className="text-sm">
                                                {new Date(application.sellerApplicationDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">Uploaded Documents</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {application.paymentDetails?.verificationDocuments?.length > 0 ? (
                                            application.paymentDetails.verificationDocuments.map((doc, index) => {
                                                const DocIcon = documentTypes[doc.documentType]?.icon || FaIdCard;
                                                return (
                                                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                        <DocIcon className="text-blue-600" />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {documentTypes[doc.documentType]?.name || doc.documentType}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {new Date(doc.uploadedAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => window.open(`http://localhost:8080${doc.documentUrl}`, '_blank')}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            <FaEye />
                                                        </button>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="col-span-full text-center py-4 text-gray-500">
                                                No documents uploaded yet
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => openModal(application, 'view')}
                                        className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <FaEye />
                                        <span>View Details</span>
                                    </button>
                                    
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => openModal(application, 'reject')}
                                            disabled={processing === application._id}
                                            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {processing === application._id ? (
                                                <FaSpinner className="animate-spin" />
                                            ) : (
                                                <FaTimes />
                                            )}
                                            <span>Reject</span>
                                        </button>
                                        
                                        <button
                                            onClick={() => openModal(application, 'approve')}
                                            disabled={processing === application._id}
                                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {processing === application._id ? (
                                                <FaSpinner className="animate-spin" />
                                            ) : (
                                                <FaCheck />
                                            )}
                                            <span>Approve</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && selectedApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900">
                                    {modalType === 'approve' && 'Approve Application'}
                                    {modalType === 'reject' && 'Reject Application'}
                                    {modalType === 'view' && 'Application Details'}
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-gray-900">Applicant Information</h4>
                                    <p><strong>Name:</strong> {selectedApplication.name}</p>
                                    <p><strong>Email:</strong> {selectedApplication.email}</p>
                                    <p><strong>Business Type:</strong> {selectedApplication.paymentDetails?.taxInfo?.businessType || 'Not specified'}</p>
                                    <p><strong>Application Date:</strong> {new Date(selectedApplication.sellerApplicationDate).toLocaleDateString()}</p>
                                </div>

                                {modalType === 'reject' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Rejection Reason *
                                        </label>
                                        <textarea
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            placeholder="Please provide a reason for rejection..."
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            rows={4}
                                            required
                                        />
                                    </div>
                                )}

                                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={closeModal}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Cancel
                                    </button>
                                    
                                    {modalType === 'approve' && (
                                        <button
                                            onClick={() => handleReviewApplication(selectedApplication._id, 'approve')}
                                            disabled={processing === selectedApplication._id}
                                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                        >
                                            <FaCheck />
                                            <span>Confirm Approval</span>
                                        </button>
                                    )}
                                    
                                    {modalType === 'reject' && (
                                        <button
                                            onClick={() => handleReviewApplication(selectedApplication._id, 'reject', rejectionReason)}
                                            disabled={processing === selectedApplication._id || !rejectionReason.trim()}
                                            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                                        >
                                            <FaTimes />
                                            <span>Confirm Rejection</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerApplications;
