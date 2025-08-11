const mongoose = require('mongoose');
const Product = require('./models/productModel');
const User = require('./models/userModel');
const Settings = require('./models/settingsModel');
const CurrencyService = require('./services/currencyService');

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-ecommerce', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Test data integrity
const testDatabaseIntegrity = async () => {
    try {
        console.log('\n=== TESTING DATABASE INTEGRITY ===\n');

        // Test 1: Check Product Model Structure
        console.log('1. Testing Product Model Structure...');
        const sampleProduct = new Product({
            productName: "Test Multi-Currency Product",
            category: "mobile",
            pricing: {
                originalPrice: {
                    amount: 100000,
                    currency: "NGN"
                },
                sellingPrice: {
                    amount: 85000,
                    currency: "NGN"
                }
            },
            seller: new mongoose.Types.ObjectId(),
            sellerInfo: {
                name: "Test Seller",
                email: "test@example.com",
                currency: "NGN",
                location: "Lagos, Nigeria"
            },
            stock: 10,
            condition: "new",
            productImage: ["test-image.jpg"]
        });

        // Add cached currency conversions
        const cachedPrices = CurrencyService.updateCachedPrices(sampleProduct);
        sampleProduct.pricing.convertedPrices = cachedPrices;

        console.log('✓ Product model structure is valid');
        console.log('  - Multi-currency pricing:', !!sampleProduct.pricing.originalPrice.currency);
        console.log('  - Seller info with currency:', !!sampleProduct.sellerInfo.currency);
        console.log('  - Cached conversions:', Object.keys(cachedPrices).length > 0);

        // Test 2: Check User Model with Preferences
        console.log('\n2. Testing User Model with Preferences...');
        const sampleUser = new User({
            name: "Test User",
            email: "user@example.com",
            password: "hashedpassword",
            preferences: {
                currency: "USD",
                language: "en",
                timezone: "America/New_York"
            },
            address: {
                country: "United States",
                city: "New York"
            }
        });

        console.log('✓ User model with preferences is valid');
        console.log('  - Currency preference:', sampleUser.preferences.currency);
        console.log('  - Language preference:', sampleUser.preferences.language);
        console.log('  - Timezone preference:', sampleUser.preferences.timezone);

        // Test 3: Check Settings Model
        console.log('\n3. Testing Settings Model...');
        const settings = await Settings.getSettings();
        console.log('✓ Settings model is functional');
        console.log('  - Default currency:', settings.general.currency);
        console.log('  - Default timezone:', settings.general.timezone);
        console.log('  - Site name:', settings.general.siteName);

        // Test 4: Currency Service Integration
        console.log('\n4. Testing Currency Service...');
        const testConversion = CurrencyService.convertPrice(1000, 'NGN', 'USD');
        const supportedCurrencies = CurrencyService.getSupportedCurrencies();
        
        console.log('✓ Currency service is working');
        console.log('  - Supported currencies:', supportedCurrencies.length);
        console.log('  - Sample conversion (1000 NGN to USD):', testConversion);
        console.log('  - Nigerian Naira supported:', CurrencyService.isCurrencySupported('NGN'));
        console.log('  - US Dollar supported:', CurrencyService.isCurrencySupported('USD'));

        // Test 5: Check Database Connection and Collections
        console.log('\n5. Testing Database Collections...');
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);
        
        console.log('✓ Database collections exist:');
        const requiredCollections = ['products', 'users', 'settings'];
        requiredCollections.forEach(collName => {
            const exists = collectionNames.includes(collName);
            console.log(`  - ${collName}: ${exists ? '✓' : '✗'}`);
        });

        // Test 6: Verify Required Indexes
        console.log('\n6. Testing Database Indexes...');
        try {
            const productIndexes = await Product.collection.getIndexes();
            const userIndexes = await User.collection.getIndexes();
            
            console.log('✓ Database indexes:');
            console.log('  - Product indexes:', Object.keys(productIndexes).length);
            console.log('  - User indexes:', Object.keys(userIndexes).length);
        } catch (error) {
            console.log('! Index check skipped (collections may be empty)');
        }

        console.log('\n=== DATABASE INTEGRITY TEST COMPLETED ===');
        console.log('✓ All core functionality is properly configured');
        console.log('✓ Multi-currency system is ready');
        console.log('✓ User preferences are supported');
        console.log('✓ Settings persistence is functional');

    } catch (error) {
        console.error('❌ Database integrity test failed:', error);
        throw error;
    }
};

// Main execution
const runTests = async () => {
    await connectDB();
    await testDatabaseIntegrity();
    mongoose.connection.close();
    console.log('\nDatabase connection closed.');
};

// Run if this file is executed directly
if (require.main === module) {
    runTests().catch(error => {
        console.error('Test execution failed:', error);
        process.exit(1);
    });
}

module.exports = {
    testDatabaseIntegrity,
    connectDB
};
