const mongoose = require('mongoose');
require('dotenv').config();
const Order = require('./models/orderModel');
const User = require('./models/userModel');

async function compareOrderData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('🔍 COMPARING BUYER VS SELLER ORDER DATA');
        console.log('==========================================');
        
        // Get all orders
        const orders = await Order.find({})
            .select('_id orderStatus trackingInfo totalAmount createdAt buyer seller product quantity');
        
        console.log(`📊 TOTAL ORDERS IN DATABASE: ${orders.length}`);
        console.log('===============================================');
        
        // Group by seller
        const ordersBySeller = {};
        const ordersByBuyer = {};
        
        orders.forEach(order => {
            const sellerId = order.seller?.toString();
            const buyerId = order.buyer?.toString();
            
            if (!ordersBySeller[sellerId]) {
                ordersBySeller[sellerId] = [];
            }
            ordersBySeller[sellerId].push(order);
            
            if (!ordersByBuyer[buyerId]) {
                ordersByBuyer[buyerId] = [];
            }
            ordersByBuyer[buyerId].push(order);
        });
        
        console.log('\n🏪 SELLER VIEW (What sellers see):');
        console.log('===================================');
        
        Object.entries(ordersBySeller).forEach(([sellerId, sellerOrders]) => {
            console.log(`Seller ID: ${sellerId.slice(-8)}`);
            console.log(`Total Orders: ${sellerOrders.length}`);
            
            const statusCounts = {};
            sellerOrders.forEach(order => {
                statusCounts[order.orderStatus] = (statusCounts[order.orderStatus] || 0) + 1;
            });
            
            console.log('Status Breakdown:');
            Object.entries(statusCounts).forEach(([status, count]) => {
                console.log(`  - ${status}: ${count}`);
            });
            console.log('');
        });
        
        console.log('👤 BUYER VIEW (What buyers see):');
        console.log('=================================');
        
        Object.entries(ordersByBuyer).forEach(([buyerId, buyerOrders]) => {
            console.log(`Buyer ID: ${buyerId.slice(-8)}`);
            console.log(`Total Orders: ${buyerOrders.length}`);
            
            const statusCounts = {};
            buyerOrders.forEach(order => {
                statusCounts[order.orderStatus] = (statusCounts[order.orderStatus] || 0) + 1;
            });
            
            console.log('Status Breakdown:');
            Object.entries(statusCounts).forEach(([status, count]) => {
                console.log(`  - ${status}: ${count}`);
            });
            console.log('');
        });
        
        console.log('🔄 DETAILED ORDER COMPARISON:');
        console.log('===============================');
        
        orders.forEach((order, index) => {
            console.log(`${index + 1}. Order ${order._id.toString().slice(-8)}`);
            console.log(`   Status: ${order.orderStatus}`);
            console.log(`   Seller: ${order.seller?.toString().slice(-8)}`);
            console.log(`   Buyer: ${order.buyer?.toString().slice(-8)}`);
            console.log(`   Tracking: ${order.trackingInfo?.trackingNumber || 'Not set'}`);
            console.log(`   Amount: $${order.totalAmount}`);
            console.log(`   Date: ${order.createdAt?.toLocaleDateString()}`);
            console.log('   ---');
        });
        
        // Data integrity check
        console.log('\n✅ DATA INTEGRITY CHECK:');
        console.log('=========================');
        
        const totalSellerOrders = Object.values(ordersBySeller).reduce((sum, orders) => sum + orders.length, 0);
        const totalBuyerOrders = Object.values(ordersByBuyer).reduce((sum, orders) => sum + orders.length, 0);
        
        console.log(`Database Orders: ${orders.length}`);
        console.log(`Seller View Orders: ${totalSellerOrders}`);
        console.log(`Buyer View Orders: ${totalBuyerOrders}`);
        console.log(`Data Consistency: ${orders.length === totalSellerOrders && totalSellerOrders === totalBuyerOrders ? '✅ PERFECT' : '❌ MISMATCH'}`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

compareOrderData();
