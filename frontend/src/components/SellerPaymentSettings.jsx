import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
    FaCreditCard, 
    FaPaypal, 
    FaMoneyBillWave, 
    FaUniversity, 
    FaBitcoin,
    FaCheck,
    FaTimes,
    FaSave,
    FaSpinner,
    FaExclamationTriangle
} from 'react-icons/fa';
import SummaryApi from '../common';

const SellerPaymentSettings = () => {
    const user = useSelector(state => state?.user?.user);
    const [paymentPreferences, setPaymentPreferences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [originalPreferences, setOriginalPreferences] = useState([]);

    const paymentMethods = [
        {
            id: 'stripe',
            name: 'Credit/Debit Cards',
            description: 'Accept all major credit and debit cards via Stripe',
            icon: FaCreditCard,
            processingFee: '2.9% + $0.30',
            payoutTime: 'Next business day'
        },
        {
            id: 'paypal',
            name: 'PayPal',
            description: 'Let customers pay with their PayPal account',
            icon: FaPaypal,
            processingFee: '3.4% + $0.30',
            payoutTime: '1-2 business days'
        },
        {
            id: 'cashOnDelivery',
            name: 'Cash on Delivery',
            description: 'Customers pay with cash upon delivery',
            icon: FaMoneyBillWave,
            processingFee: 'No processing fee',
            payoutTime: 'After delivery confirmation'
        },
        {
            id: 'bankTransfer',
            name: 'Bank Transfer',
            description: 'Direct bank transfer for bulk orders',
            icon: FaUniversity,
            processingFee: 'Minimal bank fees',
            payoutTime: '2-3 business days'
        },
        {
            id: 'cryptocurrency',
            name: 'Cryptocurrency',
            description: 'Accept Bitcoin, Ethereum, and other cryptocurrencies',
            icon: FaBitcoin,
            processingFee: '1-2%',
            payoutTime: 'Within 24 hours'
        }
    ];

    useEffect(() => {
        // Only fetch if user is admin
        if (user?.role === 'ADMIN') {
            fetchPaymentPreferences();
        }
    }, [user]);

    // Check if user is admin - show this after hooks
    if (user?.role !== 'ADMIN') {
        return (
            <div className="container mx-auto px-4 py-8">
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

    const fetchPaymentPreferences = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${SummaryApi.getSellerPaymentPreferences.url}/current`, {
                method: SummaryApi.getSellerPaymentPreferences.method,
                credentials: 'include'
            });

            const result = await response.json();

            if (result.success) {
                const preferences = result.data.preferredPaymentMethods || ['stripe', 'paypal', 'cashOnDelivery'];
                setPaymentPreferences(preferences);
                setOriginalPreferences(preferences);
            } else {
                // Default preferences if none exist
                const defaultPreferences = ['stripe', 'paypal', 'cashOnDelivery'];
                setPaymentPreferences(defaultPreferences);
                setOriginalPreferences(defaultPreferences);
            }
        } catch (error) {
            console.error('Error fetching payment preferences:', error);
            const defaultPreferences = ['stripe', 'paypal', 'cashOnDelivery'];
            setPaymentPreferences(defaultPreferences);
            setOriginalPreferences(defaultPreferences);
        } finally {
            setLoading(false);
        }
    };

    const togglePaymentMethod = (methodId) => {
        setPaymentPreferences(prev => {
            if (prev.includes(methodId)) {
                // Remove if already selected (but keep at least one method)
                if (prev.length > 1) {
                    return prev.filter(id => id !== methodId);
                } else {
                    toast.warning('You must accept at least one payment method');
                    return prev;
                }
            } else {
                // Add if not selected
                return [...prev, methodId];
            }
        });
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            const response = await fetch(SummaryApi.updateSellerPaymentPreferences.url, {
                method: SummaryApi.updateSellerPaymentPreferences.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    acceptedPaymentMethods: paymentPreferences
                })
            });

            const result = await response.json();

            if (result.success) {
                setOriginalPreferences([...paymentPreferences]);
                toast.success('Payment preferences updated successfully');
            } else {
                toast.error(result.message || 'Failed to update payment preferences');
            }
        } catch (error) {
            console.error('Error saving payment preferences:', error);
            toast.error('Failed to save payment preferences');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setPaymentPreferences([...originalPreferences]);
    };

    const hasChanges = JSON.stringify(paymentPreferences.sort()) !== JSON.stringify(originalPreferences.sort());

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <FaSpinner className="animate-spin text-2xl text-blue-600 mr-2" />
                <span>Loading payment settings...</span>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md">
                <div className="border-b border-gray-200 p-6">
                    <h2 className="text-2xl font-bold text-gray-800">Payment Method Settings</h2>
                    <p className="text-gray-600 mt-2">
                        Choose which payment methods you want to accept for your products. 
                        Customers will only see payment options that all sellers in their cart accept.
                    </p>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {paymentMethods.map((method) => {
                            const IconComponent = method.icon;
                            const isSelected = paymentPreferences.includes(method.id);
                            
                            return (
                                <div
                                    key={method.id}
                                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                        isSelected
                                            ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                    onClick={() => togglePaymentMethod(method.id)}
                                >
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mr-3">
                                            {isSelected ? (
                                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                                    <FaCheck className="text-white text-xs" />
                                                </div>
                                            ) : (
                                                <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                                                    <FaTimes className="text-gray-300 text-xs" />
                                                </div>
                                            )}
                                        </div>
                                        
                                        <IconComponent className={`text-2xl mr-3 ${
                                            isSelected ? 'text-green-600' : 'text-gray-400'
                                        }`} />
                                        
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 mb-1">{method.name}</h3>
                                            <p className="text-sm text-gray-600 mb-2">{method.description}</p>
                                            
                                            <div className="text-xs text-gray-500 space-y-1">
                                                <div>Processing Fee: {method.processingFee}</div>
                                                <div>Payout Time: {method.payoutTime}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Selected methods summary */}
                    <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">Currently Accepting:</h3>
                        <div className="flex flex-wrap gap-2">
                            {paymentPreferences.map(methodId => {
                                const method = paymentMethods.find(m => m.id === methodId);
                                return method ? (
                                    <span
                                        key={methodId}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                    >
                                        <method.icon className="mr-1 text-xs" />
                                        {method.name}
                                    </span>
                                ) : null;
                            })}
                        </div>
                        {paymentPreferences.length === 0 && (
                            <p className="text-blue-600 text-sm">No payment methods selected</p>
                        )}
                    </div>

                    {/* Action buttons */}
                    {hasChanges && (
                        <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
                            <button
                                onClick={handleReset}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Reset
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || paymentPreferences.length === 0}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {saving ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <FaSave className="mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Important Notes:</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Customers can only use payment methods accepted by ALL sellers in their cart</li>
                    <li>• Changes apply to all your current and future products</li>
                    <li>• You must accept at least one payment method</li>
                    <li>• Payment processing fees are deducted automatically</li>
                </ul>
            </div>
        </div>
    );
};

export default SellerPaymentSettings;
