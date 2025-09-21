const EmailTemplate = require('../models/emailTemplateModel');
const User = require('../models/userModel');
const { getDefaultTemplate } = require('../services/emailService');

// Admin check helper function
const checkAdminAccess = async (userId) => {
    if (!userId) {
        return { error: "Please login to access this resource", status: 401 };
    }
    
    const currentUser = await User.findById(userId);
    if (!currentUser || currentUser.role !== 'ADMIN') {
        return { error: "Access denied. Admin privileges required.", status: 403 };
    }
    
    return { success: true };
};

// Get all email templates
const getAllTemplates = async (req, res) => {
    try {
        // Check admin access
        const adminCheck = await checkAdminAccess(req.userId);
        if (adminCheck.error) {
            return res.status(adminCheck.status).json({
                message: adminCheck.error,
                error: true,
                success: false
            });
        }
        const templates = await EmailTemplate.find().sort({ templateType: 1 });
        
        // If no templates exist, create default ones
        if (templates.length === 0) {
            await initializeDefaultTemplates();
            const newTemplates = await EmailTemplate.find().sort({ templateType: 1 });
            return res.json({
                message: "Default email templates initialized",
                data: newTemplates,
                success: true,
                error: false
            });
        }

        res.json({
            message: "Email templates retrieved successfully",
            data: templates,
            success: true,
            error: false
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Error retrieving email templates",
            error: true,
            success: false
        });
    }
};

// Get specific template by type
const getTemplateByType = async (req, res) => {
    try {
        // Check admin access
        const adminCheck = await checkAdminAccess(req.userId);
        if (adminCheck.error) {
            return res.status(adminCheck.status).json({
                message: adminCheck.error,
                error: true,
                success: false
            });
        }

        const { templateType } = req.params;
        let template = await EmailTemplate.findOne({ templateType });
        
        // If no custom template found, return default
        if (!template) {
            const defaultTemplate = getDefaultTemplate(templateType);
            if (defaultTemplate) {
                template = {
                    templateType,
                    subject: defaultTemplate.subject,
                    htmlContent: defaultTemplate.htmlContent,
                    isDefault: true
                };
            }
        }

        if (!template) {
            return res.status(404).json({
                message: "Template not found",
                error: true,
                success: false
            });
        }

        res.json({
            message: "Template retrieved successfully",
            data: template,
            success: true,
            error: false
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Error retrieving template",
            error: true,
            success: false
        });
    }
};

// Create or update template
const saveTemplate = async (req, res) => {
    try {
        // Check admin access
        const adminCheck = await checkAdminAccess(req.userId);
        if (adminCheck.error) {
            return res.status(adminCheck.status).json({
                message: adminCheck.error,
                error: true,
                success: false
            });
        }

        const { templateType, subject, htmlContent, variables } = req.body;

        if (!templateType || !subject || !htmlContent) {
            return res.status(400).json({
                message: "Template type, subject, and HTML content are required",
                error: true,
                success: false
            });
        }

        const templateData = {
            templateType,
            subject,
            htmlContent,
            variables: variables || [],
            modifiedBy: req.userId,
            isActive: true
        };

        let template = await EmailTemplate.findOne({ templateType });
        
        if (template) {
            // Update existing template
            Object.assign(template, templateData);
            await template.save();
        } else {
            // Create new template
            template = new EmailTemplate(templateData);
            await template.save();
        }

        res.json({
            message: "Template saved successfully",
            data: template,
            success: true,
            error: false
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Error saving template",
            error: true,
            success: false
        });
    }
};

// Delete template (revert to default)
const deleteTemplate = async (req, res) => {
    try {
        // Check admin access
        const adminCheck = await checkAdminAccess(req.userId);
        if (adminCheck.error) {
            return res.status(adminCheck.status).json({
                message: adminCheck.error,
                error: true,
                success: false
            });
        }

        const { templateType } = req.params;
        
        const deletedTemplate = await EmailTemplate.findOneAndDelete({ templateType });
        
        if (!deletedTemplate) {
            return res.status(404).json({
                message: "Template not found",
                error: true,
                success: false
            });
        }

        res.json({
            message: "Template deleted successfully. Default template will be used.",
            success: true,
            error: false
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Error deleting template",
            error: true,
            success: false
        });
    }
};

