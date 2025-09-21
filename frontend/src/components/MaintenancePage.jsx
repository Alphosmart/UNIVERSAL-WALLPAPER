import React, { useState, useEffect } from 'react';
import { ExclamationTriangleIcon, ClockIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import SummaryApi from '../common';

const MaintenancePage = () => {
    const [maintenanceContent, setMaintenanceContent] = useState({
        title: "Under Maintenance",
        message: "We're currently performing scheduled maintenance to improve your experience. We'll be back online shortly.",
        estimatedDowntime: "1-2 hours",
        statusMessage: "Service will resume automatically",
        contactEmail: "support@yourcompany.com",
        progressPercentage: 45,
        showProgressBar: true,
        showContactInfo: true,
        backgroundColor: "from-blue-50 to-indigo-100",
        buttonText: "Refresh Page"
    });

    useEffect(() => {
        const loadMaintenanceContent = async () => {
            try {
                const response = await fetch(SummaryApi.getPublicSiteContent.url, {
                    method: SummaryApi.getPublicSiteContent.method,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();
                
                if (data.success && data.data && data.data.maintenancePage) {
                    setMaintenanceContent(prev => ({ ...prev, ...data.data.maintenancePage }));
                }
            } catch (error) {
                console.error('Error loading maintenance content:', error);
                // Use default content if loading fails
            }
        };

        loadMaintenanceContent();
    }, []);

    return (
        <div className={`min-h-screen bg-gradient-to-br ${maintenanceContent.backgroundColor} flex items-center justify-center px-4 sm:px-6 lg:px-8`}>
            <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
                {/* Icon */}
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-6">
                    <WrenchScrewdriverIcon className="h-8 w-8 text-orange-600" />
                </div>
                
                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    {maintenanceContent.title}
                </h1>
                
                {/* Message */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                    {maintenanceContent.message}
                </p>
                
                {/* Status Indicators */}
                <div className="space-y-3 mb-8">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4" />
                        <span>Estimated downtime: {maintenanceContent.estimatedDowntime}</span>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        <span>{maintenanceContent.statusMessage}</span>
                    </div>
                </div>
                
                {/* Progress Bar */}
                {maintenanceContent.showProgressBar && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                        <div 
                            className="bg-orange-500 h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${maintenanceContent.progressPercentage}%` }}
                        ></div>
                    </div>
                )}
                
                {/* Contact Info */}
                {maintenanceContent.showContactInfo && (
                    <div className="text-sm text-gray-500 mb-6">
                        <p>For urgent matters, please contact us at:</p>
                        <p className="font-medium text-gray-700 mt-1">{maintenanceContent.contactEmail}</p>
                    </div>
                )}
                
                {/* Refresh Button */}
                <button
                    onClick={() => window.location.reload()}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    {maintenanceContent.buttonText}
                </button>
                
                {/* Last Updated */}
                <p className="text-xs text-gray-400 mt-4">
                    Last updated: {new Date().toLocaleString()}
                </p>
            </div>
        </div>
    );
};

export default MaintenancePage;
