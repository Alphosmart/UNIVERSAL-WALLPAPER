const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/userModel');
const Product = require('./models/productModel');

async function setupSingleCompany() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // 1. Find the designated company seller
        const companySeller = await User.findOne({ 
            email: 'alpho4luv@gmail.com' 
        });

        if (!companySeller) {
            console.error('❌ Company seller not found');
            return;
        }

        console.log(`👤 Found company seller: ${companySeller.name} (${companySeller.email})`);

        // 2. Update company seller status and information
        await User.findByIdAndUpdate(companySeller._id, {
            role: 'ADMIN', // Keep admin role
            sellerStatus: 'verified',
            'companyInfo.companyName': 'Main Company Store',
            'companyInfo.companyDescription': 'Official company marketplace store',
            'companyInfo.phoneNumber': '+1234567890',
            'companyInfo.businessRegistration': 'MAIN-COMPANY-001',
            'companyInfo.address': {
                street: '123 Main Street',
                city: 'Business City',
                state: 'Business State',
                zipCode: '12345',
                country: 'USA'
            }
        });

        console.log('✅ Updated company seller profile');

        // 3. Set all other users to non-sellers (except this one)
        const otherUsers = await User.updateMany(
            { 
                _id: { $ne: companySeller._id },
                sellerStatus: { $exists: true, $ne: null }
            },
            { 
                $unset: { sellerStatus: "", companyInfo: "" }
            }
        );

        console.log(`✅ Removed seller status from ${otherUsers.modifiedCount} other users`);

        // 4. Update all products to belong to the company seller
        const products = await Product.updateMany(
            {},
            { seller: companySeller._id }
        );

        console.log(`✅ Assigned ${products.modifiedCount} products to company seller`);

        // 5. Show summary
        const totalProducts = await Product.countDocuments();
        const companyProducts = await Product.countDocuments({ seller: companySeller._id });

        console.log('\n📊 SINGLE COMPANY SETUP COMPLETE');
        console.log('====================================');
        console.log(`Company Seller: ${companySeller.name} (${companySeller.email})`);
        console.log(`Company Role: ${companySeller.role}`);
        console.log(`Seller Status: verified`);
        console.log(`Total Products: ${totalProducts}`);
        console.log(`Company Products: ${companyProducts}`);
        console.log('====================================');

        await mongoose.disconnect();
        console.log('✅ Database connection closed');

    } catch (error) {
        console.error('❌ Error setting up single company:', error);
        process.exit(1);
    }
}

setupSingleCompany();