const nodemailer = require('nodemailer');

// Configure email transporter (you'll need to set up your email service)
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Send order confirmation email with tracking ID
const sendOrderConfirmationEmail = async (orderData) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: orderData.buyerInfo.email,
            subject: `Order Confirmation - ${orderData.trackingInfo.trackingNumber}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">Order Confirmed! 🎉</h2>
                    
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>Order Details</h3>
                        <p><strong>Order ID:</strong> #${orderData._id.toString().slice(-8)}</p>
                        <p><strong>Tracking Number:</strong> <span style="background-color: #dbeafe; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${orderData.trackingInfo.trackingNumber}</span></p>
                        <p><strong>Total Amount:</strong> $${orderData.totalAmount}</p>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <h3>Product Details</h3>
                        <p><strong>Product:</strong> ${orderData.productDetails.productName}</p>
                        <p><strong>Brand:</strong> ${orderData.productDetails.brandName}</p>
                        <p><strong>Quantity:</strong> ${orderData.quantity}</p>
                    </div>
                    
                    <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #059669;">Track Your Order</h3>
                        <p>You can track your order using the tracking number: <strong>${orderData.trackingInfo.trackingNumber}</strong></p>
                        <p>Or visit our tracking page: <a href="${process.env.FRONTEND_URL}/track-order" style="color: #2563eb;">Track Order</a></p>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <h3>What's Next?</h3>
                        <ul>
                            <li>Your order is being processed</li>
                            <li>You'll receive updates as your order progresses</li>
                            <li>Estimated delivery: 3-5 business days</li>
                        </ul>
                    </div>
                    
                    <p style="margin-top: 30px; color: #6b7280;">
                        Thank you for shopping with us!<br>
                        If you have any questions, please contact our support team.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Order confirmation email sent successfully');
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
    }
};

// Send tracking update email
const sendTrackingUpdateEmail = async (orderData, statusUpdate) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: orderData.buyerInfo.email,
            subject: `Order Update - ${orderData.trackingInfo.trackingNumber}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">Order Status Update 📦</h2>
                    
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Tracking Number:</strong> ${orderData.trackingInfo.trackingNumber}</p>
                        <p><strong>New Status:</strong> <span style="text-transform: capitalize; color: #059669; font-weight: bold;">${statusUpdate.status.replace('_', ' ')}</span></p>
                        ${statusUpdate.location ? `<p><strong>Location:</strong> ${statusUpdate.location}</p>` : ''}
                        ${statusUpdate.note ? `<p><strong>Note:</strong> ${statusUpdate.note}</p>` : ''}
                    </div>
                    
                    <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>Track Your Order</h3>
                        <p>Get real-time updates: <a href="${process.env.FRONTEND_URL}/order-tracking/${orderData._id}" style="color: #2563eb;">View Tracking Details</a></p>
                        <p>Or use tracking number: <strong>${orderData.trackingInfo.trackingNumber}</strong></p>
                    </div>
                    
                    <p style="margin-top: 30px; color: #6b7280;">
                        Thank you for your patience!<br>
                        We'll keep you updated on your order progress.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Tracking update email sent successfully');
    } catch (error) {
        console.error('Error sending tracking update email:', error);
    }
};

module.exports = {
    sendOrderConfirmationEmail,
    sendTrackingUpdateEmail
};
