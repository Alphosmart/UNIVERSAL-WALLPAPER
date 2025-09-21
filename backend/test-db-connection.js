const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Testing MongoDB Connection...');
console.log('Connection String:', process.env.MONGODB_URI?.replace(/:[^:@]*@/, ':****@'));

async function testConnection() {
    try {
        console.log('📡 Attempting to connect...');
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000
        });
        
        console.log('✅ MongoDB connection successful!');
        await mongoose.connection.close();
        console.log('🔌 Connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ MongoDB connection failed:');
        console.error('Error:', error.message);
        
        if (error.message.includes('ecommerce.8sk43ml.mongodb.net')) {
            console.log('\n🔧 Troubleshooting suggestions:');
            console.log('1. Check if your cluster is running in MongoDB Atlas');
            console.log('2. Verify the connection string is correct');
            console.log('3. Make sure your IP is whitelisted: 102.91.102.13');
            console.log('4. Check your username/password in the connection string');
        }
        
        process.exit(1);
    }
}

testConnection();
