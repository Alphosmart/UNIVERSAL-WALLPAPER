import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
    FaCreditCard, 
    FaPaypal, 
    FaUniversity, 
    FaBitcoin,
    FaMoneyBillWave,
    FaCheck,
    FaTimes,
    FaSave,
    FaSpinner,
    FaExclamationTriangle,
    FaCog,
    FaEye,
    FaEyeSlash,
    FaKey,
    FaPercentage
} from 'react-icons/fa';
import SummaryApi from '../common';

const PaymentConfiguration = () => {
    const user = useSelector(state => state?.user?.user);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('methods');
    const [showSecrets, setShowSecrets] = useState({});

    // Payment configuration state
    const [paymentConfig, setPaymentConfig] = useState({
        methods: {
            stripe: {
                enabled: true,
                name: 'Credit/Debit Cards',
                description: 'Accept all major credit and debit cards',
                processingFee: 2.9,
                additionalFee: 0.30,
                currency: 'USD',
                testMode: true,
                publicKey: '',
                secretKey: '',
                webhookSecret: '',
                supportedCountries: ['US', 'CA', 'GB', 'AU'],
                capabilities: ['instant_transfer', 'refunds', 'recurring']
            },
            paypal: {
                enabled: true,
                name: 'PayPal',
                description: 'Pay with PayPal account or PayPal Credit',
                processingFee: 3.4,
                additionalFee: 0.30,
                currency: 'USD',
                testMode: true,
                clientId: '',
                clientSecret: '',
                supportedCountries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR'],
                capabilities: ['buyer_protection', 'refunds', 'recurring']
            },
            paystack: {
                enabled: false,
                name: 'Paystack',
                description: 'African payment gateway supporting multiple methods',
                processingFee: 1.5,
                additionalFee: 100,
                currency: 'NGN',
                testMode: true,
                publicKey: '',
                secretKey: '',
                supportedCountries: ['NG', 'GH', 'ZA', 'KE'],
                capabilities: ['bank_transfer', 'ussd', 'qr_code', 'mobile_money']
            },
            flutterwave: {
                enabled: false,
                name: 'Flutterwave',
                description: 'Pan-African payment platform',
                processingFee: 1.4,
                additionalFee: 0,
                currency: 'NGN',
                testMode: true,
                publicKey: '',
                secretKey: '',
                encryptionKey: '',
                supportedCountries: ['NG', 'GH', 'KE', 'UG', 'ZA'],
                capabilities: ['bank_transfer', 'ussd', 'mobile_money', 'cards']
            },
            cashOnDelivery: {
                enabled: true,
                name: 'Cash on Delivery',
                description: 'Pay when your order is delivered',
                processingFee: 0,
                additionalFee: 50,
                currency: 'NGN',
                maxAmount: 50000,
                availableCountries: ['NG', 'GH'],
                deliveryAreas: ['Lagos', 'Abuja', 'Port Harcourt', 'Kano'],
                verificationRequired: true
            },
            bankTransfer: {
                enabled: true,
                name: 'Bank Transfer',
                description: 'Direct bank transfer payment',
                processingFee: 0,
                additionalFee: 0,
                currency: 'NGN',
                bankAccounts: [
                    {
                        bankName: 'First Bank of Nigeria',
                        accountName: 'Universal Wallpaper Ltd',
                        accountNumber: '1234567890',
                        sortCode: '011151003'
                    }
                ],
                autoVerification: false,
                verificationTimeframe: 24
            },
            cryptocurrency: {
                enabled: false,
                name: 'Cryptocurrency',
                description: 'Bitcoin, Ethereum, and other digital currencies',
                processingFee: 1.0,
                additionalFee: 0,
                supportedCoins: ['BTC', 'ETH', 'USDT', 'USDC'],
                wallet: {
                    btc: '',
                    eth: '',
                    usdt: '',
                    usdc: ''
                },
                autoConfirmation: 3,
                network: 'mainnet'
            }
        },
        general: {
            defaultCurrency: 'NGN',
            minimumAmount: 100,
            maximumAmount: 1000000,
            commission: {
                percentage: 2.5,
                flatFee: 0,
                sellerPaysCommission: true
            },
            payout: {
                schedule: 'weekly',
                minimumPayout: 1000,
                payoutDay: 'friday',
                autoPayouts: true
            },
            refunds: {
                enabled: true,
                timeframe: 7,
                autoRefunds: false,
                refundPolicy: 'Returns accepted within 7 days of delivery'
            },
            notifications: {
                paymentSuccess: true,
                paymentFailure: true,
                payoutProcessed: true,
                refundIssued: true
            }
        }
    });

    // Tab configuration
    const tabs = [
        { id: 'methods', label: 'Payment Methods', icon: FaCreditCard },
        { id: 'general', label: 'General Settings', icon: FaCog },
        { id: 'commission', label: 'Commission & Fees', icon: FaPercentage },
        { id: 'payouts', label: 'Payouts', icon: FaMoneyBillWave },
        { id: 'security', label: 'Security', icon: FaKey }
    ];

    // Payment method icons
    const paymentIcons = {
        stripe: FaCreditCard,
        paypal: FaPaypal,
        paystack: FaCreditCard,
        flutterwave: FaCreditCard,
        cashOnDelivery: FaMoneyBillWave,
        bankTransfer: FaUniversity,
        cryptocurrency: FaBitcoin
    };

    useEffect(() => {
        fetchPaymentConfiguration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchPaymentConfiguration = async () => {
        try {
            setLoading(true);
            const response = await fetch(SummaryApi.adminPaymentConfig?.url || `${SummaryApi.baseURL}/api/admin/payment-config`, {
                method: 'GET',
                credentials: 'include'
            });

            const data = await response.json();
            
            if (data.success) {
                setPaymentConfig(data.data || paymentConfig);
            }
        } catch (error) {
            console.error('Error fetching payment configuration:', error);
            toast.error('Failed to load payment configuration');
        } finally {
            setLoading(false);
        }
    };

    const savePaymentConfiguration = async () => {
        try {
            setSaving(true);
            const response = await fetch(SummaryApi.adminPaymentConfig?.url || `${SummaryApi.baseURL}/api/admin/payment-config`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(paymentConfig)
            });

            const data = await response.json();
            
            if (data.success) {
                toast.success('Payment configuration saved successfully');
            } else {
                toast.error(data.message || 'Failed to save payment configuration');
            }
        } catch (error) {
            console.error('Error saving payment configuration:', error);
            toast.error('Failed to save payment configuration');
        } finally {
            setSaving(false);
        }
    };

    const togglePaymentMethod = (methodId) => {
        setPaymentConfig(prev => ({
            ...prev,
            methods: {
                ...prev.methods,
                [methodId]: {
                    ...prev.methods[methodId],
                    enabled: !prev.methods[methodId].enabled
                }
            }
        }));
    };

    const updatePaymentMethod = (methodId, field, value) => {
        setPaymentConfig(prev => ({
            ...prev,
            methods: {
                ...prev.methods,
                [methodId]: {
                    ...prev.methods[methodId],
                    [field]: value
                }
            }
        }));
    };

    const updateGeneralSetting = (section, field, value) => {
        setPaymentConfig(prev => ({
            ...prev,
            general: {
                ...prev.general,
                [section]: typeof prev.general[section] === 'object' ? {
                    ...prev.general[section],
                    [field]: value
                } : value
            }
        }));
    };

    const toggleSecretVisibility = (methodId, field) => {
        setShowSecrets(prev => ({
            ...prev,
            [`${methodId}_${field}`]: !prev[`${methodId}_${field}`]
        }));
    };

    // Check if user is admin
    if (user?.role !== 'ADMIN') {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center">
                        <FaExclamationTriangle className="text-red-600 text-2xl mr-4" />
                        <div>
                            <h1 className="text-xl font-bold text-red-800 mb-2">Access Denied</h1>
                            <p className="text-red-700">
                                Only administrators can access payment configuration. 
                                Please contact an administrator if you need to manage payment settings.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading payment configuration...</p>
                </div>
            </div>
        );
    }

    const renderPaymentMethodCard = (methodId, method) => {
        const Icon = paymentIcons[methodId];
        
        return (
            <div key={methodId} className={`bg-white rounded-lg shadow-md border-2 transition-all ${
                method.enabled ? 'border-green-200 bg-green-50' : 'border-gray-200'
            }`}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <Icon className={`text-2xl ${method.enabled ? 'text-green-600' : 'text-gray-400'}`} />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{method.name}</h3>
                                <p className="text-sm text-gray-600">{method.description}</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={method.enabled}
                                onChange={() => togglePaymentMethod(methodId)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    {method.enabled && (
                        <div className="space-y-4">
                            {/* Processing Fees */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Processing Fee (%)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={method.processingFee}
                                        onChange={(e) => updatePaymentMethod(methodId, 'processingFee', parseFloat(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Additional Fee ({method.currency})
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={method.additionalFee}
                                        onChange={(e) => updatePaymentMethod(methodId, 'additionalFee', parseFloat(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* API Keys for online payment methods */}
                            {['stripe', 'paypal', 'paystack', 'flutterwave'].includes(methodId) && (
                                <div className="space-y-3">
                                    <h4 className="font-medium text-gray-800">API Configuration</h4>
                                    
                                    {/* Test Mode Toggle */}
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            id={`${methodId}_testMode`}
                                            checked={method.testMode}
                                            onChange={(e) => updatePaymentMethod(methodId, 'testMode', e.target.checked)}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor={`${methodId}_testMode`} className="text-sm text-gray-700">
                                            Test Mode (Sandbox)
                                        </label>
                                    </div>

                                    {/* Public Key */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {methodId === 'paypal' ? 'Client ID' : 'Public Key'}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showSecrets[`${methodId}_publicKey`] ? 'text' : 'password'}
                                                value={method.publicKey || method.clientId || ''}
                                                onChange={(e) => updatePaymentMethod(methodId, methodId === 'paypal' ? 'clientId' : 'publicKey', e.target.value)}
                                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder={`Enter ${methodId === 'paypal' ? 'Client ID' : 'Public Key'}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => toggleSecretVisibility(methodId, 'publicKey')}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            >
                                                {showSecrets[`${methodId}_publicKey`] ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Secret Key */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {methodId === 'paypal' ? 'Client Secret' : 'Secret Key'}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showSecrets[`${methodId}_secretKey`] ? 'text' : 'password'}
                                                value={method.secretKey || method.clientSecret || ''}
                                                onChange={(e) => updatePaymentMethod(methodId, methodId === 'paypal' ? 'clientSecret' : 'secretKey', e.target.value)}
                                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder={`Enter ${methodId === 'paypal' ? 'Client Secret' : 'Secret Key'}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => toggleSecretVisibility(methodId, 'secretKey')}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            >
                                                {showSecrets[`${methodId}_secretKey`] ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Additional fields for specific providers */}
                                    {methodId === 'stripe' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Webhook Secret
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showSecrets[`${methodId}_webhookSecret`] ? 'text' : 'password'}
                                                    value={method.webhookSecret || ''}
                                                    onChange={(e) => updatePaymentMethod(methodId, 'webhookSecret', e.target.value)}
                                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Enter Webhook Secret"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => toggleSecretVisibility(methodId, 'webhookSecret')}
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                >
                                                    {showSecrets[`${methodId}_webhookSecret`] ? <FaEyeSlash /> : <FaEye />}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {methodId === 'flutterwave' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Encryption Key
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showSecrets[`${methodId}_encryptionKey`] ? 'text' : 'password'}
                                                    value={method.encryptionKey || ''}
                                                    onChange={(e) => updatePaymentMethod(methodId, 'encryptionKey', e.target.value)}
                                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Enter Encryption Key"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => toggleSecretVisibility(methodId, 'encryptionKey')}
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                >
                                                    {showSecrets[`${methodId}_encryptionKey`] ? <FaEyeSlash /> : <FaEye />}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Cash on Delivery specific settings */}
                            {methodId === 'cashOnDelivery' && (
                                <div className="space-y-3">
                                    <h4 className="font-medium text-gray-800">Cash on Delivery Settings</h4>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Maximum Order Amount ({method.currency})
                                        </label>
                                        <input
                                            type="number"
                                            value={method.maxAmount}
                                            onChange={(e) => updatePaymentMethod(methodId, 'maxAmount', parseFloat(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            id={`${methodId}_verification`}
                                            checked={method.verificationRequired}
                                            onChange={(e) => updatePaymentMethod(methodId, 'verificationRequired', e.target.checked)}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor={`${methodId}_verification`} className="text-sm text-gray-700">
                                            Require Phone Verification
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Bank Transfer specific settings */}
                            {methodId === 'bankTransfer' && (
                                <div className="space-y-3">
                                    <h4 className="font-medium text-gray-800">Bank Account Details</h4>
                                    {method.bankAccounts?.map((account, index) => (
                                        <div key={index} className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Bank Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={account.bankName}
                                                    onChange={(e) => {
                                                        const newAccounts = [...method.bankAccounts];
                                                        newAccounts[index].bankName = e.target.value;
                                                        updatePaymentMethod(methodId, 'bankAccounts', newAccounts);
                                                    }}
                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Account Number
                                                </label>
                                                <input
                                                    type="text"
                                                    value={account.accountNumber}
                                                    onChange={(e) => {
                                                        const newAccounts = [...method.bankAccounts];
                                                        newAccounts[index].accountNumber = e.target.value;
                                                        updatePaymentMethod(methodId, 'bankAccounts', newAccounts);
                                                    }}
                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Supported Countries */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Supported Countries
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {method.supportedCountries?.map((country) => (
                                        <span key={country} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                            {country}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Capabilities */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Capabilities
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {method.capabilities?.map((capability) => (
                                        <span key={capability} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                            {capability.replace('_', ' ')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderGeneralSettings = () => (
        <div className="space-y-6">
            {/* Currency and Limits */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Limits</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Default Currency
                        </label>
                        <select
                            value={paymentConfig.general.defaultCurrency}
                            onChange={(e) => updateGeneralSetting('defaultCurrency', null, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="NGN">Nigerian Naira (NGN)</option>
                            <option value="USD">US Dollar (USD)</option>
                            <option value="EUR">Euro (EUR)</option>
                            <option value="GBP">British Pound (GBP)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Minimum Amount
                        </label>
                        <input
                            type="number"
                            value={paymentConfig.general.minimumAmount}
                            onChange={(e) => updateGeneralSetting('minimumAmount', null, parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Maximum Amount
                        </label>
                        <input
                            type="number"
                            value={paymentConfig.general.maximumAmount}
                            onChange={(e) => updateGeneralSetting('maximumAmount', null, parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Commission Settings */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Commission Structure</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Commission Percentage (%)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={paymentConfig.general.commission.percentage}
                            onChange={(e) => updateGeneralSetting('commission', 'percentage', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Flat Fee ({paymentConfig.general.defaultCurrency})
                        </label>
                        <input
                            type="number"
                            value={paymentConfig.general.commission.flatFee}
                            onChange={(e) => updateGeneralSetting('commission', 'flatFee', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="sellerPaysCommission"
                            checked={paymentConfig.general.commission.sellerPaysCommission}
                            onChange={(e) => updateGeneralSetting('commission', 'sellerPaysCommission', e.target.checked)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="sellerPaysCommission" className="ml-2 text-sm text-gray-700">
                            Seller Pays Commission
                        </label>
                    </div>
                </div>
            </div>

            {/* Payout Settings */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Payout Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Payout Schedule
                        </label>
                        <select
                            value={paymentConfig.general.payout.schedule}
                            onChange={(e) => updateGeneralSetting('payout', 'schedule', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Minimum Payout ({paymentConfig.general.defaultCurrency})
                        </label>
                        <input
                            type="number"
                            value={paymentConfig.general.payout.minimumPayout}
                            onChange={(e) => updateGeneralSetting('payout', 'minimumPayout', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Notifications</h3>
                <div className="space-y-3">
                    {Object.entries(paymentConfig.general.notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center">
                            <input
                                type="checkbox"
                                id={key}
                                checked={value}
                                onChange={(e) => updateGeneralSetting('notifications', key, e.target.checked)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor={key} className="ml-2 text-sm text-gray-700">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Configuration</h1>
                <p className="text-gray-600">Configure payment methods, fees, and processing settings for your platform</p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                                activeTab === tab.id
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            <Icon className="text-sm" />
                            <span className="text-sm font-medium">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="mb-8">
                {activeTab === 'methods' && (
                    <div>
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Payment Methods</h2>
                            <p className="text-gray-600">Enable and configure payment methods for your customers</p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {Object.entries(paymentConfig.methods).map(([methodId, method]) =>
                                renderPaymentMethodCard(methodId, method)
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'general' && renderGeneralSettings()}

                {activeTab === 'commission' && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Commission Calculator</h2>
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-blue-800">
                                Current commission: {paymentConfig.general.commission.percentage}% + 
                                {paymentConfig.general.defaultCurrency} {paymentConfig.general.commission.flatFee}
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                                For a ₦10,000 order: Commission = ₦{((10000 * paymentConfig.general.commission.percentage / 100) + paymentConfig.general.commission.flatFee).toFixed(2)}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Save Button */}
            <div className="fixed bottom-6 right-6">
                <button
                    onClick={savePaymentConfiguration}
                    disabled={saving}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                    {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                    <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
                </button>
            </div>

            {/* Status Indicators */}
            <div className="mt-8 bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Payment Methods Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(paymentConfig.methods).map(([methodId, method]) => {
                        const Icon = paymentIcons[methodId];
                        return (
                            <div key={methodId} className="flex items-center space-x-2">
                                <Icon className={`text-lg ${method.enabled ? 'text-green-600' : 'text-gray-400'}`} />
                                <span className={`text-sm ${method.enabled ? 'text-green-800' : 'text-gray-600'}`}>
                                    {method.name}
                                </span>
                                {method.enabled ? 
                                    <FaCheck className="text-green-600 text-xs" /> : 
                                    <FaTimes className="text-gray-400 text-xs" />
                                }
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PaymentConfiguration;