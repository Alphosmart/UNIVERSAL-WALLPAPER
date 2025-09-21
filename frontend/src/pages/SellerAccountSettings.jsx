import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
    FaUniversity, 
    FaShieldAlt, 
    FaEye,
    FaEyeSlash,
    FaCreditCard,
    FaPaypal,
    FaEdit,
    FaSave,
    FaSpinner,
    FaExclamationTriangle
} from 'react-icons/fa';
import SummaryApi from '../common';

const SellerAccountSettings = () => {
    const user = useSelector(state => state?.user?.user);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showBankDetails, setShowBankDetails] = useState(false);
    const [activeTab, setActiveTab] = useState('bank');
    const [editMode, setEditMode] = useState(false);

    const [paymentDetails, setPaymentDetails] = useState({
        bankAccount: {
            accountNumber: '',
            routingNumber: '',
            accountHolderName: '',
            bankName: '',
            accountType: 'checking'
        },
        paypalEmail: '',
        taxInfo: {
            ssn: '',
            ein: '',
            businessType: 'individual'
        }
    });

    const [sellerSettings, setSellerSettings] = useState({
        payoutSchedule: 'weekly',
        minimumPayout: 25.00
    });

    const fetchSellerData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(SummaryApi.getSellerPaymentDetails.url, {
                method: SummaryApi.getSellerPaymentDetails.method,
                credentials: 'include'
            });
            const result = await response.json();
            
            if (result.success) {
                setPaymentDetails(prev => result.data.paymentDetails || prev);
                setSellerSettings(prev => result.data.sellerSettings || prev);
            }
        } catch (error) {
            console.error('Error fetching seller data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSellerData();
    }, [fetchSellerData]);
    
    // Check if user is admin
    const isAdmin = user?.role === 'ADMIN';

    // Redirect non-admin users
    if (!isAdmin) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center">
                        <FaExclamationTriangle className="text-red-600 text-2xl mr-4" />
                        <div>
                            <h1 className="text-xl font-bold text-red-800 mb-2">Access Denied</h1>
                            <p className="text-red-700">
                                Only administrators can access payment settings. 
                                Please contact an administrator if you need to manage payment details.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const handleSavePaymentDetails = async () => {
        setSaving(true);
        try {
            const response = await fetch(SummaryApi.updateSellerPaymentDetails.url, {
                method: SummaryApi.updateSellerPaymentDetails.method,
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    paymentDetails,
                    sellerSettings
                })
            });

            const result = await response.json();
            
            if (result.success) {
                toast.success('Payment details updated successfully');
                setEditMode(false);
                fetchSellerData();
            } else {
                toast.error(result.message || 'Failed to update payment details');
            }
        } catch (error) {
            console.error('Error saving payment details:', error);
            toast.error('Failed to save payment details');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
                        <div className="text-lg">Loading seller settings...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="bg-white rounded-lg shadow-lg">
                {/* Header */}
                <div className="border-b border-gray-200 p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Company Payment Settings</h1>
                            <p className="text-gray-600 mt-1">Manage payment methods and payout preferences for your company</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {!editMode ? (
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <FaEdit />
                                    Edit Details
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditMode(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSavePaymentDetails}
                                        disabled={saving}
                                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                    >
                                        {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6" aria-label="Tabs">
                        {[
                            { id: 'bank', name: 'Bank Account', icon: FaUniversity },
                            { id: 'paypal', name: 'PayPal', icon: FaPaypal },
                            { id: 'settings', name: 'Payout Settings', icon: FaCreditCard }
                        ].map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <Icon />
                                    {tab.name}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {/* Bank Account Tab */}
                    {activeTab === 'bank' && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <FaShieldAlt className="text-blue-600 mr-2" />
                                    <div>
                                        <h3 className="font-semibold text-blue-800">Company Bank Information</h3>
                                        <p className="text-blue-600 text-sm">Company bank details are encrypted and secure</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Account Holder Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={paymentDetails.bankAccount.accountHolderName}
                                        onChange={(e) => setPaymentDetails({
                                            ...paymentDetails,
                                            bankAccount: {
                                                ...paymentDetails.bankAccount,
                                                accountHolderName: e.target.value
                                            }
                                        })}
                                        disabled={!editMode}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                                        placeholder="Full name as on bank account"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bank Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={paymentDetails.bankAccount.bankName}
                                        onChange={(e) => setPaymentDetails({
                                            ...paymentDetails,
                                            bankAccount: {
                                                ...paymentDetails.bankAccount,
                                                bankName: e.target.value
                                            }
                                        })}
                                        disabled={!editMode}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                                        placeholder="Bank name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Account Number *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showBankDetails ? "text" : "password"}
                                            value={paymentDetails.bankAccount.accountNumber}
                                            onChange={(e) => setPaymentDetails({
                                                ...paymentDetails,
                                                bankAccount: {
                                                    ...paymentDetails.bankAccount,
                                                    accountNumber: e.target.value
                                                }
                                            })}
                                            disabled={!editMode}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 pr-10"
                                            placeholder="Account number"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowBankDetails(!showBankDetails)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showBankDetails ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Routing Number *
                                    </label>
                                    <input
                                        type="text"
                                        value={paymentDetails.bankAccount.routingNumber}
                                        onChange={(e) => setPaymentDetails({
                                            ...paymentDetails,
                                            bankAccount: {
                                                ...paymentDetails.bankAccount,
                                                routingNumber: e.target.value
                                            }
                                        })}
                                        disabled={!editMode}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                                        placeholder="9-digit routing number"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Account Type
                                    </label>
                                    <select
                                        value={paymentDetails.bankAccount.accountType}
                                        onChange={(e) => setPaymentDetails({
                                            ...paymentDetails,
                                            bankAccount: {
                                                ...paymentDetails.bankAccount,
                                                accountType: e.target.value
                                            }
                                        })}
                                        disabled={!editMode}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                                    >
                                        <option value="checking">Checking</option>
                                        <option value="savings">Savings</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PayPal Tab */}
                    {activeTab === 'paypal' && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <FaPaypal className="text-blue-600 mr-2" />
                                    <div>
                                        <h3 className="font-semibold text-blue-800">PayPal Integration</h3>
                                        <p className="text-blue-600 text-sm">Receive payments directly to your PayPal account</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    PayPal Email Address
                                </label>
                                <input
                                    type="email"
                                    value={paymentDetails.paypalEmail}
                                    onChange={(e) => setPaymentDetails({
                                        ...paymentDetails,
                                        paypalEmail: e.target.value
                                    })}
                                    disabled={!editMode}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                                    placeholder="your.email@example.com"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    This must be the email address associated with your PayPal account
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Payout Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Payout Schedule
                                    </label>
                                    <select
                                        value={sellerSettings.payoutSchedule}
                                        onChange={(e) => setSellerSettings({
                                            ...sellerSettings,
                                            payoutSchedule: e.target.value
                                        })}
                                        disabled={!editMode}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Minimum Payout Amount ($)
                                    </label>
                                    <input
                                        type="number"
                                        min="10"
                                        step="0.01"
                                        value={sellerSettings.minimumPayout}
                                        onChange={(e) => setSellerSettings({
                                            ...sellerSettings,
                                            minimumPayout: parseFloat(e.target.value)
                                        })}
                                        disabled={!editMode}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellerAccountSettings;
