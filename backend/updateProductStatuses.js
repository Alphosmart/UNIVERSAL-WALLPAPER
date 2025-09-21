const mongoose = require('mongoose');
const productModel = require('./models/productModel');
require('dotenv').config();

// Connect to MongoDB
async function updateProductStatuses() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Update all products with old status values to new ones
        const updateResult = await productModel.updateMany(
            { status: 'available' },
            { $set: { status: 'ACTIVE' } }
        );

        const updateResult2 = await productModel.updateMany(
            { status: 'sold' },
            { $set: { status: 'SOLD' } }
        );

        const updateResult3 = await productModel.updateMany(
            { status: 'pending' },
            { $set: { status: 'PENDING' } }
        );

        console.log('Updated products:');
        console.log('available -> ACTIVE:', updateResult.modifiedCount);
        console.log('sold -> SOLD:', updateResult2.modifiedCount);
        console.log('pending -> PENDING:', updateResult3.modifiedCount);

        // Show all products after update
        const allProducts = await productModel.find({});
        console.log('\nAll products after update:');
        allProducts.forEach(product => {
            console.log(`- ${product.productName}: ${product.status}`);
        });

        await mongoose.disconnect();
        console.log('\nDatabase updated successfully!');
    } catch (error) {
        console.error('Error updating database:', error);
        process.exit(1);
    }
}

updateProductStatuses();
