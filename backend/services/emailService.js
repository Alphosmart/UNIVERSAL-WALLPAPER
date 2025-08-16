const nodemailer = require('nodemailer');

// Create transporter with automatic fallback
const createTransporter = () => {
    // Check if email credentials are configured
    const requiredVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS'];
    const missingVars = requiredVars.filter(varName => 
        !process.env[varName] || 
        process.env[varName].includes('your_') ||
        process.env[varName] === 'smtp.gmail.com' // Default placeholder
    );
    
    if (missingVars.length > 0) {
        console.warn(`⚠️  Email service not configured. Missing or placeholder values for: ${missingVars.join(', ')}`);
        console.warn('Email notifications disabled. Update .env with actual email credentials.');
        return null;
    }

    try {
        const transporter = nodemailer.createTransporter({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT),
            secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        console.log('✅ Email service configured successfully');
        return transporter;
    } catch (error) {
        console.error('Email service configuration error:', error);
        return null;
    }
};

// Email templates
const emailTemplates = {
    orderConfirmation: (orderData) => ({
        subject: `Order Confirmation - ${orderData.orderId}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Order Confirmation</h2>
                <p>Dear ${orderData.customerName},</p>
                <p>Thank you for your order! Your order has been confirmed and is being processed.</p>
                
                <div style="background: #f5f5f5; padding: 15px; margin: 20px 0;">
                    <h3>Order Details:</h3>
                    <p><strong>Order ID:</strong> ${orderData.orderId}</p>
                    <p><strong>Total Amount:</strong> $${orderData.totalAmount}</p>
                    <p><strong>Order Date:</strong> ${new Date(orderData.orderDate).toLocaleDateString()}</p>
                </div>
                
                <p>You will receive a shipping confirmation email once your order has been dispatched.</p>
                <p>Thank you for shopping with us!</p>
            </div>
        `
    }),

    passwordReset: (resetData) => ({
        subject: 'Password Reset Request',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Password Reset Request</h2>
                <p>Hello,</p>
                <p>You have requested to reset your password. Click the link below to reset your password:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetData.resetLink}" 
                       style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">
                        Reset Password
                    </a>
                </div>
                
                <p><small>This link will expire in 1 hour. If you didn't request this, please ignore this email.</small></p>
            </div>
        `
    }),

    contactFormSubmission: (contactData) => ({
        subject: `New Contact Form Submission from ${contactData.name}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">New Contact Form Submission</h2>
                
                <div style="background: #f5f5f5; padding: 15px; margin: 20px 0;">
                    <p><strong>Name:</strong> ${contactData.name}</p>
                    <p><strong>Email:</strong> ${contactData.email}</p>
                    <p><strong>Subject:</strong> ${contactData.subject || 'No subject'}</p>
                    <p><strong>Message:</strong></p>
                    <p>${contactData.message}</p>
                </div>
                
                <p><small>Submitted on: ${new Date().toLocaleString()}</small></p>
            </div>
        `
    })
};

// Send email function
const sendEmail = async (to, templateType, data) => {
    const transporter = createTransporter();
    
    if (!transporter) {
        console.log('Email service not configured - email not sent');
        return { success: false, message: 'Email service not configured' };
    }

    try {
        const template = emailTemplates[templateType](data);
        
        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME || 'E-Commerce Store'}" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: template.subject,
            html: template.html
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Failed to send email:', error);
        return { success: false, error: error.message };
    }
};

// Verify email service
const verifyEmailService = async () => {
    const transporter = createTransporter();
    
    if (!transporter) {
        return { configured: false, message: 'Email service not configured' };
    }

    try {
        await transporter.verify();
        return { configured: true, message: 'Email service verified successfully' };
    } catch (error) {
        return { configured: false, message: `Email verification failed: ${error.message}` };
    }
};

module.exports = {
    sendEmail,
    verifyEmailService,
    emailTemplates
};
