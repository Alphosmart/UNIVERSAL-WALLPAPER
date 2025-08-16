// Debug Order Cancellation Issue
const mongoose = require('mongoose');
require('dotenv').config();
const Order = require('./models/orderModel');

async function debugOrderCancellation() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to database');

        // Find a specific order that should be cancellable
        const orderToTest = '68952a229eeaa4372c0fbdab'; // shipped status
        const orderToCancel = '689146ce535e8fa21aa4bed1'; // confirmed status
        
        console.log('\n--- Checking Order Status ---');
        
        const order1 = await Order.findById(orderToTest);
        const order2 = await Order.findById(orderToCancel);
        
        console.log(`Order ${orderToTest}: Status = ${order1?.orderStatus || 'Not found'}`);
        console.log(`Order ${orderToCancel}: Status = ${order2?.orderStatus || 'Not found'}`);
        
        // Show which orders can be cancelled
        console.log('\n--- Cancellation Rules ---');
        console.log('Can cancel "pending": YES');
        console.log('Can cancel "confirmed": YES');
        console.log('Can cancel "shipped": NO (already shipped)');
        console.log('Can cancel "delivered": NO (already delivered)');
        console.log('Can cancel "cancelled": NO (already cancelled)');
        
        // Find orders that CAN be cancelled
        const cancellableOrders = await Order.find({
            orderStatus: { $in: ['pending', 'confirmed'] }
        }).limit(3);
        
        console.log('\n--- Cancellable Orders ---');
        cancellableOrders.forEach(order => {
            console.log(`ID: ${order._id}, Status: ${order.orderStatus}, User: ${order.buyer}`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

debugOrderCancellation();
