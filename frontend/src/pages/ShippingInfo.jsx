import React, { useState, useEffect, useCallback } from 'react';
import { FaShippingFast, FaGlobe, FaClock, FaCheckCircle, FaInfoCircle, FaTruck } from 'react-icons/fa';
import SummaryApi from '../common';

const ShippingInfo = () => {
    const [shippingData, setShippingData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchShippingInfo = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(SummaryApi.getShippingInfo.url, {
                method: SummaryApi.getShippingInfo.method,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                setShippingData(data.data);
            } else {
                console.error('Failed to fetch shipping info:', data.message);
                // Set default data if API fails
                setShippingData(getDefaultShippingData());
            }
        } catch (error) {
            console.error('Error fetching shipping info:', error);
            // Set default data if API fails
            setShippingData(getDefaultShippingData());
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchShippingInfo();
    }, [fetchShippingInfo]);

    const getDefaultShippingData = () => ({
        global: {
            enableShipping: true,
            currency: 'USD',
            weightUnit: 'kg',
            freeShippingGlobal: 50
        },
        zones: [
            {
                name: 'Domestic',
                countries: ['United States'],
                rates: [
                    {
                        name: 'Standard Shipping',
                        description: '5-7 business days',
                        amount: 5.99,
                        freeShippingThreshold: 50
                    },
                    {
                        name: 'Express Shipping',
                        description: '2-3 business days',
                        amount: 12.99,
                        freeShippingThreshold: 100
                    }
                ]
            },
            {
                name: 'International',
                countries: ['Canada', 'United Kingdom', 'Australia'],
                rates: [
                    {
                        name: 'International Standard',
                        description: '10-15 business days',
                        amount: 15.99,
                        freeShippingThreshold: 100
                    }
                ]
            }
        ]
    });

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="text-center">
                    <FaShippingFast className="text-6xl text-blue-600 animate-bounce mx-auto mb-4" />
                    <p className="text-gray-600">Loading shipping information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <FaShippingFast className="text-6xl text-blue-600 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Shipping Information</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Learn about our shipping options, delivery times, and policies to help you choose the best option for your order.
                    </p>
                </div>

                {/* Fast Shipping Banner */}
                <div className="bg-blue-100 border border-blue-400 rounded-lg p-6 mb-8">
                    <div className="flex items-center justify-center">
                        <FaTruck className="text-blue-600 text-2xl mr-3" />
                        <h2 className="text-2xl font-semibold text-blue-800">
                            Fast Shipping Available Nationwide!
                        </h2>
                    </div>
                </div>

                {/* Shipping Options */}
                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {shippingData?.zones?.map((zone, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex items-center mb-4">
                                <FaGlobe className="text-blue-600 text-2xl mr-3" />
                                <h3 className="text-2xl font-semibold text-gray-800">{zone.name} Shipping</h3>
                            </div>
                            
                            {/* Countries */}
                            <div className="mb-4">
                                <p className="text-gray-600 mb-2">Available in:</p>
                                <div className="flex flex-wrap gap-2">
                                    {zone.countries?.slice(0, 5).map((country, idx) => (
                                        <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                            {country}
                                        </span>
                                    ))}
                                    {zone.countries?.length > 5 && (
                                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                                            +{zone.countries.length - 5} more
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Shipping Rates */}
                            <div className="space-y-4">
                                {zone.rates?.map((rate, rateIndex) => (
                                    <div key={rateIndex} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-lg font-semibold text-gray-800">{rate.name}</h4>
                                            <span className="text-xl font-bold text-blue-600">
                                                ${rate.amount?.toFixed(2) || '0.00'}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-gray-600 mb-2">
                                            <FaClock className="mr-2" />
                                            <span>{rate.description}</span>
                                        </div>
                                        {rate.freeShippingThreshold > 0 && (
                                            <div className="bg-green-50 border border-green-200 rounded p-2">
                                                <p className="text-green-700 text-sm">
                                                    <FaCheckCircle className="inline mr-1" />
                                                    Free when you spend ${rate.freeShippingThreshold} or more
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Shipping Policies */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                        <FaInfoCircle className="text-blue-600 mr-3" />
                        Shipping Policies & Information
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-3">Processing Time</h4>
                            <ul className="space-y-2 text-gray-600">
                                <li>• Orders are processed within 1-2 business days</li>
                                <li>• Orders placed after 3 PM are processed the next business day</li>
                                <li>• Weekend orders are processed on Monday</li>
                                <li>• Custom orders may require additional processing time</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-3">Shipping Restrictions</h4>
                            <ul className="space-y-2 text-gray-600">
                                <li>• We ship to most countries worldwide</li>
                                <li>• Some products may have shipping restrictions</li>
                                <li>• Remote areas may require additional shipping time</li>
                                <li>• Additional customs fees may apply for international orders</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-3">Package Tracking</h4>
                            <ul className="space-y-2 text-gray-600">
                                <li>• Tracking information is provided via email</li>
                                <li>• Track your order on our website</li>
                                <li>• Express shipments include signature confirmation</li>
                                <li>• Updates are provided throughout the shipping process</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-3">Special Handling</h4>
                            <ul className="space-y-2 text-gray-600">
                                <li>• Fragile items are packaged with extra care</li>
                                <li>• Large items may require special delivery arrangements</li>
                                <li>• Expedited shipping available for urgent orders</li>
                                <li>• Insurance available for high-value items</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-blue-50 rounded-lg p-6 mt-8 text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Need Help with Shipping?</h3>
                    <p className="text-gray-600 mb-4">
                        Have questions about shipping options or need assistance with your order?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a 
                            href="/contact-us" 
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            Contact Support
                        </a>
                        <a 
                            href="/track-order" 
                            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition duration-300"
                        >
                            Track Your Order
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingInfo;
