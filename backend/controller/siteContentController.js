const express = require('express');
const fs = require('fs').promises;
const path = require('path');

// Site content management controller
const getSiteContent = async (req, res) => {
    try {
        const contentFilePath = path.join(__dirname, '../data/siteContent.json');
        
        // Default content structure
        const defaultContent = {
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
                    address: "123 E-Commerce Street\\nBusiness District\\nCity, State 12345",
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
                maintenanceMode: false,
                lastUpdated: new Date().toISOString()
            }
        };

        try {
            // Try to read existing content file
            const data = await fs.readFile(contentFilePath, 'utf8');
            const content = JSON.parse(data);
            
            res.json({
                success: true,
                message: "Site content retrieved successfully",
                data: content
            });
        } catch (error) {
            // If file doesn't exist, return default content
            res.json({
                success: true,
                message: "Default site content returned",
                data: defaultContent
            });
        }
    } catch (error) {
        console.error('Error getting site content:', error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve site content",
            error: error.message
        });
    }
};

const updateSiteContent = async (req, res) => {
    try {
        const { section, data } = req.body;
        
        if (!section || !data) {
            return res.status(400).json({
                success: false,
                message: "Section and data are required"
            });
        }

        const contentFilePath = path.join(__dirname, '../data/siteContent.json');
        const dataDir = path.dirname(contentFilePath);
        
        // Ensure data directory exists
        try {
            await fs.access(dataDir);
        } catch {
            await fs.mkdir(dataDir, { recursive: true });
        }

        let currentContent = {};
        
        // Try to read existing content
        try {
            const existingData = await fs.readFile(contentFilePath, 'utf8');
            currentContent = JSON.parse(existingData);
        } catch (error) {
            // File doesn't exist, start with empty object
            console.log('Creating new site content file');
        }

        // Update the specific section
        currentContent[section] = {
            ...data,
            lastUpdated: new Date().toISOString()
        };

        // Special handling for siteSettings section - also update database
        if (section === 'siteSettings' && data.maintenanceMode !== undefined) {
            try {
                const settingsModel = require('../models/settingsModel');
                
                console.log('🔧 Updating database maintenance mode:', {
                    maintenanceMode: data.maintenanceMode,
                    systemId: 'main_settings'
                });
                
                // Find or create settings document
                let settings = await settingsModel.findOne({ systemId: 'main_settings' });
                
                if (!settings) {
                    // Create new settings document if it doesn't exist
                    console.log('Creating new settings document...');
                    settings = new settingsModel({
                        systemId: 'main_settings',
                        general: {
                            siteName: data.siteName || 'AshAmSmart',
                            siteDescription: data.siteDescription || 'Your trusted e-commerce marketplace for quality products',
                            maintenanceMode: data.maintenanceMode
                        }
                    });
                } else {
                    // Update existing settings
                    console.log('Updating existing settings document...');
                    settings.general = settings.general || {};
                    settings.general.maintenanceMode = data.maintenanceMode;
                    if (data.siteName) settings.general.siteName = data.siteName;
                    if (data.siteDescription) settings.general.siteDescription = data.siteDescription;
                }
                
                await settings.save();
                console.log('✅ Database settings updated successfully:', {
                    systemId: 'main_settings',
                    maintenanceMode: data.maintenanceMode,
                    documentId: settings._id
                });
                
            } catch (dbError) {
                console.error('❌ Error updating database settings:', dbError);
                // Continue with file update even if database update fails
            }
        }

        // Write updated content back to file
        await fs.writeFile(contentFilePath, JSON.stringify(currentContent, null, 2), 'utf8');

        res.json({
            success: true,
            message: `${section} content updated successfully`,
            data: currentContent[section]
        });

    } catch (error) {
        console.error('Error updating site content:', error);
        res.status(500).json({
            success: false,
            message: "Failed to update site content",
            error: error.message
        });
    }
};

const getAllSiteContent = async (req, res) => {
    try {
        const contentFilePath = path.join(__dirname, '../data/siteContent.json');
        
        try {
            const data = await fs.readFile(contentFilePath, 'utf8');
            const content = JSON.parse(data);
            
            res.json({
                success: true,
                message: "All site content retrieved successfully",
                data: content
            });
        } catch (error) {
            // Return empty object if file doesn't exist
            res.json({
                success: true,
                message: "No site content found",
                data: {}
            });
        }
    } catch (error) {
        console.error('Error getting all site content:', error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve site content",
            error: error.message
        });
    }
};

const resetSiteContent = async (req, res) => {
    try {
        const contentFilePath = path.join(__dirname, '../data/siteContent.json');
        
        // Delete the content file to reset to defaults
        try {
            await fs.unlink(contentFilePath);
        } catch (error) {
            // File might not exist, that's okay
        }

        res.json({
            success: true,
            message: "Site content reset to defaults successfully"
        });

    } catch (error) {
        console.error('Error resetting site content:', error);
        res.status(500).json({
            success: false,
            message: "Failed to reset site content",
            error: error.message
        });
    }
};

module.exports = {
    getSiteContent,
    updateSiteContent,
    getAllSiteContent,
    resetSiteContent
};
