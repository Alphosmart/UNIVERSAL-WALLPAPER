import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const SiteContentManagement = () => {
    const isLoadingData = useRef(false);
    const [contentData, setContentData] = useState({
        homePage: {
            hero: {
                title: "Transform Your Space with Premium Wallpapers",
                subtitle: "Discover thousands of high-quality wallpapers from trusted sellers worldwide. From modern minimalist to classic elegant designs.",
                primaryButtonText: "Shop Now",
                primaryButtonLink: "/products",
                secondaryButtonText: "Learn More",
                secondaryButtonLink: "/about-us"
            }
        },
        aboutUs: {
            hero: {
                title: "About Universal Wallpaper",
                subtitle: "Your premier destination for high-quality wallpapers and home décor solutions",
                description: "We connect homeowners with the world's finest wallpaper creators and suppliers, making it easy to transform any space into something extraordinary."
            }
        },
        footer: {
            companyInfo: {
                name: "Universal Wallpaper",
                description: "Your premier destination for high-quality wallpapers and home décor solutions.",
                address: "123 Design Street, Creative District, NY 10001",
                phone: "+1 (555) 123-4567",
                email: "info@universalwallpaper.com"
            },
            businessHours: {
                title: "Business Hours",
                hours: [
                    { days: "Monday - Friday", time: "9:00 AM - 6:00 PM" },
                    { days: "Saturday", time: "10:00 AM - 4:00 PM" },
                    { days: "Sunday", time: "Closed" }
                ]
            },
            socialMedia: [
                { platform: "Facebook", url: "https://facebook.com/universalwallpaper", icon: "FaFacebook", color: "#1877F2" },
                { platform: "Instagram", url: "https://instagram.com/universalwallpaper", icon: "FaInstagram", color: "#E4405F" },
                { platform: "Twitter", url: "https://twitter.com/universalwallpaper", icon: "FaTwitter", color: "#1DA1F2" },
                { platform: "Pinterest", url: "https://pinterest.com/universalwallpaper", icon: "FaPinterest", color: "#BD081C" }
            ],
            quickLinks: {
                shop: [
                    { label: "All Products", path: "/products" },
                    { label: "Categories", path: "/categories" },
                    { label: "New Arrivals", path: "/new-arrivals" },
                    { label: "Sale Items", path: "/sale" }
                ],
                support: [
                    { label: "Help Center", path: "/help-center" },
                    { label: "Contact Us", path: "/contact-us" },
                    { label: "Track Order", path: "/track-order" },
                    { label: "Returns", path: "/returns-refunds" }
                ],
                company: [
                    { label: "About Us", path: "/about-us" },
                    { label: "Privacy Policy", path: "/privacy-policy" },
                    { label: "Terms of Service", path: "/terms-of-service" },
                    { label: "Cookie Policy", path: "/cookie-policy" }
                ]
            }
        },
        header: {
            logo: {
                text: "Universal Wallpaper",
                tagline: "Transform Your Space"
            },
            navigation: {
                mainMenu: [
                    { label: "Home", path: "/", order: 1 },
                    { label: "Products", path: "/products", order: 2 },
                    { label: "Categories", path: "/categories", order: 3 },
                    { label: "About", path: "/about-us", order: 4 },
                    { label: "Contact", path: "/contact-us", order: 5 }
                ]
            },
            announcements: [
                {
                    id: 1,
                    enabled: false,
                    text: "🚀 Fast shipping available nationwide! Order today",
                    link: "/products",
                    backgroundColor: "#3B82F6",
                    textColor: "#FFFFFF",
                    order: 1
                }
            ],
            searchPlaceholder: "Search for wallpapers, styles, colors..."
        },
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
            siteName: "Universal Wallpaper",
            siteDescription: "Your premier destination for high-quality wallpapers and home décor solutions",
            supportEmail: "support@universalwallpaper.com",
            maintenanceMode: false
        },
        maintenancePage: {
            title: "Under Maintenance",
            message: "We're currently performing scheduled maintenance to improve your experience. We'll be back online shortly.",
            estimatedDowntime: "1-2 hours",
            statusMessage: "Service will resume automatically",
            contactEmail: "support@universalwallpaper.com",
            progressPercentage: 45,
            showProgressBar: true,
            showContactInfo: true,
            backgroundColor: "from-blue-50 to-indigo-100",
            buttonText: "Refresh Page"
        }
    });

    const [activeTab, setActiveTab] = useState(() => {
        // Check if there's a saved tab preference or URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');
        const savedTab = localStorage.getItem('siteContentActiveTab');
        
        // Priority: URL param > saved preference > default
        if (tabParam && ['homePage', 'aboutUs', 'footer', 'contactUs', 'header', 'siteSettings', 'maintenancePage'].includes(tabParam)) {
            return tabParam;
        }
        if (savedTab && ['homePage', 'aboutUs', 'footer', 'contactUs', 'header', 'siteSettings', 'maintenancePage'].includes(savedTab)) {
            return savedTab;
        }
        return 'homePage';
    });
    const [isLoading, setIsLoading] = useState(false);

    // Load content data from backend only once
    useEffect(() => {
        if (isLoadingData.current) return;
        isLoadingData.current = true;
        
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
                }
            } catch (error) {
                console.error('Error loading content data:', error);
                toast.error('Failed to load content data');
            }
        };

        loadContentData();
    }, []);

    // Handle browser back/forward navigation to sync tab state
    useEffect(() => {
        const handlePopState = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const tabParam = urlParams.get('tab');
            if (tabParam && ['homePage', 'aboutUs', 'footer', 'contactUs', 'header', 'siteSettings', 'maintenancePage'].includes(tabParam)) {
                setActiveTab(tabParam);
                localStorage.setItem('siteContentActiveTab', tabParam);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const handleSave = async (section) => {
        setIsLoading(true);
        try {
            console.log('Saving section:', section);
            console.log('Data to save:', contentData[section]);
            
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
            console.log('Server response:', result);
            
            if (result.success) {
                toast.success(`${section} content updated successfully!`);
                console.log(`Saved ${section}:`, result.data);
                
                // Set flag in sessionStorage to force refetch when navigating to public pages
                sessionStorage.setItem('siteContentJustUpdated', 'true');
                
                // Dispatch custom event to notify all components using useSiteContent to refetch
                window.dispatchEvent(new CustomEvent('siteContentUpdated', { 
                    detail: { section, data: result.data } 
                }));
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

    // Custom tab handler to persist tab state and update URL
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        // Save to localStorage to persist across page refreshes
        localStorage.setItem('siteContentActiveTab', tabId);
        
        // Update URL without triggering page reload
        const url = new URL(window.location);
        url.searchParams.set('tab', tabId);
        window.history.replaceState({}, '', url);
    };

    const tabs = [
        { id: 'homePage', label: 'Home Page', icon: '🏠' },
        { id: 'aboutUs', label: 'About Us', icon: 'ℹ️' },
        { id: 'footer', label: 'Footer', icon: '📄' },
        { id: 'header', label: 'Header & Navigation', icon: '🧭' },
        { id: 'contactUs', label: 'Contact Us Page', icon: '📞' },
        { id: 'errorPage', label: '404 Error Page', icon: '⚠️' },
        { id: 'siteSettings', label: 'Site Settings', icon: '⚙️' },
        { id: 'maintenancePage', label: 'Maintenance Page', icon: '🔧' }
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
                                    onClick={() => handleTabChange(tab.id)}
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
                                            onChange={(e) => updateContentData('siteSettings', 'siteName', e.target.value)}
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

                        {/* Maintenance Page Content */}
                        {activeTab === 'maintenancePage' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-900">Maintenance Page Settings</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Page Title
                                        </label>
                                        <input
                                            type="text"
                                            value={contentData.maintenancePage.title}
                                            onChange={(e) => updateContentData('maintenancePage', 'title', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Under Maintenance"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Estimated Downtime
                                        </label>
                                        <input
                                            type="text"
                                            value={contentData.maintenancePage.estimatedDowntime}
                                            onChange={(e) => updateContentData('maintenancePage', 'estimatedDowntime', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="1-2 hours"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Main Message
                                        </label>
                                        <textarea
                                            value={contentData.maintenancePage.message}
                                            onChange={(e) => updateContentData('maintenancePage', 'message', e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="We're currently performing scheduled maintenance..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status Message
                                        </label>
                                        <input
                                            type="text"
                                            value={contentData.maintenancePage.statusMessage}
                                            onChange={(e) => updateContentData('maintenancePage', 'statusMessage', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Service will resume automatically"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Contact Email
                                        </label>
                                        <input
                                            type="email"
                                            value={contentData.maintenancePage.contactEmail}
                                            onChange={(e) => updateContentData('maintenancePage', 'contactEmail', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="support@yourcompany.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Progress Percentage (0-100)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={contentData.maintenancePage.progressPercentage}
                                            onChange={(e) => updateContentData('maintenancePage', 'progressPercentage', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="45"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Button Text
                                            <span className="text-xs text-amber-600 ml-1">(Read-only)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={contentData.maintenancePage.buttonText}
                                            readOnly
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                                            placeholder="Refresh Page"
                                            title="This field is not editable"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900">Display Options</h3>
                                    
                                    <div>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={contentData.maintenancePage.showProgressBar}
                                                onChange={(e) => updateContentData('maintenancePage', 'showProgressBar', e.target.checked)}
                                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                            />
                                            <span className="ml-2 text-sm font-medium text-gray-700">
                                                Show Progress Bar
                                            </span>
                                        </label>
                                    </div>

                                    <div>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={contentData.maintenancePage.showContactInfo}
                                                onChange={(e) => updateContentData('maintenancePage', 'showContactInfo', e.target.checked)}
                                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                            />
                                            <span className="ml-2 text-sm font-medium text-gray-700">
                                                Show Contact Information
                                            </span>
                                        </label>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Background Gradient
                                        </label>
                                        <select
                                            value={contentData.maintenancePage.backgroundColor}
                                            onChange={(e) => updateContentData('maintenancePage', 'backgroundColor', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="from-blue-50 to-indigo-100">Blue Gradient</option>
                                            <option value="from-gray-50 to-gray-100">Gray Gradient</option>
                                            <option value="from-orange-50 to-red-100">Orange Gradient</option>
                                            <option value="from-green-50 to-emerald-100">Green Gradient</option>
                                            <option value="from-purple-50 to-indigo-100">Purple Gradient</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleSave('maintenancePage')}
                                    disabled={isLoading}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                                >
                                    {isLoading ? 'Saving...' : 'Save Maintenance Page Settings'}
                                </button>
                            </div>
                        )}

                        {/* Home Page Content */}
                        {activeTab === 'homePage' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-900">Home Page Content</h2>
                                
                                {/* Hero Section */}
                                <div className="border rounded-lg p-4">
                                    <h3 className="text-lg font-medium text-gray-800 mb-4">Hero Section</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Hero Title</label>
                                            <input
                                                type="text"
                                                value={contentData.homePage?.hero?.title || ''}
                                                onChange={(e) => updateNestedContentData('homePage', 'hero', 'title', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Hero Subtitle</label>
                                            <textarea
                                                value={contentData.homePage?.hero?.subtitle || ''}
                                                onChange={(e) => updateNestedContentData('homePage', 'hero', 'subtitle', e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Primary Button Text
                                                    <span className="text-xs text-amber-600 ml-1">(Read-only)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={contentData.homePage?.hero?.primaryButtonText || ''}
                                                    readOnly
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                                                    title="This field is not editable"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Primary Button Link
                                                    <span className="text-xs text-amber-600 ml-1">(Read-only)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={contentData.homePage?.hero?.primaryButtonLink || ''}
                                                    readOnly
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                                                    title="This field is not editable"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Secondary Button Text
                                                    <span className="text-xs text-amber-600 ml-1">(Read-only)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={contentData.homePage?.hero?.secondaryButtonText || ''}
                                                    readOnly
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                                                    title="This field is not editable"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Secondary Button Link
                                                    <span className="text-xs text-amber-600 ml-1">(Read-only)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={contentData.homePage?.hero?.secondaryButtonLink || ''}
                                                    readOnly
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                                                    title="This field is not editable"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleSave('homePage')}
                                    disabled={isLoading}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                                >
                                    {isLoading ? 'Saving...' : 'Save Home Page Content'}
                                </button>
                            </div>
                        )}

                        {/* About Us Content */}
                        {activeTab === 'aboutUs' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-900">About Us Page Content</h2>
                                
                                {/* Hero Section */}
                                <div className="border rounded-lg p-4">
                                    <h3 className="text-lg font-medium text-gray-800 mb-4">Hero Section</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                                            <input
                                                type="text"
                                                value={contentData.aboutUs?.hero?.title || ''}
                                                onChange={(e) => updateNestedContentData('aboutUs', 'hero', 'title', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                            <textarea
                                                value={contentData.aboutUs?.hero?.description || ''}
                                                onChange={(e) => updateNestedContentData('aboutUs', 'hero', 'description', e.target.value)}
                                                rows={4}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleSave('aboutUs')}
                                    disabled={isLoading}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                                >
                                    {isLoading ? 'Saving...' : 'Save About Us Content'}
                                </button>
                            </div>
                        )}

                        {/* Footer Content */}
                        {activeTab === 'footer' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-900">Footer Content</h2>
                                
                                {/* Company Info */}
                                <div className="border rounded-lg p-4">
                                    <h3 className="text-lg font-medium text-gray-800 mb-4">Company Information</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                                            <input
                                                type="text"
                                                value={contentData.footer?.companyInfo?.name || ''}
                                                onChange={(e) => updateNestedContentData('footer', 'companyInfo', 'name', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
                                            <textarea
                                                value={contentData.footer?.companyInfo?.description || ''}
                                                onChange={(e) => updateNestedContentData('footer', 'companyInfo', 'description', e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                                <input
                                                    type="text"
                                                    value={contentData.footer?.companyInfo?.phone || ''}
                                                    onChange={(e) => updateNestedContentData('footer', 'companyInfo', 'phone', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                                <input
                                                    type="email"
                                                    value={contentData.footer?.companyInfo?.email || ''}
                                                    onChange={(e) => updateNestedContentData('footer', 'companyInfo', 'email', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                                <input
                                                    type="text"
                                                    value={contentData.footer?.companyInfo?.address || ''}
                                                    onChange={(e) => updateNestedContentData('footer', 'companyInfo', 'address', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Business Hours */}
                                <div className="border rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium text-gray-800">Business Hours</h3>
                                        <button
                                            onClick={() => {
                                                const newHours = [...(contentData.footer?.businessHours?.hours || []), { days: "", time: "" }];
                                                setContentData(prev => ({
                                                    ...prev,
                                                    footer: {
                                                        ...prev.footer,
                                                        businessHours: {
                                                            ...prev.footer?.businessHours,
                                                            hours: newHours
                                                        }
                                                    }
                                                }));
                                            }}
                                            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                                        >
                                            + Add Hours
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                                        <input
                                            type="text"
                                            value={contentData.footer?.businessHours?.title || ''}
                                            onChange={(e) => updateNestedContentData('footer', 'businessHours', 'title', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        {(contentData.footer?.businessHours?.hours || []).map((hour, index) => (
                                            <div key={index} className="flex gap-2 items-center">
                                                <input
                                                    type="text"
                                                    placeholder="Days"
                                                    value={hour.days}
                                                    onChange={(e) => {
                                                        const newHours = [...(contentData.footer?.businessHours?.hours || [])];
                                                        newHours[index] = { ...newHours[index], days: e.target.value };
                                                        setContentData(prev => ({
                                                            ...prev,
                                                            footer: {
                                                                ...prev.footer,
                                                                businessHours: {
                                                                    ...prev.footer?.businessHours,
                                                                    hours: newHours
                                                                }
                                                            }
                                                        }));
                                                    }}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Time"
                                                    value={hour.time}
                                                    onChange={(e) => {
                                                        const newHours = [...(contentData.footer?.businessHours?.hours || [])];
                                                        newHours[index] = { ...newHours[index], time: e.target.value };
                                                        setContentData(prev => ({
                                                            ...prev,
                                                            footer: {
                                                                ...prev.footer,
                                                                businessHours: {
                                                                    ...prev.footer?.businessHours,
                                                                    hours: newHours
                                                                }
                                                            }
                                                        }));
                                                    }}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newHours = (contentData.footer?.businessHours?.hours || []).filter((_, i) => i !== index);
                                                        setContentData(prev => ({
                                                            ...prev,
                                                            footer: {
                                                                ...prev.footer,
                                                                businessHours: {
                                                                    ...prev.footer?.businessHours,
                                                                    hours: newHours
                                                                }
                                                            }
                                                        }));
                                                    }}
                                                    className="px-2 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Social Media Links */}
                                <div className="border rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium text-gray-800">Social Media Links</h3>
                                        <button
                                            onClick={() => {
                                                const newSocialMedia = [...(contentData.footer?.socialMedia || []), { platform: "", url: "", icon: "", color: "#000000" }];
                                                setContentData(prev => ({
                                                    ...prev,
                                                    footer: {
                                                        ...prev.footer,
                                                        socialMedia: newSocialMedia
                                                    }
                                                }));
                                            }}
                                            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                                        >
                                            + Add Social Media
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {(contentData.footer?.socialMedia || []).map((social, index) => (
                                            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center p-3 border rounded-md">
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Platform</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Facebook"
                                                        value={social.platform}
                                                        onChange={(e) => {
                                                            const newSocialMedia = [...(contentData.footer?.socialMedia || [])];
                                                            newSocialMedia[index] = { ...newSocialMedia[index], platform: e.target.value };
                                                            setContentData(prev => ({
                                                                ...prev,
                                                                footer: { ...prev.footer, socialMedia: newSocialMedia }
                                                            }));
                                                        }}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">URL</label>
                                                    <input
                                                        type="url"
                                                        placeholder="https://facebook.com/..."
                                                        value={social.url}
                                                        onChange={(e) => {
                                                            const newSocialMedia = [...(contentData.footer?.socialMedia || [])];
                                                            newSocialMedia[index] = { ...newSocialMedia[index], url: e.target.value };
                                                            setContentData(prev => ({
                                                                ...prev,
                                                                footer: { ...prev.footer, socialMedia: newSocialMedia }
                                                            }));
                                                        }}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Icon</label>
                                                    <select
                                                        value={social.icon}
                                                        onChange={(e) => {
                                                            const newSocialMedia = [...(contentData.footer?.socialMedia || [])];
                                                            newSocialMedia[index] = { ...newSocialMedia[index], icon: e.target.value };
                                                            setContentData(prev => ({
                                                                ...prev,
                                                                footer: { ...prev.footer, socialMedia: newSocialMedia }
                                                            }));
                                                        }}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="">Select Icon</option>
                                                        <option value="FaFacebook">Facebook</option>
                                                        <option value="FaInstagram">Instagram</option>
                                                        <option value="FaTwitter">Twitter</option>
                                                        <option value="FaPinterest">Pinterest</option>
                                                        <option value="FaLinkedin">LinkedIn</option>
                                                        <option value="FaYoutube">YouTube</option>
                                                        <option value="FaTiktok">TikTok</option>
                                                        <option value="FaSnapchat">Snapchat</option>
                                                        <option value="FaDiscord">Discord</option>
                                                        <option value="FaTelegram">Telegram</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Color</label>
                                                    <input
                                                        type="color"
                                                        value={social.color}
                                                        onChange={(e) => {
                                                            const newSocialMedia = [...(contentData.footer?.socialMedia || [])];
                                                            newSocialMedia[index] = { ...newSocialMedia[index], color: e.target.value };
                                                            setContentData(prev => ({
                                                                ...prev,
                                                                footer: { ...prev.footer, socialMedia: newSocialMedia }
                                                            }));
                                                        }}
                                                        className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Action</label>
                                                    <button
                                                        onClick={() => {
                                                            const newSocialMedia = (contentData.footer?.socialMedia || []).filter((_, i) => i !== index);
                                                            setContentData(prev => ({
                                                                ...prev,
                                                                footer: { ...prev.footer, socialMedia: newSocialMedia }
                                                            }));
                                                        }}
                                                        className="w-full px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Links */}
                                <div className="border rounded-lg p-4">
                                    <h3 className="text-lg font-medium text-gray-800 mb-4">Quick Links</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {['shop', 'support', 'company'].map((section) => (
                                            <div key={section}>
                                                <div className="flex justify-between items-center mb-2">
                                                    <h4 className="font-medium text-gray-700 capitalize">{section} Links</h4>
                                                    <button
                                                        onClick={() => {
                                                            const newLinks = [...(contentData.footer?.quickLinks?.[section] || []), { label: "", path: "" }];
                                                            setContentData(prev => ({
                                                                ...prev,
                                                                footer: {
                                                                    ...prev.footer,
                                                                    quickLinks: {
                                                                        ...prev.footer?.quickLinks,
                                                                        [section]: newLinks
                                                                    }
                                                                }
                                                            }));
                                                        }}
                                                        className="text-sm px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <div className="space-y-2">
                                                    {(contentData.footer?.quickLinks?.[section] || []).map((link, index) => (
                                                        <div key={index} className="flex gap-1">
                                                            <input
                                                                type="text"
                                                                placeholder="Label"
                                                                value={link.label}
                                                                onChange={(e) => {
                                                                    const newLinks = [...(contentData.footer?.quickLinks?.[section] || [])];
                                                                    newLinks[index] = { ...newLinks[index], label: e.target.value };
                                                                    setContentData(prev => ({
                                                                        ...prev,
                                                                        footer: {
                                                                            ...prev.footer,
                                                                            quickLinks: {
                                                                                ...prev.footer?.quickLinks,
                                                                                [section]: newLinks
                                                                            }
                                                                        }
                                                                    }));
                                                                }}
                                                                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="Path"
                                                                value={link.path}
                                                                onChange={(e) => {
                                                                    const newLinks = [...(contentData.footer?.quickLinks?.[section] || [])];
                                                                    newLinks[index] = { ...newLinks[index], path: e.target.value };
                                                                    setContentData(prev => ({
                                                                        ...prev,
                                                                        footer: {
                                                                            ...prev.footer,
                                                                            quickLinks: {
                                                                                ...prev.footer?.quickLinks,
                                                                                [section]: newLinks
                                                                            }
                                                                        }
                                                                    }));
                                                                }}
                                                                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                            <button
                                                                onClick={() => {
                                                                    const newLinks = (contentData.footer?.quickLinks?.[section] || []).filter((_, i) => i !== index);
                                                                    setContentData(prev => ({
                                                                        ...prev,
                                                                        footer: {
                                                                            ...prev.footer,
                                                                            quickLinks: {
                                                                                ...prev.footer?.quickLinks,
                                                                                [section]: newLinks
                                                                            }
                                                                        }
                                                                    }));
                                                                }}
                                                                className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleSave('footer')}
                                    disabled={isLoading}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                                >
                                    {isLoading ? 'Saving...' : 'Save Footer Content'}
                                </button>
                            </div>
                        )}

                        {/* Header Content */}
                        {activeTab === 'header' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-900">Header & Navigation Content</h2>
                                
                                {/* Announcement Banner */}
                                <div className="border rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium text-gray-800">Announcement Banners</h3>
                                        <button
                                            onClick={() => {
                                                const newBanners = [...(contentData.header?.announcementBanners || []), { 
                                                    text: "", 
                                                    link: "", 
                                                    backgroundColor: "#1f2937", 
                                                    textColor: "#ffffff",
                                                    isActive: true 
                                                }];
                                                setContentData(prev => ({
                                                    ...prev,
                                                    header: {
                                                        ...prev.header,
                                                        announcementBanners: newBanners
                                                    }
                                                }));
                                            }}
                                            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                                        >
                                            + Add Banner
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {(contentData.header?.announcementBanners || []).map((banner, index) => (
                                            <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center p-3 border rounded-md">
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Text</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Banner text..."
                                                        value={banner.text}
                                                        onChange={(e) => {
                                                            const newBanners = [...(contentData.header?.announcementBanners || [])];
                                                            newBanners[index] = { ...newBanners[index], text: e.target.value };
                                                            setContentData(prev => ({
                                                                ...prev,
                                                                header: { ...prev.header, announcementBanners: newBanners }
                                                            }));
                                                        }}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Link (Optional)</label>
                                                    <input
                                                        type="url"
                                                        placeholder="/sale or https://..."
                                                        value={banner.link}
                                                        onChange={(e) => {
                                                            const newBanners = [...(contentData.header?.announcementBanners || [])];
                                                            newBanners[index] = { ...newBanners[index], link: e.target.value };
                                                            setContentData(prev => ({
                                                                ...prev,
                                                                header: { ...prev.header, announcementBanners: newBanners }
                                                            }));
                                                        }}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Background</label>
                                                    <input
                                                        type="color"
                                                        value={banner.backgroundColor}
                                                        onChange={(e) => {
                                                            const newBanners = [...(contentData.header?.announcementBanners || [])];
                                                            newBanners[index] = { ...newBanners[index], backgroundColor: e.target.value };
                                                            setContentData(prev => ({
                                                                ...prev,
                                                                header: { ...prev.header, announcementBanners: newBanners }
                                                            }));
                                                        }}
                                                        className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Text Color</label>
                                                    <input
                                                        type="color"
                                                        value={banner.textColor}
                                                        onChange={(e) => {
                                                            const newBanners = [...(contentData.header?.announcementBanners || [])];
                                                            newBanners[index] = { ...newBanners[index], textColor: e.target.value };
                                                            setContentData(prev => ({
                                                                ...prev,
                                                                header: { ...prev.header, announcementBanners: newBanners }
                                                            }));
                                                        }}
                                                        className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Status</label>
                                                    <select
                                                        value={banner.isActive ? 'active' : 'inactive'}
                                                        onChange={(e) => {
                                                            const newBanners = [...(contentData.header?.announcementBanners || [])];
                                                            newBanners[index] = { ...newBanners[index], isActive: e.target.value === 'active' };
                                                            setContentData(prev => ({
                                                                ...prev,
                                                                header: { ...prev.header, announcementBanners: newBanners }
                                                            }));
                                                        }}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="active">Active</option>
                                                        <option value="inactive">Inactive</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Action</label>
                                                    <button
                                                        onClick={() => {
                                                            const newBanners = (contentData.header?.announcementBanners || []).filter((_, i) => i !== index);
                                                            setContentData(prev => ({
                                                                ...prev,
                                                                header: { ...prev.header, announcementBanners: newBanners }
                                                            }));
                                                        }}
                                                        className="w-full px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Logo Section */}
                                <div className="border rounded-lg p-4">
                                    <h3 className="text-lg font-medium text-gray-800 mb-4">Logo & Branding</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                                            <input
                                                type="text"
                                                value={contentData.header?.logo?.text || ''}
                                                onChange={(e) => updateNestedContentData('header', 'logo', 'text', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                                            <input
                                                type="text"
                                                value={contentData.header?.logo?.tagline || ''}
                                                onChange={(e) => updateNestedContentData('header', 'logo', 'tagline', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Navigation Items */}
                                <div className="border rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium text-gray-800">Navigation Menu</h3>
                                        <button
                                            onClick={() => {
                                                const newNavItems = [...(contentData.header?.navigation?.items || []), { 
                                                    label: "", 
                                                    path: "", 
                                                    dropdown: null,
                                                    isActive: true 
                                                }];
                                                setContentData(prev => ({
                                                    ...prev,
                                                    header: {
                                                        ...prev.header,
                                                        navigation: {
                                                            ...prev.header?.navigation,
                                                            items: newNavItems
                                                        }
                                                    }
                                                }));
                                            }}
                                            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                                        >
                                            + Add Nav Item
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {(contentData.header?.navigation?.items || []).map((item, index) => (
                                            <div key={index} className="border rounded-md p-3">
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                                                    <div>
                                                        <label className="block text-xs text-gray-600 mb-1">Label</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Home, Shop, etc."
                                                            value={item.label}
                                                            onChange={(e) => {
                                                                const newNavItems = [...(contentData.header?.navigation?.items || [])];
                                                                newNavItems[index] = { ...newNavItems[index], label: e.target.value };
                                                                setContentData(prev => ({
                                                                    ...prev,
                                                                    header: {
                                                                        ...prev.header,
                                                                        navigation: {
                                                                            ...prev.header?.navigation,
                                                                            items: newNavItems
                                                                        }
                                                                    }
                                                                }));
                                                            }}
                                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-600 mb-1">Path</label>
                                                        <input
                                                            type="text"
                                                            placeholder="/home, /shop, etc."
                                                            value={item.path}
                                                            onChange={(e) => {
                                                                const newNavItems = [...(contentData.header?.navigation?.items || [])];
                                                                newNavItems[index] = { ...newNavItems[index], path: e.target.value };
                                                                setContentData(prev => ({
                                                                    ...prev,
                                                                    header: {
                                                                        ...prev.header,
                                                                        navigation: {
                                                                            ...prev.header?.navigation,
                                                                            items: newNavItems
                                                                        }
                                                                    }
                                                                }));
                                                            }}
                                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-600 mb-1">Status</label>
                                                        <select
                                                            value={item.isActive ? 'active' : 'inactive'}
                                                            onChange={(e) => {
                                                                const newNavItems = [...(contentData.header?.navigation?.items || [])];
                                                                newNavItems[index] = { ...newNavItems[index], isActive: e.target.value === 'active' };
                                                                setContentData(prev => ({
                                                                    ...prev,
                                                                    header: {
                                                                        ...prev.header,
                                                                        navigation: {
                                                                            ...prev.header?.navigation,
                                                                            items: newNavItems
                                                                        }
                                                                    }
                                                                }));
                                                            }}
                                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            <option value="active">Active</option>
                                                            <option value="inactive">Inactive</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-600 mb-1">Action</label>
                                                        <button
                                                            onClick={() => {
                                                                const newNavItems = (contentData.header?.navigation?.items || []).filter((_, i) => i !== index);
                                                                setContentData(prev => ({
                                                                    ...prev,
                                                                    header: {
                                                                        ...prev.header,
                                                                        navigation: {
                                                                            ...prev.header?.navigation,
                                                                            items: newNavItems
                                                                        }
                                                                    }
                                                                }));
                                                            }}
                                                            className="w-full px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                                
                                                {/* Dropdown Items */}
                                                {item.dropdown && (
                                                    <div className="mt-3 pl-4 border-l-2 border-gray-200">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-sm text-gray-600">Dropdown Items</span>
                                                            <button
                                                                onClick={() => {
                                                                    const newNavItems = [...(contentData.header?.navigation?.items || [])];
                                                                    if (!newNavItems[index].dropdown) {
                                                                        newNavItems[index].dropdown = { items: [] };
                                                                    }
                                                                    newNavItems[index].dropdown.items = [...(newNavItems[index].dropdown.items || []), { label: "", path: "" }];
                                                                    setContentData(prev => ({
                                                                        ...prev,
                                                                        header: {
                                                                            ...prev.header,
                                                                            navigation: {
                                                                                ...prev.header?.navigation,
                                                                                items: newNavItems
                                                                            }
                                                                        }
                                                                    }));
                                                                }}
                                                                className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                                                            >
                                                                + Add Dropdown Item
                                                            </button>
                                                        </div>
                                                        <div className="space-y-2">
                                                            {(item.dropdown?.items || []).map((dropdownItem, dropIndex) => (
                                                                <div key={dropIndex} className="flex gap-2">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Label"
                                                                        value={dropdownItem.label}
                                                                        onChange={(e) => {
                                                                            const newNavItems = [...(contentData.header?.navigation?.items || [])];
                                                                            const newDropdownItems = [...(newNavItems[index].dropdown?.items || [])];
                                                                            newDropdownItems[dropIndex] = { ...newDropdownItems[dropIndex], label: e.target.value };
                                                                            newNavItems[index].dropdown.items = newDropdownItems;
                                                                            setContentData(prev => ({
                                                                                ...prev,
                                                                                header: {
                                                                                    ...prev.header,
                                                                                    navigation: {
                                                                                        ...prev.header?.navigation,
                                                                                        items: newNavItems
                                                                                    }
                                                                                }
                                                                            }));
                                                                        }}
                                                                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Path"
                                                                        value={dropdownItem.path}
                                                                        onChange={(e) => {
                                                                            const newNavItems = [...(contentData.header?.navigation?.items || [])];
                                                                            const newDropdownItems = [...(newNavItems[index].dropdown?.items || [])];
                                                                            newDropdownItems[dropIndex] = { ...newDropdownItems[dropIndex], path: e.target.value };
                                                                            newNavItems[index].dropdown.items = newDropdownItems;
                                                                            setContentData(prev => ({
                                                                                ...prev,
                                                                                header: {
                                                                                    ...prev.header,
                                                                                    navigation: {
                                                                                        ...prev.header?.navigation,
                                                                                        items: newNavItems
                                                                                    }
                                                                                }
                                                                            }));
                                                                        }}
                                                                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    />
                                                                    <button
                                                                        onClick={() => {
                                                                            const newNavItems = [...(contentData.header?.navigation?.items || [])];
                                                                            const newDropdownItems = (newNavItems[index].dropdown?.items || []).filter((_, i) => i !== dropIndex);
                                                                            newNavItems[index].dropdown.items = newDropdownItems;
                                                                            setContentData(prev => ({
                                                                                ...prev,
                                                                                header: {
                                                                                    ...prev.header,
                                                                                    navigation: {
                                                                                        ...prev.header?.navigation,
                                                                                        items: newNavItems
                                                                                    }
                                                                                }
                                                                            }));
                                                                        }}
                                                                        className="px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                <div className="mt-2">
                                                    <button
                                                        onClick={() => {
                                                            const newNavItems = [...(contentData.header?.navigation?.items || [])];
                                                            if (newNavItems[index].dropdown) {
                                                                newNavItems[index].dropdown = null;
                                                            } else {
                                                                newNavItems[index].dropdown = { items: [] };
                                                            }
                                                            setContentData(prev => ({
                                                                ...prev,
                                                                header: {
                                                                    ...prev.header,
                                                                    navigation: {
                                                                        ...prev.header?.navigation,
                                                                        items: newNavItems
                                                                    }
                                                                }
                                                            }));
                                                        }}
                                                        className={`px-3 py-1 rounded text-sm ${
                                                            item.dropdown 
                                                                ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                                                                : 'bg-green-600 text-white hover:bg-green-700'
                                                        }`}
                                                    >
                                                        {item.dropdown ? 'Remove Dropdown' : 'Add Dropdown'}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Search */}
                                <div className="border rounded-lg p-4">
                                    <h3 className="text-lg font-medium text-gray-800 mb-4">Search Settings</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Search Placeholder Text</label>
                                        <input
                                            type="text"
                                            value={contentData.header?.searchPlaceholder || ''}
                                            onChange={(e) => updateContentData('header', 'searchPlaceholder', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleSave('header')}
                                    disabled={isLoading}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                                >
                                    {isLoading ? 'Saving...' : 'Save Header Content'}
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
