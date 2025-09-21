const mongoose = require('mongoose');
require('dotenv').config();

async function diagnoseMongoDB() {
    console.log('🔍 MongoDB Connection Diagnostics');
    console.log('================================\n');
    
    // 1. Check environment variables
    console.log('1. Environment Check:');
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.log('❌ MONGODB_URI not found in environment variables');
        return;
    }
    
    // Mask credentials for display
    const maskedUri = mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
    console.log('✅ MONGODB_URI found:', maskedUri);
    console.log('');
    
    // 2. Parse connection string
    console.log('2. Connection String Analysis:');
    try {
        const url = new URL(mongoUri.replace('mongodb+srv://', 'https://'));
        console.log('✅ Host:', url.hostname);
        console.log('✅ Database:', mongoUri.split('/').pop()?.split('?')[0]);
        console.log('✅ SSL:', mongoUri.includes('ssl=true') ? 'Enabled' : 'Auto');
    } catch (err) {
        console.log('❌ Invalid connection string format');
    }
    console.log('');
    
    // 3. Test DNS resolution
    console.log('3. DNS Resolution Test:');
    try {
        const dns = require('dns').promises;
        const hostname = 'ecommerce.8sk43ml.mongodb.net';
        const addresses = await dns.resolve(hostname);
        console.log('✅ DNS resolution successful:', addresses.slice(0, 2), '...');
    } catch (err) {
        console.log('❌ DNS resolution failed:', err.message);
    }
    console.log('');
    
    // 4. Test MongoDB connection with various timeout settings
    console.log('4. MongoDB Connection Test:');
    const testConfigurations = [
        {
            name: 'Quick Connect (5s timeout)',
            options: {
                serverSelectionTimeoutMS: 5000,
                connectTimeoutMS: 5000,
                socketTimeoutMS: 5000,
            }
        },
        {
            name: 'Standard Connect (30s timeout)',
            options: {
                serverSelectionTimeoutMS: 30000,
                connectTimeoutMS: 30000,
                socketTimeoutMS: 30000,
            }
        }
    ];
    
    for (const config of testConfigurations) {
        console.log(`\n   Testing: ${config.name}`);
        try {
            const startTime = Date.now();
            await mongoose.connect(mongoUri, config.options);
            const connectionTime = Date.now() - startTime;
            
            console.log(`   ✅ Connection successful! (${connectionTime}ms)`);
            
            // Test a simple operation
            const collections = await mongoose.connection.db.listCollections().toArray();
            console.log(`   ✅ Database accessible (${collections.length} collections found)`);
            
            await mongoose.disconnect();
            console.log('   ✅ Clean disconnect successful');
            break;
            
        } catch (err) {
            console.log(`   ❌ Connection failed: ${err.message}`);
            if (err.name === 'MongoServerSelectionError') {
                console.log('   💡 This usually indicates network/firewall issues');
            }
        }
    }
    
    console.log('\n🔧 Troubleshooting Steps:');
    console.log('1. Check MongoDB Atlas Network Access (IP Whitelist)');
    console.log('2. Verify database user permissions');
    console.log('3. Confirm cluster is running (not paused)');
    console.log('4. Test internet connectivity');
    console.log('5. Check firewall settings');
}

diagnoseMongoDB().catch(console.error).finally(() => process.exit(0));
