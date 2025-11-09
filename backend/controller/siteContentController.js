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
            homePage: {
                hero: {
                    title: "Transform Your Space with Premium Wallpapers",
                    subtitle: "Discover thousands of high-quality wallpapers from trusted sellers worldwide. From modern minimalist to classic elegant designs.",
                    primaryButtonText: "Shop Now",
                    primaryButtonLink: "/products",
                    secondaryButtonText: "Learn More",
                    secondaryButtonLink: "/about-us"
                },
                featuredSection: {
                    title: "Featured Categories",
                    subtitle: "Explore our most popular wallpaper collections",
                    categories: [
                        { name: "Modern Minimalist", image: "", description: "Clean, simple designs for contemporary spaces" },
                        { name: "Vintage Classic", image: "", description: "Timeless patterns with character" },
                        { name: "Nature Inspired", image: "", description: "Bring the outdoors inside" },
                        { name: "Luxury Collection", image: "", description: "Premium designs for sophisticated interiors" }
                    ]
                },
                testimonials: {
                    title: "What Our Customers Say",
                    subtitle: "Join thousands of satisfied customers who transformed their spaces",
                    reviews: [
                        { name: "Sarah Johnson", rating: 5, comment: "Amazing quality and fast delivery!", location: "New York, NY" },
                        { name: "Mike Chen", rating: 5, comment: "Perfect wallpapers, exactly as described.", location: "Los Angeles, CA" },
                        { name: "Emma Davis", rating: 5, comment: "Great customer service and beautiful designs.", location: "Chicago, IL" }
                    ]
                },
                stats: {
                    title: "Trusted by Thousands",
                    items: [
                        { number: "50,000+", label: "Happy Customers" },
                        { number: "10,000+", label: "Wallpaper Designs" },
                        { number: "500+", label: "Verified Sellers" },
                        { number: "99%", label: "Customer Satisfaction" }
                    ]
                }
            },
            aboutUs: {
                hero: {
                    title: "About Universal Wallpaper",
                    subtitle: "Your premier destination for high-quality wallpapers and home décor solutions",
                    description: "We connect homeowners with the world's finest wallpaper creators and suppliers, making it easy to transform any space into something extraordinary."
                },
                mission: {
                    title: "Our Mission",
                    description: "To democratize interior design by providing access to premium wallpapers and connecting customers with skilled sellers worldwide.",
                    values: [
                        { title: "Quality First", description: "We partner only with verified sellers who maintain the highest quality standards." },
                        { title: "Customer Focused", description: "Every decision we make puts our customers' satisfaction and experience first." },
                        { title: "Global Community", description: "We bring together sellers and buyers from around the world in one trusted marketplace." },
                        { title: "Innovation", description: "We continuously improve our platform to make wallpaper shopping easier and more enjoyable." }
                    ]
                },
                story: {
                    title: "Our Story",
                    content: "Founded in 2020, Universal Wallpaper began as a simple idea: why should finding the perfect wallpaper be so difficult? Our founders, interior design enthusiasts themselves, recognized the gap between amazing wallpaper creators and customers who needed their products.\n\nToday, we're proud to be the leading marketplace for wallpapers and home décor, connecting thousands of sellers with millions of satisfied customers worldwide."
                },
                team: {
                    title: "Leadership Team",
                    members: [
                        { name: "Alex Johnson", role: "CEO & Founder", bio: "Interior design expert with 15 years of industry experience." },
                        { name: "Sarah Williams", role: "CTO", bio: "Technology leader passionate about creating seamless user experiences." },
                        { name: "Michael Brown", role: "Head of Operations", bio: "Operations specialist ensuring quality and reliability." }
                    ]
                }
            },
            footer: {
                companyInfo: {
                    name: "Universal Wallpaper",
                    description: "Your premier destination for high-quality wallpapers and home décor solutions. Transform your space with our extensive collection from trusted sellers worldwide.",
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
                },
                paymentMethods: {
                    title: "We Accept",
                    methods: [
                        { name: "Visa", icon: "visa" },
                        { name: "Mastercard", icon: "mastercard" },
                        { name: "American Express", icon: "amex" },
                        { name: "PayPal", icon: "paypal" },
                        { name: "Stripe", icon: "stripe" }
                    ]
                },
                certifications: {
                    title: "Trusted & Secure",
                    items: [
                        { text: "SSL Secured", icon: "shield" },
                        { text: "PCI Compliant", icon: "certificate" },
                        { text: "Money Back Guarantee", icon: "guarantee" },
                        { text: "24/7 Support", icon: "support" }
                    ]
                }
            },
            header: {
                announcementBanners: [
                    {
                        text: "🚀 Fast shipping available nationwide! Order today",
                        link: "/products",
                        backgroundColor: "#3B82F6",
                        textColor: "#FFFFFF",
                        isActive: false
                    },
                    {
                        text: "🔥 Limited Time: 25% Off Premium Wallpapers!",
                        link: "/sale",
                        backgroundColor: "#EF4444",
                        textColor: "#FFFFFF",
                        isActive: false
                    }
                ],
                logo: {
                    text: "Universal Wallpaper",
                    tagline: "Transform Your Space"
                },
                navigation: {
                    items: [
                        { 
                            label: "Home", 
                            path: "/", 
                            dropdown: null,
                            isActive: true
                        },
                        { 
                            label: "Products", 
                            path: "/products",
                            dropdown: {
                                items: [
                                    { label: "All Wallpapers", path: "/products" },
                                    { label: "New Arrivals", path: "/products?filter=new" },
                                    { label: "Best Sellers", path: "/products?filter=popular" },
                                    { label: "On Sale", path: "/products?filter=sale" }
                                ]
                            },
                            isActive: true
                        },
                        { 
                            label: "Categories", 
                            path: "/categories",
                            dropdown: {
                                items: [
                                    { label: "Living Room", path: "/categories/living-room" },
                                    { label: "Bedroom", path: "/categories/bedroom" },
                                    { label: "Kitchen", path: "/categories/kitchen" },
                                    { label: "Bathroom", path: "/categories/bathroom" }
                                ]
                            },
                            isActive: true
                        },
                        { 
                            label: "About", 
                            path: "/about-us", 
                            dropdown: null,
                            isActive: true
                        },
                        { 
                            label: "Contact", 
                            path: "/contact-us", 
                            dropdown: null,
                            isActive: true
                        }
                    ]
                },
                searchPlaceholder: "Search for wallpapers, styles, colors..."
            },
            siteSettings: {
                siteName: "Universal Wallpaper",
                siteDescription: "Your premier destination for high-quality wallpapers and home décor solutions",
                supportEmail: "support@universalwallpaper.com",
                maintenanceMode: false,
                lastUpdated: new Date().toISOString()
            }
        };

        try {
            // Try to read existing content file
            const data = await fs.readFile(contentFilePath, 'utf8');
            const content = JSON.parse(data);
            
            // Prevent caching to ensure fresh content
            res.set({
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Surrogate-Control': 'no-store'
            });
            
            res.json({
                success: true,
                message: "Site content retrieved successfully",
                data: content
            });
        } catch (error) {
            // If file doesn't exist, return default content
            res.set({
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            });
            
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
