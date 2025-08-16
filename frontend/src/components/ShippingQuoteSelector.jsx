import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import { FaTruck, FaDollarSign, FaClock, FaStar, FaCheck, FaTimes } from 'react-icons/fa';

const ShippingQuoteSelector = ({ order, onSelectShipping, onClose }) => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedQuote, setSelectedQuote] = useState(null);

    useEffect(() => {
        const fetchShippingQuotes = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${SummaryApi.getOrderShippingQuotes.url}/${order._id}/shipping-quotes`, {
                    method: SummaryApi.getOrderShippingQuotes.method,
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setQuotes(data.data || []);
                } else {
                    toast.error('Failed to fetch shipping quotes');
                }
            } catch (error) {
                console.error('Error fetching shipping quotes:', error);
                toast.error('Failed to fetch shipping quotes');
            } finally {
                setLoading(false);
            }
        };

        if (order) {
            fetchShippingQuotes();
        }
    }, [order]);

    const refreshShippingQuotes = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${SummaryApi.getOrderShippingQuotes.url}/${order._id}/shipping-quotes`, {
                method: SummaryApi.getOrderShippingQuotes.method,
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setQuotes(data.data || []);
            } else {
                toast.error('Failed to fetch shipping quotes');
            }
        } catch (error) {
            console.error('Error fetching shipping quotes:', error);
            toast.error('Failed to fetch shipping quotes');
        } finally {
            setLoading(false);
        }
    };

    const selectShippingQuote = async () => {
        if (!selectedQuote) {
            toast.error('Please select a shipping quote');
            return;
        }

        try {
            const response = await fetch(`${SummaryApi.selectShippingQuote.url}/${order._id}/shipping`, {
                method: SummaryApi.selectShippingQuote.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    quoteId: selectedQuote._id
                })
            });

            if (response.ok) {
                toast.success('Shipping quote selected successfully!');
                onSelectShipping(selectedQuote);
                onClose();
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to select shipping quote');
            }
        } catch (error) {
            console.error('Error selecting shipping quote:', error);
            toast.error('Failed to select shipping quote');
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                            Select Shipping for Order #{order?.trackingId || order?._id?.slice(-8)}
                        </h3>
                        <p className="text-gray-600 mt-1">
                            Choose from available shipping quotes for this order
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading shipping quotes...</p>
                    </div>
                ) : quotes.length === 0 ? (
                    <div className="text-center py-8">
                        <FaTruck className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No shipping quotes available</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            No shipping companies have submitted quotes for this order yet.
                        </p>
                        <div className="mt-4">
                            <button
                                onClick={refreshShippingQuotes}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Refresh Quotes
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4 mb-6">
                            {quotes.map((quote) => (
                                <div
                                    key={quote._id}
                                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                        selectedQuote?._id === quote._id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => setSelectedQuote(quote)}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center">
                                            <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                                                selectedQuote?._id === quote._id
                                                    ? 'border-blue-500 bg-blue-500'
                                                    : 'border-gray-300'
                                            }`}>
                                                {selectedQuote?._id === quote._id && (
                                                    <FaCheck className="w-2 h-2 text-white m-0.5" />
                                                )}
                                            </div>
                                            <h4 className="text-lg font-semibold text-gray-900">
                                                {quote.shippingCompany?.companyInfo?.companyName || 'Shipping Company'}
                                            </h4>
                                        </div>
                                        <div className="flex items-center">
                                            <FaStar className="w-4 h-4 text-yellow-400 mr-1" />
                                            <span className="text-sm text-gray-600">
                                                {quote.shippingCompany?.ratings?.average?.toFixed(1) || 'N/A'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="flex items-center">
                                            <FaDollarSign className="w-4 h-4 text-green-600 mr-2" />
                                            <div>
                                                <p className="text-sm text-gray-600">Price</p>
                                                <p className="font-semibold text-green-600">
                                                    {formatCurrency(quote.price)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <FaClock className="w-4 h-4 text-blue-600 mr-2" />
                                            <div>
                                                <p className="text-sm text-gray-600">Delivery Time</p>
                                                <p className="font-semibold">
                                                    {quote.estimatedDeliveryDays} days
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <FaTruck className="w-4 h-4 text-purple-600 mr-2" />
                                            <div>
                                                <p className="text-sm text-gray-600">Company Type</p>
                                                <p className="font-semibold">
                                                    {quote.shippingCompany?.companyInfo?.companyType || 'Standard'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {quote.notes && (
                                        <div className="mt-3 p-3 bg-gray-50 rounded">
                                            <p className="text-sm text-gray-600">
                                                <strong>Notes:</strong> {quote.notes}
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-3 flex justify-between items-center">
                                        <div className="text-sm text-gray-500">
                                            Quote submitted: {formatDate(quote.createdAt)}
                                        </div>
                                        {quote.shippingCompany?.stats?.completedDeliveries > 0 && (
                                            <div className="text-sm text-gray-600">
                                                {quote.shippingCompany.stats.completedDeliveries} completed deliveries
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end space-x-3 pt-4 border-t">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={selectShippingQuote}
                                disabled={!selectedQuote}
                                className={`px-4 py-2 rounded-md ${
                                    selectedQuote
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                Select Shipping Partner
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ShippingQuoteSelector;
