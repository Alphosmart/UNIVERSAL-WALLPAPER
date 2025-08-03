import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
    FaUser, 
    FaBuilding, 
    FaCheck, 
    FaTimes, 
    FaSpinner,
    FaIdCard,
    FaHome,
    FaUniversity,
    FaExclamationTriangle,
    FaPhone,
    FaMapMarkerAlt,
    FaUpload
} from 'react-icons/fa';
import SummaryApi from '../common';

const BecomeSellerPage = () => {
    const [sellerStatus, setSellerStatus] = useState({
        sellerStatus: 'not_seller',
        applicationDate: null,
        verificationDate: null,
        canReceivePayments: false,
        verificationDocuments: [],
        requiredDocuments: []
    });
    const [eligibility, setEligibility] = useState({
        isEligible: false,
        requirements: {
            phone: false,
            address: false,
            identification: false
        },
        missingFields: [],
        user: null
    });
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [updatingProfile, setUpdatingProfile] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    
    // Application form state
    const [businessType, setBusinessType] = useState('individual');
    
    // Profile form state
    const [profileForm, setProfileForm] = useState({
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
    });
    
    // Document upload state
    const [documentFile, setDocumentFile] = useState(null);
    const [documentType, setDocumentType] = useState('identity_proof');

    const documentTypes = {
        'government_id': {
            name: 'Government ID',
            description: 'Driver\'s license, passport, or state ID',
            icon: FaIdCard
        },
        'address_proof': {
            name: 'Address Proof',
            description: 'Utility bill or bank statement (within 3 months)',
            icon: FaHome
        },
        'bank_statement': {
            name: 'Bank Statement',
            description: 'Recent bank statement (within 3 months)',
            icon: FaUniversity
        }
    };

    useEffect(() => {
        fetchSellerStatus();
        checkEligibility();
    }, []);

    const checkEligibility = async () => {
        try {
            const response = await fetch(SummaryApi.checkSellerEligibility.url, {
                method: SummaryApi.checkSellerEligibility.method,
                credentials: 'include'
            });

            const data = await response.json();
            
            if (data.success) {
                setEligibility(data.data);
                // Pre-fill profile form with existing data
                if (data.data.user) {
                    setProfileForm({
                        phone: data.data.user.phone || '',
                        street: data.data.user.address?.street || '',
                        city: data.data.user.address?.city || '',
                        state: data.data.user.address?.state || '',
                        zipCode: data.data.user.address?.zipCode || '',
                        country: data.data.user.address?.country || 'India'
                    });
                }
            }
        } catch (error) {
            console.error('Error checking eligibility:', error);
        }
    };

    const fetchSellerStatus = async () => {
        try {
            const response = await fetch(SummaryApi.getSellerApplicationStatus.url, {
                method: SummaryApi.getSellerApplicationStatus.method,
                credentials: 'include'
            });

            const data = await response.json();
            
            if (data.success) {
                setSellerStatus(data.data);
                
                // Set active step based on status
                if (data.data.sellerStatus === 'not_seller') {
                    setActiveStep(1);
                } else if (data.data.sellerStatus === 'pending_verification') {
                    setActiveStep(2);
                } else {
                    setActiveStep(3);
                }
            }
        } catch (error) {
            console.error('Error fetching seller status:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApplyToBeSeller = async () => {
        setApplying(true);
        
        try {
            const response = await fetch(SummaryApi.applyToBeSeller.url, {
                method: SummaryApi.applyToBeSeller.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ businessType })
            });

            const data = await response.json();
            
            if (data.success) {
                toast.success(data.message);
                setSellerStatus(prev => ({
                    ...prev,
                    sellerStatus: data.data.sellerStatus,
                    applicationDate: data.data.applicationDate
                }));
                setActiveStep(2);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to submit application');
        } finally {
            setApplying(false);
        }
    };

    const handleDocumentUpload = async (documentType, file) => {
        setUploading(true);
        
        const formData = new FormData();
        formData.append('document', file);
        formData.append('documentType', documentType);

        try {
            const response = await fetch(SummaryApi.uploadVerificationDocument.url, {
                method: SummaryApi.uploadVerificationDocument.method,
                credentials: 'include',
                body: formData
            });

            const data = await response.json();
            
            if (data.success) {
                toast.success(data.message);
                fetchSellerStatus(); // Refresh status
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to upload document');
        } finally {
            setUploading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'verified': return 'text-green-600';
            case 'pending_verification': return 'text-yellow-600';
            case 'rejected': return 'text-red-600';
            case 'suspended': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'verified': return <FaCheck className="text-green-600" />;
            case 'pending_verification': return <FaSpinner className="text-yellow-600 animate-spin" />;
            case 'rejected': return <FaTimes className="text-red-600" />;
            case 'suspended': return <FaExclamationTriangle className="text-red-600" />;
            default: return null;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <FaSpinner className="text-4xl animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                    <h1 className="text-3xl font-bold mb-2">Become a Seller</h1>
                    <p className="text-blue-100">
                        Join our marketplace and start selling your products to millions of customers
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                        {[
                            { step: 1, title: 'Apply', desc: 'Submit application' },
                            { step: 2, title: 'Verify', desc: 'Upload documents' },
                            { step: 3, title: 'Approved', desc: 'Start selling' }
                        ].map((item, index) => (
                            <div key={item.step} className="flex items-center">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                    activeStep >= item.step 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-200 text-gray-600'
                                }`}>
                                    {activeStep > item.step ? <FaCheck /> : item.step}
                                </div>
                                <div className="ml-3">
                                    <p className="font-medium">{item.title}</p>
                                    <p className="text-sm text-gray-600">{item.desc}</p>
                                </div>
                                {index < 2 && (
                                    <div className={`w-20 h-1 mx-4 ${
                                        activeStep > item.step ? 'bg-blue-600' : 'bg-gray-200'
                                    }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Current Status */}
                    {sellerStatus.sellerStatus !== 'not_seller' && (
                        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                {getStatusIcon(sellerStatus.sellerStatus)}
                                <h3 className="text-lg font-semibold">
                                    Current Status: 
                                    <span className={`ml-2 ${getStatusColor(sellerStatus.sellerStatus)}`}>
                                        {sellerStatus.sellerStatus.replace('_', ' ').toUpperCase()}
                                    </span>
                                </h3>
                            </div>
                            {sellerStatus.applicationDate && (
                                <p className="text-gray-600">
                                    Applied on: {new Date(sellerStatus.applicationDate).toLocaleDateString()}
                                </p>
                            )}
                            {sellerStatus.verificationDate && (
                                <p className="text-gray-600">
                                    Verified on: {new Date(sellerStatus.verificationDate).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Step 1: Apply */}
                    {sellerStatus.sellerStatus === 'not_seller' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900">Start Your Seller Journey</h2>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Business Type</h3>
                                    <div className="space-y-3">
                                        {[
                                            { value: 'individual', label: 'Individual', icon: FaUser },
                                            { value: 'company', label: 'Company', icon: FaBuilding }
                                        ].map(type => (
                                            <label key={type.value} className="flex items-center space-x-3 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    value={type.value}
                                                    checked={businessType === type.value}
                                                    onChange={(e) => setBusinessType(e.target.value)}
                                                    className="text-blue-600"
                                                />
                                                <type.icon className="text-gray-600" />
                                                <span>{type.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>• Upload verification documents</li>
                                        <li>• Admin review (1-3 business days)</li>
                                        <li>• Get approved to start selling</li>
                                        <li>• Set up payment details</li>
                                    </ul>
                                </div>
                            </div>

                            <button
                                onClick={handleApplyToBeSeller}
                                disabled={applying}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {applying ? <FaSpinner className="animate-spin" /> : null}
                                {applying ? 'Submitting...' : 'Apply to Become a Seller'}
                            </button>
                        </div>
                    )}

                    {/* Step 2: Document Upload */}
                    {sellerStatus.sellerStatus === 'pending_verification' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900">Upload Verification Documents</h2>
                            <p className="text-gray-600">
                                Please upload the following documents to verify your identity and start selling.
                            </p>

                            <div className="grid gap-6">
                                {sellerStatus.requiredDocuments.map(docType => {
                                    const doc = documentTypes[docType];
                                    const uploaded = sellerStatus.verificationDocuments.find(d => d.documentType === docType);
                                    
                                    return (
                                        <div key={docType} className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <doc.icon className="text-blue-600 text-xl" />
                                                    <div>
                                                        <h3 className="font-semibold">{doc.name}</h3>
                                                        <p className="text-sm text-gray-600">{doc.description}</p>
                                                    </div>
                                                </div>
                                                {uploaded && (
                                                    <div className="flex items-center gap-2">
                                                        {getStatusIcon(uploaded.verificationStatus)}
                                                        <span className={`text-sm ${getStatusColor(uploaded.verificationStatus)}`}>
                                                            {uploaded.verificationStatus}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <input
                                                type="file"
                                                accept="image/*,.pdf"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        handleDocumentUpload(docType, file);
                                                    }
                                                }}
                                                className="w-full"
                                                disabled={uploading}
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            {uploading && (
                                <div className="text-center py-4">
                                    <FaSpinner className="animate-spin text-2xl text-blue-600 mx-auto mb-2" />
                                    <p className="text-gray-600">Uploading document...</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Verified */}
                    {sellerStatus.sellerStatus === 'verified' && (
                        <div className="text-center space-y-6">
                            <div className="text-6xl text-green-600 mb-4">
                                <FaCheck className="mx-auto" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Congratulations!</h2>
                            <p className="text-gray-600 max-w-md mx-auto">
                                Your seller application has been approved. You can now start selling products on our platform.
                            </p>
                            <div className="space-y-3">
                                <a
                                    href="/add-product"
                                    className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700"
                                >
                                    Add Your First Product
                                </a>
                                <br />
                                <a
                                    href="/seller-account-settings"
                                    className="inline-block text-blue-600 hover:text-blue-800"
                                >
                                    Set Up Payment Details →
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Rejected Status */}
                    {sellerStatus.sellerStatus === 'rejected' && (
                        <div className="text-center space-y-6">
                            <div className="text-6xl text-red-600 mb-4">
                                <FaTimes className="mx-auto" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Application Rejected</h2>
                            <p className="text-gray-600 max-w-md mx-auto">
                                Unfortunately, your seller application has been rejected. Please contact support for more information.
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700"
                            >
                                Contact Support
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BecomeSellerPage;