// Toggle template active status
const toggleTemplateStatus = async (req, res) => {
    try {
        // Check admin access
        const adminCheck = await checkAdminAccess(req.userId);
        if (adminCheck.error) {
            return res.status(adminCheck.status).json({
                message: adminCheck.error,
                error: true,
                success: false
            });
        }

        const { templateType } = req.params;
        
        const template = await EmailTemplate.findOne({ templateType });
        
        if (!template) {
            return res.status(404).json({
                message: "Template not found",
                error: true,
                success: false
            });
        }

        template.isActive = !template.isActive;
        template.modifiedBy = req.userId;
        await template.save();

        res.json({
            message: `Template ${template.isActive ? 'activated' : 'deactivated'} successfully`,
            data: template,
            success: true,
            error: false
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Error updating template status",
            error: true,
            success: false
        });
    }
};

// Initialize default templates
const initializeDefaultTemplates = async () => {
    const defaultTemplateData = [
        {
            templateType: 'orderConfirmation',
            subject: 'Order Confirmation - {{trackingNumber}}',
            htmlContent: getDefaultTemplate('orderConfirmation').htmlContent,
            variables: [
                { name: 'customerName', description: 'Customer name', placeholder: '{{customerName}}' },
                { name: 'orderId', description: 'Order ID', placeholder: '{{orderId}}' },
                { name: 'trackingNumber', description: 'Tracking number', placeholder: '{{trackingNumber}}' },
                { name: 'totalAmount', description: 'Total amount', placeholder: '{{totalAmount}}' },
                { name: 'productName', description: 'Product name', placeholder: '{{productName}}' },
                { name: 'brandName', description: 'Brand name', placeholder: '{{brandName}}' },
                { name: 'quantity', description: 'Quantity', placeholder: '{{quantity}}' },
                { name: 'orderDate', description: 'Order date', placeholder: '{{orderDate}}' },
                { name: 'estimatedDelivery', description: 'Estimated delivery date', placeholder: '{{estimatedDelivery}}' }
            ]
        },
        {
            templateType: 'passwordReset',
            subject: 'Password Reset Request',
            htmlContent: getDefaultTemplate('passwordReset').htmlContent,
            variables: [
                { name: 'userName', description: 'User name', placeholder: '{{userName}}' },
                { name: 'resetLink', description: 'Password reset link', placeholder: '{{resetLink}}' }
            ]
        },
        {
            templateType: 'contactForm',
            subject: 'New Contact Form Submission',
            htmlContent: getDefaultTemplate('contactForm').htmlContent,
            variables: [
                { name: 'senderName', description: 'Sender name', placeholder: '{{senderName}}' },
                { name: 'senderEmail', description: 'Sender email', placeholder: '{{senderEmail}}' },
                { name: 'messageSubject', description: 'Message subject', placeholder: '{{messageSubject}}' },
                { name: 'messageContent', description: 'Message content', placeholder: '{{messageContent}}' }
            ]
        }
    ];

    for (const templateData of defaultTemplateData) {
        const existingTemplate = await EmailTemplate.findOne({ templateType: templateData.templateType });
        if (!existingTemplate) {
            const template = new EmailTemplate(templateData);
            await template.save();
        }
    }
};

// Preview template with sample data
const previewTemplate = async (req, res) => {
    try {
        // Check admin access
        const adminCheck = await checkAdminAccess(req.userId);
        if (adminCheck.error) {
            return res.status(adminCheck.status).json({
                message: adminCheck.error,
                error: true,
                success: false
            });
        }

        const { templateType, htmlContent, subject } = req.body;
        
        // Sample data for preview
        const sampleData = {
            customerName: 'John Doe',
            orderId: '12345678',
            trackingNumber: 'TRK123456ABCD',
            totalAmount: '99.99',
            productName: 'Sample Product',
            brandName: 'Sample Brand',
            quantity: '2',
            orderDate: new Date().toLocaleDateString(),
            estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            userName: 'John Doe',
            resetLink: 'https://example.com/reset-password',
            senderName: 'Jane Smith',
            senderEmail: 'jane@example.com',
            messageSubject: 'Sample inquiry',
            messageContent: 'This is a sample message content.'
        };

        let previewHtml = htmlContent;
        let previewSubject = subject;

        // Replace placeholders with sample data
        Object.keys(sampleData).forEach(key => {
            const placeholder = new RegExp(`{{${key}}}`, 'g');
            previewHtml = previewHtml.replace(placeholder, sampleData[key]);
            previewSubject = previewSubject.replace(placeholder, sampleData[key]);
        });

        res.json({
            message: "Template preview generated successfully",
            data: {
                subject: previewSubject,
                htmlContent: previewHtml
            },
            success: true,
            error: false
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Error generating preview",
            error: true,
            success: false
        });
    }
};

module.exports = {
    getAllTemplates,
    getTemplateByType,
    saveTemplate,
    deleteTemplate,
    toggleTemplateStatus,
    previewTemplate
};
