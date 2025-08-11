const mongoose = require('mongoose');

// Import models to register them
const productModel = require('./models/productModel');
const orderModel = require('./models/orderModel');
const userModel = require('./models/userModel');

console.log('Registered models:');
console.log(Object.keys(mongoose.models));

console.log('\nProduct model name:', productModel.modelName);
console.log('Order model name:', orderModel.modelName);
console.log('User model name:', userModel.modelName);

// Check if 'product' (lowercase) is registered
if (mongoose.models.product) {
    console.log('\n❌ ERROR: Old "product" model is still registered!');
} else {
    console.log('\n✅ Old "product" model is not registered (good)');
}

// Check if 'Product' (capitalized) is registered  
if (mongoose.models.Product) {
    console.log('✅ New "Product" model is registered (good)');
} else {
    console.log('❌ ERROR: New "Product" model is not registered!');
}

console.log('\nAll models registered in mongoose:', Object.keys(mongoose.models));
