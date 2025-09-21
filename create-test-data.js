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
                productName: "Premium Vinyl Wallpaper",
                brandName: "DecoMax",
                category: "wallpapers",
                productImage: ["https://example.com/wallpaper.jpg"],
                description: "High-quality vinyl wallpaper with elegant patterns",
                price: 45,
                sellingPrice: 40,
                stock: 50,
                status: "ACTIVE",
                sellerId: seller._id
            },
            {
                productName: "Interior Wall Paint - Eggshell Finish",
                brandName: "ColorPro",
                category: "wall-paint",
                productImage: ["https://example.com/paint.jpg"],
                description: "Premium quality wall paint with durable eggshell finish",
                price: 35,
                sellingPrice: 30,
                stock: 100,
                status: "ACTIVE",
                sellerId: seller._id
            },
            {
                productName: "Decorative Wall Panels",
                brandName: "WallArt",
                category: "decorative-panels",
                productImage: ["https://example.com/panels.jpg"],
                description: "3D decorative wall panels for modern interiors",
                price: 25,
                sellingPrice: 22,
                stock: 75,
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
