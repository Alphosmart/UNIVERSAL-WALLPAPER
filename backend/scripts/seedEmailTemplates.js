const mongoose = require('mongoose');
const EmailTemplate = require('../models/emailTemplateModel');
const { getDefaultTemplate } = require('../services/emailService');

// Seed default email templates
const seedEmailTemplates = async () => {
    try {
        console.log('🌱 Seeding email templates...');
        
        const templateTypes = ['orderConfirmation', 'passwordReset', 'contactForm'];
        
        for (const templateType of templateTypes) {
            const existingTemplate = await EmailTemplate.findOne({ templateType });
            
            if (!existingTemplate) {
                const defaultTemplate = getDefaultTemplate(templateType);
                
                if (defaultTemplate) {
                    const templateData = {
                        templateType,
                        subject: defaultTemplate.subject,
                        htmlContent: defaultTemplate.htmlContent,
                        variables: getVariablesForTemplate(templateType),
                        isActive: true
                    };
                    
                    const template = new EmailTemplate(templateData);
                    await template.save();
                    console.log(`✅ Created default template: ${templateType}`);
                } else {
                    console.log(`⚠️  No default template found for: ${templateType}`);
                }
            } else {
                console.log(`📄 Template already exists: ${templateType}`);
            }
        }
        
        console.log('🎉 Email template seeding completed!');
    } catch (error) {
        console.error('❌ Error seeding email templates:', error);
    }
};

// Get variables for each template type
const getVariablesForTemplate = (templateType) => {
    switch (templateType) {
        case 'orderConfirmation':
            return [
                { name: 'customerName', description: 'Customer name', placeholder: '{{customerName}}' },
                { name: 'orderId', description: 'Order ID', placeholder: '{{orderId}}' },
                { name: 'trackingNumber', description: 'Tracking number', placeholder: '{{trackingNumber}}' },
                { name: 'totalAmount', description: 'Total amount', placeholder: '{{totalAmount}}' },
                { name: 'productName', description: 'Product name', placeholder: '{{productName}}' },
                { name: 'brandName', description: 'Brand name', placeholder: '{{brandName}}' },
                { name: 'quantity', description: 'Quantity', placeholder: '{{quantity}}' },
                { name: 'orderDate', description: 'Order date', placeholder: '{{orderDate}}' },
                { name: 'estimatedDelivery', description: 'Estimated delivery date', placeholder: '{{estimatedDelivery}}' }
            ];
        case 'passwordReset':
            return [
                { name: 'userName', description: 'User name', placeholder: '{{userName}}' },
                { name: 'resetLink', description: 'Password reset link', placeholder: '{{resetLink}}' }
            ];
        case 'contactForm':
            return [
                { name: 'senderName', description: 'Sender name', placeholder: '{{senderName}}' },
                { name: 'senderEmail', description: 'Sender email', placeholder: '{{senderEmail}}' },
                { name: 'messageSubject', description: 'Message subject', placeholder: '{{messageSubject}}' },
                { name: 'messageContent', description: 'Message content', placeholder: '{{messageContent}}' }
            ];
        default:
            return [];
    }
};

// Run seeder if called directly
if (require.main === module) {
    require('dotenv').config();
    
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-ecommerce')
        .then(() => {
            console.log('📡 Connected to MongoDB');
            return seedEmailTemplates();
        })
        .then(() => {
            console.log('✅ Seeding completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Seeding failed:', error);
            process.exit(1);
        });
}

module.exports = { seedEmailTemplates };
