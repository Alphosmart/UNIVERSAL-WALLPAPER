import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaTruck, FaMapMarkerAlt, FaUserTie, FaBuilding } from 'react-icons/fa';
import SummaryApi from '../common';

const ShippingCompanyRegistration = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        // Basic Info
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        
        // Company Info
        companyInfo: {
            companyName: '',
            registrationNumber: '',
            licenseNumber: '',
            website: '',
            description: '',
            establishedYear: '',
            companySize: '1-10'
        },
        
        // Address
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'Nigeria'
        },
        
        // Service Areas
        serviceAreas: [{
            country: 'Nigeria',
            states: [''],
            cities: [''],
            zipCodes: ['']
        }],
        
        // Shipping Services
        shippingServices: [{
            serviceName: '',
            serviceType: 'standard',
            deliveryTime: '',
            basePrice: '',
            pricePerKm: '',
            pricePerKg: '',
            maxWeight: ''
        }],
        
        // Operating Hours
        operatingHours: {
            monday: { start: '09:00', end: '17:00', isOpen: true },
            tuesday: { start: '09:00', end: '17:00', isOpen: true },
            wednesday: { start: '09:00', end: '17:00', isOpen: true },
            thursday: { start: '09:00', end: '17:00', isOpen: true },
            friday: { start: '09:00', end: '17:00', isOpen: true },
            saturday: { start: '09:00', end: '14:00', isOpen: true },
            sunday: { start: '09:00', end: '14:00', isOpen: false }
        }
    });

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNestedChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleServiceAreaChange = (index, field, value) => {
        const newServiceAreas = [...formData.serviceAreas];
        if (field === 'states' || field === 'cities' || field === 'zipCodes') {
            newServiceAreas[index][field] = value.split(',').map(item => item.trim());
        } else {
            newServiceAreas[index][field] = value;
        }
        setFormData(prev => ({
            ...prev,
            serviceAreas: newServiceAreas
        }));
    };

    const handleShippingServiceChange = (index, field, value) => {
        const newServices = [...formData.shippingServices];
        newServices[index][field] = value;
        setFormData(prev => ({
            ...prev,
            shippingServices: newServices
        }));
    };

    const addShippingService = () => {
        setFormData(prev => ({
            ...prev,
            shippingServices: [
                ...prev.shippingServices,
                {
                    serviceName: '',
                    serviceType: 'standard',
                    deliveryTime: '',
                    basePrice: '',
                    pricePerKm: '',
                    pricePerKg: '',
                    maxWeight: ''
                }
            ]
        }));
    };

    const removeShippingService = (index) => {
        setFormData(prev => ({
            ...prev,
            shippingServices: prev.shippingServices.filter((_, i) => i !== index)
        }));
    };

    const handleOperatingHoursChange = (day, field, value) => {
        setFormData(prev => ({
            ...prev,
            operatingHours: {
                ...prev.operatingHours,
                [day]: {
                    ...prev.operatingHours[day],
                    [field]: value
                }
            }
        }));
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.password) {
            toast.error('Please fill in all required basic information');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return false;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return false;
        }

        if (!formData.companyInfo.companyName) {
            toast.error('Company name is required');
            return false;
        }

        if (formData.shippingServices.some(service => !service.serviceName || !service.basePrice)) {
            toast.error('Please fill in all shipping service details');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(SummaryApi.registerShippingCompany.url, {
                method: SummaryApi.registerShippingCompany.method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                toast.success(result.message);
                navigate('/login', { 
                    state: { 
                        message: 'Registration successful! Please login to access your dashboard.' 
                    }
                });
            } else {
                toast.error(result.message);
            }

        } catch (error) {
            console.error('Registration error:', error);
            toast.error('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <FaTruck className="text-4xl text-blue-600 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-gray-900">Join as Shipping Partner</h1>
                        <p className="text-gray-600 mt-2">Register your shipping company and start delivering to customers</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information */}
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FaUserTie className="text-blue-600" />
                                Basic Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Contact Person Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password *
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm Password *
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Company Information */}
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FaBuilding className="text-blue-600" />
                                Company Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Company Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.companyInfo.companyName}
                                        onChange={(e) => handleNestedChange('companyInfo', 'companyName', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Registration Number
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.companyInfo.registrationNumber}
                                        onChange={(e) => handleNestedChange('companyInfo', 'registrationNumber', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        License Number
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.companyInfo.licenseNumber}
                                        onChange={(e) => handleNestedChange('companyInfo', 'licenseNumber', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Website
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.companyInfo.website}
                                        onChange={(e) => handleNestedChange('companyInfo', 'website', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="https://example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Established Year
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.companyInfo.establishedYear}
                                        onChange={(e) => handleNestedChange('companyInfo', 'establishedYear', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        min="1900"
                                        max={new Date().getFullYear()}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Company Size
                                    </label>
                                    <select
                                        value={formData.companyInfo.companySize}
                                        onChange={(e) => handleNestedChange('companyInfo', 'companySize', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="1-10">1-10 employees</option>
                                        <option value="11-50">11-50 employees</option>
                                        <option value="51-200">51-200 employees</option>
                                        <option value="201-500">201-500 employees</option>
                                        <option value="500+">500+ employees</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Company Description
                                    </label>
                                    <textarea
                                        value={formData.companyInfo.description}
                                        onChange={(e) => handleNestedChange('companyInfo', 'description', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="3"
                                        placeholder="Brief description of your shipping services..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FaMapMarkerAlt className="text-blue-600" />
                                Business Address
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Street Address
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.address.street}
                                        onChange={(e) => handleNestedChange('address', 'street', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.address.city}
                                        onChange={(e) => handleNestedChange('address', 'city', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        State
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.address.state}
                                        onChange={(e) => handleNestedChange('address', 'state', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        ZIP Code
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.address.zipCode}
                                        onChange={(e) => handleNestedChange('address', 'zipCode', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Country
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.address.country}
                                        onChange={(e) => handleNestedChange('address', 'country', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Service Areas */}
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Service Areas
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        States (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.serviceAreas[0]?.states.join(', ') || ''}
                                        onChange={(e) => handleServiceAreaChange(0, 'states', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Lagos, Abuja, Port Harcourt"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cities (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.serviceAreas[0]?.cities.join(', ') || ''}
                                        onChange={(e) => handleServiceAreaChange(0, 'cities', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ikeja, Victoria Island, Lekki"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Shipping Services */}
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Shipping Services
                                </h2>
                                <button
                                    type="button"
                                    onClick={addShippingService}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                >
                                    Add Service
                                </button>
                            </div>
                            {formData.shippingServices.map((service, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 bg-white">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-medium text-gray-900">Service {index + 1}</h3>
                                        {formData.shippingServices.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeShippingService(index)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Service Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={service.serviceName}
                                                onChange={(e) => handleShippingServiceChange(index, 'serviceName', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Standard Delivery"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Service Type
                                            </label>
                                            <select
                                                value={service.serviceType}
                                                onChange={(e) => handleShippingServiceChange(index, 'serviceType', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="standard">Standard</option>
                                                <option value="express">Express</option>
                                                <option value="overnight">Overnight</option>
                                                <option value="same_day">Same Day</option>
                                                <option value="international">International</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Delivery Time
                                            </label>
                                            <input
                                                type="text"
                                                value={service.deliveryTime}
                                                onChange={(e) => handleShippingServiceChange(index, 'deliveryTime', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="2-3 days"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Base Price (₦) *
                                            </label>
                                            <input
                                                type="number"
                                                value={service.basePrice}
                                                onChange={(e) => handleShippingServiceChange(index, 'basePrice', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Price per KM (₦)
                                            </label>
                                            <input
                                                type="number"
                                                value={service.pricePerKm}
                                                onChange={(e) => handleShippingServiceChange(index, 'pricePerKm', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Max Weight (kg)
                                            </label>
                                            <input
                                                type="number"
                                                value={service.maxWeight}
                                                onChange={(e) => handleShippingServiceChange(index, 'maxWeight', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                                step="0.1"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
                            >
                                {loading ? 'Registering...' : 'Register Shipping Company'}
                            </button>
                        </div>
                    </form>

                    {/* Login Link */}
                    <div className="text-center mt-6">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingCompanyRegistration;
