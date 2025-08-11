import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const SiteContentManagement = () => {
    const [contentData, setContentData] = useState({
        errorPage: {
            title: "404",
            heading: "Oops! Page Not Found",
            description: "The page you're looking for doesn't exist or has been moved.",
            quickLinks: [
                { label: "Help Center", path: "/help-center" },
                { label: "Contact Us", path: "/contact-us" },
                { label: "Track Order", path: "/track-order" },
                { label: "Returns", path: "/returns-refunds" }
            ]
        },
        contactUs: {
            title: "Contact Us",
            subtitle: "We're here to help! Get in touch with our team for any questions, support, or feedback.",
            businessInfo: {
                address: "123 E-Commerce Street\nBusiness District\nCity, State 12345",
                phone: "+1 (555) 123-4567",
                email: "support@ashamsmart.com",
                hours: "Mon-Fri 9am-6pm"
            },
            responseInfo: {
                emailResponse: "24-48 hours",
                phoneHours: "Mon-Fri 9AM-6PM",
                liveChatHours: "Mon-Fri 9AM-6PM"
            }
        },
        siteSettings: {
            siteName: "AshAmSmart",
            siteDescription: "Your trusted e-commerce marketplace for quality products",
            supportEmail: "support@ashamsmart.com",
            maintenanceMode: false
        }
    });

    const [activeTab, setActiveTab] = useState('errorPage');
    const [isLoading, setIsLoading] = useState(false);

    // Load content data from backend
    useEffect(() => {
        const loadContentData = async () => {
            try {
                const response = await fetch(SummaryApi.getAllSiteContent.url, {
                    method: SummaryApi.getAllSiteContent.method,
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();
                
                if (data.success && data.data && Object.keys(data.data).length > 0) {
                    setContentData(prev => ({ ...prev, ...data.data }));
                    console.log('Content data loaded from backend');
                } else {
                    console.log('Using default content data');
                }
            } catch (error) {
                console.error('Error loading content data:', error);
                toast.error('Failed to load content data');
            }
        };

        loadContentData();
    }, []);

    const handleSave = async (section) => {
        setIsLoading(true);
        try {
            const response = await fetch(SummaryApi.updateSiteContent.url, {
                method: SummaryApi.updateSiteContent.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    section, 
                    data: contentData[section] 
                })
            });

            const result = await response.json();
            
            if (result.success) {
                toast.success(`${section} content updated successfully!`);
                console.log(`Saved ${section}:`, result.data);
            } else {
                toast.error(result.message || 'Failed to save content');
            }
        } catch (error) {
            toast.error('Failed to save content');
            console.error('Save error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateContentData = (section, field, value) => {
        setContentData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const updateNestedContentData = (section, parentField, field, value) => {
        setContentData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [parentField]: {
                    ...prev[section][parentField],
                    [field]: value
                }
            }
        }));
    };

    const updateQuickLink = (index, field, value) => {
        setContentData(prev => ({
            ...prev,
            errorPage: {
                ...prev.errorPage,
                quickLinks: prev.errorPage.quickLinks.map((link, i) => 
                    i === index ? { ...link, [field]: value } : link
                )
            }
        }));
    };

    const addQuickLink = () => {
        setContentData(prev => ({
            ...prev,
            errorPage: {
                ...prev.errorPage,
                quickLinks: [...prev.errorPage.quickLinks, { label: "", path: "" }]
            }
        }));
    };

    const removeQuickLink = (index) => {
        setContentData(prev => ({
            ...prev,
            errorPage: {
                ...prev.errorPage,
                quickLinks: prev.errorPage.quickLinks.filter((_, i) => i !== index)
            }
        }));
    };

    const tabs = [
        { id: 'errorPage', label: '404 Error Page', icon: '⚠️' },
        { id: 'contactUs', label: 'Contact Us Page', icon: '📞' },
        { id: 'siteSettings', label: 'Site Settings', icon: '⚙️' }
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Site Content Management</h1>
                    <p className="text-gray-600">Manage and customize your website content, error pages, and contact information.</p>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {/* Error Page Content */}
                        {activeTab === 'errorPage' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-900">404 Error Page Settings</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Error Code
                                        </label>
                                        <input
                                            type="text"
                                            value={contentData.errorPage.title}
                                            onChange={(e) => updateContentData('errorPage', 'title', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Page Heading
                                        </label>
                                        <input
                                            type="text"
                                            value={contentData.errorPage.heading}
                                            onChange={(e) => updateContentData('errorPage', 'heading', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Error Description
                                    </label>
                                    <textarea
                                        value={contentData.errorPage.description}
                                        onChange={(e) => updateContentData('errorPage', 'description', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Quick Navigation Links
                                        </label>
                                        <button
                                            onClick={addQuickLink}
                                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Add Link
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {contentData.errorPage.quickLinks.map((link, index) => (
                                            <div key={index} className="flex items-center space-x-3">
                                                <input
                                                    type="text"
                                                    placeholder="Link Label"
                                                    value={link.label}
                                                    onChange={(e) => updateQuickLink(index, 'label', e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="/path"
                                                    value={link.path}
                                                    onChange={(e) => updateQuickLink(index, 'path', e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <button
                                                    onClick={() => removeQuickLink(index)}
                                                    className="px-3 py-2 text-red-600 hover:text-red-800"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleSave('errorPage')}
                                    disabled={isLoading}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                                >
                                    {isLoading ? 'Saving...' : 'Save Error Page Settings'}
                                </button>
                            </div>
                        )}

                        {/* Contact Us Content */}
                        {activeTab === 'contactUs' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-900">Contact Us Page Settings</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Page Title
                                        </label>
                                        <input
                                            type="text"
                                            value={contentData.contactUs.title}
                                            onChange={(e) => updateContentData('contactUs', 'title', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Support Email
                                        </label>
                                        <input
                                            type="email"
                                            value={contentData.contactUs.businessInfo.email}
                                            onChange={(e) => updateNestedContentData('contactUs', 'businessInfo', 'email', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subtitle
                                    </label>
                                    <textarea
                                        value={contentData.contactUs.subtitle}
                                        onChange={(e) => updateContentData('contactUs', 'subtitle', e.target.value)}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Business Address
                                        </label>
                                        <textarea
                                            value={contentData.contactUs.businessInfo.address}
                                            onChange={(e) => updateNestedContentData('contactUs', 'businessInfo', 'address', e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                value={contentData.contactUs.businessInfo.phone}
                                                onChange={(e) => updateNestedContentData('contactUs', 'businessInfo', 'phone', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Business Hours
                                            </label>
                                            <input
                                                type="text"
                                                value={contentData.contactUs.businessInfo.hours}
                                                onChange={(e) => updateNestedContentData('contactUs', 'businessInfo', 'hours', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleSave('contactUs')}
                                    disabled={isLoading}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                                >
                                    {isLoading ? 'Saving...' : 'Save Contact Us Settings'}
                                </button>
                            </div>
                        )}

                        {/* Site Settings */}
                        {activeTab === 'siteSettings' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-900">General Site Settings</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Site Name
                                        </label>
                                        <input
                                            type="text"
                                            value={contentData.siteSettings.siteName}
                                            onChange={(e) => updateNestedContentData('siteSettings', 'siteName', '', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Support Email
                                        </label>
                                        <input
                                            type="email"
                                            value={contentData.siteSettings.supportEmail}
                                            onChange={(e) => updateContentData('siteSettings', 'supportEmail', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Site Description
                                    </label>
                                    <textarea
                                        value={contentData.siteSettings.siteDescription}
                                        onChange={(e) => updateContentData('siteSettings', 'siteDescription', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={contentData.siteSettings.maintenanceMode}
                                            onChange={(e) => updateContentData('siteSettings', 'maintenanceMode', e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        />
                                        <span className="ml-2 text-sm font-medium text-gray-700">
                                            Enable Maintenance Mode
                                        </span>
                                    </label>
                                    <p className="text-sm text-gray-500 mt-1">
                                        When enabled, the site will show a maintenance page to non-admin users.
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleSave('siteSettings')}
                                    disabled={isLoading}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                                >
                                    {isLoading ? 'Saving...' : 'Save Site Settings'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Preview Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Preview</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">Current {activeTab} settings:</p>
                        <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-48">
                            {JSON.stringify(contentData[activeTab], null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SiteContentManagement;
