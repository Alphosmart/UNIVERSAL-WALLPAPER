const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Order = require('./models/orderModel');

const addTrackingNumbersToExistingOrders = async () => {
    try {
        console.log('Connecting to database...');
        
        // Find orders without tracking numbers
        const ordersWithoutTracking = await Order.find({
            $or: [
                { 'trackingInfo.trackingNumber': { $exists: false } },
                { 'trackingInfo.trackingNumber': null },
                { 'trackingInfo.trackingNumber': '' }
            ]
        });

        console.log(`Found ${ordersWithoutTracking.length} orders without tracking numbers`);

        if (ordersWithoutTracking.length === 0) {
            console.log('All orders already have tracking numbers!');
            process.exit(0);
        }

        // Generate tracking numbers for existing orders
        const generateTrackingNumber = () => {
            const timestamp = Date.now().toString().slice(-6);
            const random = Math.random().toString(36).substring(2, 6).toUpperCase();
            return `TRK${timestamp}${random}`;
        };

        for (const order of ordersWithoutTracking) {
            const trackingNumber = generateTrackingNumber();
            
            await Order.findByIdAndUpdate(order._id, {
                $set: {
                    'trackingInfo.trackingNumber': trackingNumber
                }
            });

            console.log(`Updated order ${order._id} with tracking number: ${trackingNumber}`);
            
            // Small delay to ensure unique tracking numbers
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        console.log(`Successfully updated ${ordersWithoutTracking.length} orders with tracking numbers`);
        process.exit(0);
        
    } catch (error) {
        console.error('Error updating orders:', error);
        process.exit(1);
    }
};

addTrackingNumbersToExistingOrders();
