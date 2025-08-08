const mongoose = require('mongoose');
const orderModel = require('./models/orderModel');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://alpho4luv:alphosmart@cluster0.fqmxj.mongodb.net/Ashmartshop')
    .then(() => {
        console.log('Connected to MongoDB');
        testTrackingGeneration();
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

async function testTrackingGeneration() {
    try {
        console.log('Testing automatic tracking number generation...');
        
        // Create a test order without specifying tracking number
        const testOrder = new orderModel({
            buyer: '6877823e4939dd0b7f43a0ac', // Use an existing user ID
            seller: '6877823e4939dd0b7f43a0ac',
            product: '688f2f7db16bae1276949329', // Use an existing product ID
            productDetails: {
                productName: 'Test Product',
                brandName: 'Test Brand',
                category: 'test',
                price: 100,
                sellingPrice: 90,
                productImage: []
            },
            quantity: 1,
            totalAmount: 90,
            shippingAddress: {
                street: 'Test Street',
                city: 'Test City',
                state: 'Test State',
                zipCode: '12345',
                country: 'Test Country'
            },
            buyerInfo: {
                name: 'Test Buyer',
                email: 'test@example.com',
                phone: '1234567890'
            }
        });
        
        const savedOrder = await testOrder.save();
        
        console.log('Order created successfully!');
        console.log('Order ID:', savedOrder._id);
        console.log('Generated Tracking Number:', savedOrder.trackingInfo.trackingNumber);
        console.log('Order Status:', savedOrder.orderStatus);
        console.log('Status History:', savedOrder.statusHistory);
        
        // Test that the tracking number follows the expected format
        const trackingNumber = savedOrder.trackingInfo.trackingNumber;
        const trackingPattern = /^TRK\d{6}[A-Z]{4}$/;
        
        if (trackingPattern.test(trackingNumber)) {
            console.log('✅ Tracking number format is correct:', trackingNumber);
        } else {
            console.log('❌ Tracking number format is incorrect:', trackingNumber);
        }
        
        // Clean up - delete the test order
        await orderModel.findByIdAndDelete(savedOrder._id);
        console.log('Test order cleaned up');
        
        mongoose.connection.close();
        console.log('Test completed successfully!');
        
    } catch (error) {
        console.error('Error testing tracking generation:', error);
        mongoose.connection.close();
    }
}
