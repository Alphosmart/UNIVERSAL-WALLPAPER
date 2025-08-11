import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaPlus, FaEdit, FaTrash, FaGlobe, FaShippingFast, FaCog } from 'react-icons/fa';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import { getCountriesByRegion } from '../helper/geographicData';

const ShippingSettings = () => {
    const user = useSelector(state => state?.user?.user);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('zones');
    
    // Global settings state
    const [globalSettings, setGlobalSettings] = useState({
        enableShipping: true,
        defaultTaxRate: 0.08,
        currency: 'USD',
        weightUnit: 'kg',
        freeShippingGlobal: 0,
        restrictedCountries: []
    });

    // Shipping zones state
    const [shippingZones, setShippingZones] = useState([]);
    const [showZoneModal, setShowZoneModal] = useState(false);
    const [editingZone, setEditingZone] = useState(null);
    const [zoneForm, setZoneForm] = useState({
        name: '',
        description: '',
        countries: [],
        rates: [{
            name: 'Standard Shipping',
            description: '',
            calculation: 'flat_rate',
            amount: 0,
            minAmount: 0,
            maxAmount: 0,
            freeShippingThreshold: 0,
            isActive: true
        }]
    });

    const countriesByRegion = getCountriesByRegion();

    useEffect(() => {
        if (user?.role === 'ADMIN') {
            fetchShippingSettings();
        }
    }, [user]);

    const fetchShippingSettings = async () => {
        try {
            setLoading(true);
            const response = await fetch(SummaryApi.getShippingSettings.url, {
                method: SummaryApi.getShippingSettings.method,
                credentials: 'include'
            });

            const data = await response.json();
            
            if (data.success) {
                setShippingZones(data.data.zones);
                if (data.data.global) {
                    setGlobalSettings(data.data.global.globalSettings);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching shipping settings:', error);
            toast.error('Failed to fetch shipping settings');
        } finally {
            setLoading(false);
        }
    };

    const saveGlobalSettings = async () => {
        try {
            setLoading(true);
            const response = await fetch(SummaryApi.updateGlobalShippingSettings.url, {
                method: SummaryApi.updateGlobalShippingSettings.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(globalSettings)
            });

            const data = await response.json();
            
            if (data.success) {
                toast.success('Global settings updated successfully');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error updating global settings:', error);
            toast.error('Failed to update global settings');
        } finally {
            setLoading(false);
        }
    };

    const saveShippingZone = async () => {
        try {
            setLoading(true);
            
            const url = editingZone 
                ? SummaryApi.updateShippingZone.url.replace(':zoneId', editingZone._id)
                : SummaryApi.createShippingZone.url;
            
            const method = editingZone 
                ? SummaryApi.updateShippingZone.method
                : SummaryApi.createShippingZone.method;

            const response = await fetch(url, {
                method: method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(zoneForm)
            });

            const data = await response.json();
            
            if (data.success) {
                toast.success(editingZone ? 'Zone updated successfully' : 'Zone created successfully');
                fetchShippingSettings();
                setShowZoneModal(false);
                resetZoneForm();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error saving shipping zone:', error);
            toast.error('Failed to save shipping zone');
        } finally {
            setLoading(false);
        }
    };

    const deleteShippingZone = async (zoneId) => {
        if (!window.confirm('Are you sure you want to delete this shipping zone?')) {
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(SummaryApi.deleteShippingZone.url.replace(':zoneId', zoneId), {
                method: SummaryApi.deleteShippingZone.method,
                credentials: 'include'
            });

            const data = await response.json();
            
            if (data.success) {
                toast.success('Zone deleted successfully');
                fetchShippingSettings();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error deleting shipping zone:', error);
            toast.error('Failed to delete shipping zone');
        } finally {
            setLoading(false);
        }
    };

    const resetZoneForm = () => {
        setZoneForm({
            name: '',
            description: '',
            countries: [],
            rates: [{
                name: 'Standard Shipping',
                description: '',
                calculation: 'flat_rate',
                amount: 0,
                minAmount: 0,
                maxAmount: 0,
                freeShippingThreshold: 0,
                isActive: true
            }]
        });
        setEditingZone(null);
    };

    const editZone = (zone) => {
        setZoneForm({
            name: zone.name,
            description: zone.description || '',
            countries: zone.countries,
            rates: zone.rates
        });
        setEditingZone(zone);
        setShowZoneModal(true);
    };

    const addRate = () => {
        setZoneForm({
            ...zoneForm,
            rates: [...zoneForm.rates, {
                name: '',
                description: '',
                calculation: 'flat_rate',
                amount: 0,
                minAmount: 0,
                maxAmount: 0,
                freeShippingThreshold: 0,
                isActive: true
            }]
        });
    };

    const removeRate = (index) => {
        const newRates = zoneForm.rates.filter((_, i) => i !== index);
        setZoneForm({ ...zoneForm, rates: newRates });
    };

    const updateRate = (index, field, value) => {
        const newRates = [...zoneForm.rates];
        newRates[index] = { ...newRates[index], [field]: value };
        setZoneForm({ ...zoneForm, rates: newRates });
    };

    if (user?.role !== 'ADMIN') {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-red-500">Access denied. Admin privileges required.</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <FaShippingFast className="text-blue-600" />
                    Shipping Settings
                </h1>
            </div>

            {/* Tabs */}
            <div className="flex border-b mb-6">
                <button
                    onClick={() => setActiveTab('zones')}
                    className={`px-4 py-2 font-medium ${
                        activeTab === 'zones'
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                    Shipping Zones
                </button>
                <button
                    onClick={() => setActiveTab('global')}
                    className={`px-4 py-2 font-medium ${
                        activeTab === 'global'
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                    Global Settings
                </button>
            </div>

            {activeTab === 'zones' && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Shipping Zones</h2>
                        <button
                            onClick={() => setShowZoneModal(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                        >
                            <FaPlus /> Add Zone
                        </button>
                    </div>

                    <div className="grid gap-4">
                        {shippingZones.map((zone) => (
                            <div key={zone._id} className="bg-white rounded-lg shadow p-4 border">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-semibold text-lg">{zone.name}</h3>
                                        <p className="text-gray-600 text-sm">{zone.description}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                zone.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {zone.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => editZone(zone)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => deleteShippingZone(zone._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-medium mb-2">Countries ({zone.countries.length})</h4>
                                        <div className="text-sm text-gray-600 max-h-20 overflow-y-auto">
                                            {zone.countries.join(', ')}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">Shipping Rates ({zone.rates.length})</h4>
                                        <div className="space-y-1">
                                            {zone.rates.map((rate, index) => (
                                                <div key={index} className="text-sm">
                                                    <span className="font-medium">{rate.name}:</span> 
                                                    <span className="text-gray-600 ml-1">
                                                        ${rate.amount} ({rate.calculation})
                                                        {rate.freeShippingThreshold > 0 && 
                                                            ` - Free over $${rate.freeShippingThreshold}`
                                                        }
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {shippingZones.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <FaGlobe className="mx-auto text-4xl mb-4" />
                                <p>No shipping zones configured yet.</p>
                                <p className="text-sm">Add your first shipping zone to start managing shipping costs.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'global' && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <FaCog /> Global Shipping Settings
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center gap-2 mb-4">
                                <input
                                    type="checkbox"
                                    checked={globalSettings.enableShipping}
                                    onChange={(e) => setGlobalSettings({
                                        ...globalSettings,
                                        enableShipping: e.target.checked
                                    })}
                                    className="rounded"
                                />
                                <span className="font-medium">Enable Shipping</span>
                            </label>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Default Tax Rate (%)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="1"
                                    value={globalSettings.defaultTaxRate}
                                    onChange={(e) => setGlobalSettings({
                                        ...globalSettings,
                                        defaultTaxRate: parseFloat(e.target.value)
                                    })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Currency</label>
                                <select
                                    value={globalSettings.currency}
                                    onChange={(e) => setGlobalSettings({
                                        ...globalSettings,
                                        currency: e.target.value
                                    })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                >
                                    <option value="USD">USD - US Dollar</option>
                                    <option value="EUR">EUR - Euro</option>
                                    <option value="GBP">GBP - British Pound</option>
                                    <option value="CAD">CAD - Canadian Dollar</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Weight Unit</label>
                                <select
                                    value={globalSettings.weightUnit}
                                    onChange={(e) => setGlobalSettings({
                                        ...globalSettings,
                                        weightUnit: e.target.value
                                    })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                >
                                    <option value="kg">Kilograms (kg)</option>
                                    <option value="lb">Pounds (lb)</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    Global Free Shipping Threshold ($)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={globalSettings.freeShippingGlobal}
                                    onChange={(e) => setGlobalSettings({
                                        ...globalSettings,
                                        freeShippingGlobal: parseFloat(e.target.value) || 0
                                    })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    placeholder="0 = No global free shipping"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Set to 0 to disable global free shipping
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            onClick={saveGlobalSettings}
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Global Settings'}
                        </button>
                    </div>
                </div>
            )}

            {/* Zone Modal */}
            {showZoneModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b">
                            <h3 className="text-lg font-semibold">
                                {editingZone ? 'Edit Shipping Zone' : 'Add Shipping Zone'}
                            </h3>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Zone Name *</label>
                                    <input
                                        type="text"
                                        value={zoneForm.name}
                                        onChange={(e) => setZoneForm({ ...zoneForm, name: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        placeholder="e.g., North America"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Description</label>
                                    <input
                                        type="text"
                                        value={zoneForm.description}
                                        onChange={(e) => setZoneForm({ ...zoneForm, description: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        placeholder="Optional description"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Countries *</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded">
                                    {Object.entries(countriesByRegion).map(([region, countries]) => (
                                        <div key={region}>
                                            <h4 className="font-medium text-xs text-gray-600 mb-1">{region}</h4>
                                            {countries.map(country => (
                                                <label key={country} className="flex items-center gap-1 text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={zoneForm.countries.includes(country)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setZoneForm({
                                                                    ...zoneForm,
                                                                    countries: [...zoneForm.countries, country]
                                                                });
                                                            } else {
                                                                setZoneForm({
                                                                    ...zoneForm,
                                                                    countries: zoneForm.countries.filter(c => c !== country)
                                                                });
                                                            }
                                                        }}
                                                        className="rounded"
                                                    />
                                                    <span>{country}</span>
                                                </label>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium">Shipping Rates</label>
                                    <button
                                        onClick={addRate}
                                        className="text-blue-600 text-sm flex items-center gap-1 hover:underline"
                                    >
                                        <FaPlus className="text-xs" /> Add Rate
                                    </button>
                                </div>

                                {zoneForm.rates.map((rate, index) => (
                                    <div key={index} className="border border-gray-200 rounded p-4 mb-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-medium">Rate {index + 1}</h4>
                                            {zoneForm.rates.length > 1 && (
                                                <button
                                                    onClick={() => removeRate(index)}
                                                    className="text-red-600 text-sm hover:underline"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium mb-1">Rate Name</label>
                                                <input
                                                    type="text"
                                                    value={rate.name}
                                                    onChange={(e) => updateRate(index, 'name', e.target.value)}
                                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                                    placeholder="e.g., Standard Shipping"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium mb-1">Calculation Method</label>
                                                <select
                                                    value={rate.calculation}
                                                    onChange={(e) => updateRate(index, 'calculation', e.target.value)}
                                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                                >
                                                    <option value="flat_rate">Flat Rate</option>
                                                    <option value="per_item">Per Item</option>
                                                    <option value="weight_based">Weight Based</option>
                                                    <option value="percentage">Percentage of Total</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium mb-1">Amount ($)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={rate.amount}
                                                    onChange={(e) => updateRate(index, 'amount', parseFloat(e.target.value) || 0)}
                                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium mb-1">Free Shipping Threshold ($)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={rate.freeShippingThreshold}
                                                    onChange={(e) => updateRate(index, 'freeShippingThreshold', parseFloat(e.target.value) || 0)}
                                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                                    placeholder="0 = No free shipping"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={rate.isActive}
                                                    onChange={(e) => updateRate(index, 'isActive', e.target.checked)}
                                                    className="rounded"
                                                />
                                                <span className="text-sm">Active</span>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 border-t flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowZoneModal(false);
                                    resetZoneForm();
                                }}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveShippingZone}
                                disabled={loading || !zoneForm.name || zoneForm.countries.length === 0}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : (editingZone ? 'Update Zone' : 'Create Zone')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShippingSettings;
