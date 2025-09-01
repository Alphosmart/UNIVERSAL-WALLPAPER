const mongoose = require('mongoose');
const User = require('./backend/models/userModel');
const Product = require('./backend/models/productModel');

async function createTestData() {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect('mongodb://localhost:27017/E-commerce');
        console.log('Connected to MongoDB');

        // Update seller user to SELLER role
        const seller = await User.findOneAndUpdate(
            { email: "seller@test.com" },
            { role: "SELLER", sellerStatus: "active" },
            { new: true }
        );
        console.log('Updated seller:', seller.email, seller.role);

        // Create an admin user
        const existingAdmin = await User.findOne({ email: "admin@test.com" });
        if (!existingAdmin) {
            const bcrypt = require('bcrypt');
            const hashedPassword = await bcrypt.hash('password123', 10);
            
            const admin = new User({
                name: "Test Admin",
                email: "admin@test.com",
                password: hashedPassword,
                role: "ADMIN"
            });
            await admin.save();
            console.log('Created admin user');
        }

        // Create test products
        const products = [
            {
                productName: "Laptop",
                brandName: "TechBrand",
                category: "Electronics",
                productImage: ["https://example.com/laptop.jpg"],
                description: "High-performance laptop for work and gaming",
                price: 1000,
                sellingPrice: 900,
                stock: 5,
                status: "ACTIVE",
                sellerId: seller._id
            },
            {
                productName: "Smartphone",
                brandName: "MobileBrand",
                category: "Electronics",
                productImage: ["https://example.com/phone.jpg"],
                description: "Latest smartphone with advanced features",
                price: 800,
                sellingPrice: 700,
                stock: 10,
                status: "ACTIVE",
                sellerId: seller._id
            },
            {
                productName: "Headphones",
                brandName: "AudioBrand",
                category: "Electronics",
                productImage: ["https://example.com/headphones.jpg"],
                description: "Wireless noise-cancelling headphones",
                price: 200,
                sellingPrice: 180,
                stock: 15,
                status: "ACTIVE",
                sellerId: seller._id
            }
        ];

        for (const productData of products) {
            const existingProduct = await Product.findOne({ productName: productData.productName });
            if (!existingProduct) {
                const product = new Product(productData);
                await product.save();
                console.log('Created product:', product.productName);
            } else {
                console.log('Product already exists:', productData.productName);
            }
        }

        console.log('Test data creation completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating test data:', error);
        process.exit(1);
    }
}

createTestData();
