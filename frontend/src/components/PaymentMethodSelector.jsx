import React, { useState, useEffect } from 'react';
import { 
    FaCreditCard, 
    FaPaypal, 
    FaMoneyBillWave, 
    FaUniversity, 
    FaBitcoin,
    FaSpinner,
    FaExclamationTriangle,
    FaInfoCircle
} from 'react-icons/fa';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const PaymentMethodSelector = ({ 
    cartItems, 
    shippingAddress, 
    selectedPaymentMethod, 
    onPaymentMethodChange 
}) => {
    const [availablePaymentMethods, setAvailablePaymentMethods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sellerGroups, setSellerGroups] = useState([]);

    const paymentIcons = {
        stripe: FaCreditCard,
        paypal: FaPaypal,
        cashOnDelivery: FaMoneyBillWave,
        bankTransfer: FaUniversity,
        cryptocurrency: FaBitcoin
    };

    useEffect(() => {
        const fetchAvailablePaymentMethods = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(SummaryApi.getAvailablePaymentMethods.url, {
                    method: SummaryApi.getAvailablePaymentMethods.method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        cartItems,
                        shippingAddress
                    })
                });

                const result = await response.json();

                if (result.success) {
                    setAvailablePaymentMethods(result.data.availablePaymentMethods);
                    setSellerGroups(result.data.sellerGroups);
                    
                    // Auto-select first available method if none selected
                    if (!selectedPaymentMethod && result.data.availablePaymentMethods.length > 0) {
                        onPaymentMethodChange(result.data.availablePaymentMethods[0].id);
                    }
                } else {
                    setError(result.message);
                    toast.error(result.message);
                }
            } catch (error) {
                console.error('Error fetching payment methods:', error);
                setError('Failed to load payment methods');
                toast.error('Failed to load payment methods');
            } finally {
                setLoading(false);
            }
        };

        fetchAvailablePaymentMethods();
    }, [cartItems, shippingAddress, selectedPaymentMethod, onPaymentMethodChange]);

    const handlePaymentMethodSelect = (paymentMethodId) => {
        onPaymentMethodChange(paymentMethodId);
    };

    const getPaymentMethodDescription = (method) => {
        const descriptions = {
            processingFee: method.processingFee ? `${method.processingFee}% processing fee` : null,
            additionalFee: method.additionalFee ? `$${method.additionalFee} additional fee` : null,
            processingDays: method.processingDays ? `${method.processingDays} business days` : null,
            supportedCoins: method.supportedCoins ? `Supports: ${method.supportedCoins.join(', ')}` : null
        };

        return Object.values(descriptions).filter(Boolean).join(' • ');
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Method</h3>
                <div className="flex items-center justify-center py-8">
                    <FaSpinner className="animate-spin text-2xl text-blue-600 mr-2" />
                    <span className="text-gray-600">Loading payment methods...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Method</h3>
                <div className="flex items-center justify-center py-8 text-red-600">
                    <FaExclamationTriangle className="text-xl mr-2" />
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    if (availablePaymentMethods.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Method</h3>
                <div className="flex items-center justify-center py-8 text-yellow-600">
                    <FaExclamationTriangle className="text-xl mr-2" />
                    <span>No payment methods available for your cart items and location</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Payment Method</h3>
            
            {/* Payment method options */}
            <div className="space-y-3 mb-6">
                {availablePaymentMethods.map((method) => {
                    const IconComponent = paymentIcons[method.id] || FaCreditCard;
                    const isSelected = selectedPaymentMethod === method.id;
                    
                    return (
                        <div
                            key={method.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                isSelected
                                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                            onClick={() => handlePaymentMethodSelect(method.id)}
                        >
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id={method.id}
                                    name="paymentMethod"
                                    value={method.id}
                                    checked={isSelected}
                                    onChange={() => handlePaymentMethodSelect(method.id)}
                                    className="mr-3 text-blue-600"
                                />
                                
                                <IconComponent className={`text-xl mr-3 ${
                                    isSelected ? 'text-blue-600' : 'text-gray-400'
                                }`} />
                                
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium text-gray-800">{method.name}</h4>
                                        {method.processingFee && (
                                            <span className="text-sm text-gray-500">
                                                {method.processingFee}% fee
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                                    
                                    {getPaymentMethodDescription(method) && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            {getPaymentMethodDescription(method)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Seller information */}
            {sellerGroups.length > 1 && (
                <div className="border-t pt-4">
                    <div className="flex items-center mb-3">
                        <FaInfoCircle className="text-blue-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">
                            Multiple Sellers in Cart
                        </span>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-700 mb-2">
                            Your cart contains items from {sellerGroups.length} different sellers. 
                            Only payment methods accepted by all sellers are shown.
                        </p>
                        <div className="space-y-1">
                            {sellerGroups.map((group, index) => (
                                <div key={index} className="text-xs text-blue-600">
                                    <span className="font-medium">{group.seller.name}</span>
                                    <span className="text-blue-500"> - {group.productCount} item(s)</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Payment method specific information */}
            {selectedPaymentMethod === 'cashOnDelivery' && (
                <div className="border-t pt-4">
                    <div className="bg-yellow-50 p-3 rounded-lg">
                        <div className="flex items-start">
                            <FaInfoCircle className="text-yellow-500 mr-2 mt-0.5" />
                            <div className="text-sm text-yellow-700">
                                <p className="font-medium mb-1">Cash on Delivery Instructions:</p>
                                <ul className="text-xs space-y-1">
                                    <li>• Have exact amount ready</li>
                                    <li>• Payment due upon delivery</li>
                                    <li>• Additional verification may be required</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedPaymentMethod === 'bankTransfer' && (
                <div className="border-t pt-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-start">
                            <FaInfoCircle className="text-blue-500 mr-2 mt-0.5" />
                            <div className="text-sm text-blue-700">
                                <p className="font-medium mb-1">Bank Transfer Instructions:</p>
                                <p className="text-xs">
                                    Bank details will be provided after order confirmation. 
                                    Payment processing may take 2-3 business days.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentMethodSelector;
