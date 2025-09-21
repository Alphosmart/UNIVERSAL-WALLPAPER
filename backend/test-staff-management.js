#!/usr/bin/env node

const mongoose = require('mongoose');
const User = require('./models/userModel');
const Product = require('./models/productModel');

async function testStaffManagement() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/ecommerce', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ Connected to MongoDB");

        // 1. Test user model with new STAFF role
        console.log("\n🔍 Testing User Model with STAFF role...");
        
        // Create a test staff user
        const timestamp = Date.now();
        const testStaff = new User({
            name: "Test Staff Member",
            email: `staff${timestamp}@example.com`,
            password: "test123",
            role: "STAFF",
            permissions: {
                canUploadProducts: true,
                canEditProducts: false,
                canDeleteProducts: false,
                canManageOrders: false,
                grantedBy: null, // Will be set by admin
                grantedAt: new Date()
            },
            uploadStats: {
                totalProducts: 0,
                lastUpload: null
            }
        });

        const savedStaff = await testStaff.save();
        console.log("✅ Staff user created successfully with ID:", savedStaff._id);
        console.log("   Role:", savedStaff.role);
        console.log("   Permissions:", savedStaff.permissions);

        // 2. Test product model with upload tracking
        console.log("\n🔍 Testing Product Model with upload tracking...");
        
        const testProduct = new Product({
            productName: "Test Product by Staff",
            brandName: "Test Brand",
            category: "electronics",
            productImage: ["test-image.jpg"],
            description: "Test product uploaded by staff member",
            price: 100,
            sellingPrice: 90,
            seller: savedStaff._id,
            uploadedBy: savedStaff._id,
            uploadedByInfo: {
                name: savedStaff.name,
                email: savedStaff.email,
                role: savedStaff.role,
                uploadedAt: new Date()
            },
            stock: 10
        });

        const savedProduct = await testProduct.save();
        console.log("✅ Product created successfully with upload tracking:");
        console.log("   Product ID:", savedProduct._id);
        console.log("   Uploaded by:", savedProduct.uploadedByInfo.name);
        console.log("   Uploader role:", savedProduct.uploadedByInfo.role);

        // 3. Test edit tracking
        console.log("\n🔍 Testing product edit tracking...");
        
        savedProduct.editHistory.push({
            editedBy: savedStaff._id,
            editedByInfo: {
                name: savedStaff.name,
                email: savedStaff.email,
                role: savedStaff.role,
                editedAt: new Date()
            },
            changes: {
                price: {
                    oldValue: 100,
                    newValue: 95
                }
            }
        });
        
        savedProduct.price = 95;
        savedProduct.lastEditedBy = savedStaff._id;
        savedProduct.lastEditedAt = new Date();
        
        await savedProduct.save();
        console.log("✅ Product edit tracking successful");
        console.log("   Edit history length:", savedProduct.editHistory.length);

        // 4. Test aggregation for upload stats
        console.log("\n🔍 Testing upload statistics aggregation...");
        
        const uploadStats = await Product.aggregate([
            {
                $group: {
                    _id: '$uploadedBy',
                    totalUploads: { $sum: 1 },
                    latestUpload: { $max: '$uploadedByInfo.uploadedAt' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'uploader'
                }
            },
            {
                $unwind: '$uploader'
            },
            {
                $project: {
                    _id: 1,
                    name: '$uploader.name',
                    email: '$uploader.email',
                    role: '$uploader.role',
                    totalUploads: 1,
                    latestUpload: 1
                }
            }
        ]);

        console.log("✅ Upload statistics aggregation successful:");
        console.log("   Stats:", JSON.stringify(uploadStats, null, 2));

        // Cleanup test data
        console.log("\n🧹 Cleaning up test data...");
        await Product.findByIdAndDelete(savedProduct._id);
        await User.findByIdAndDelete(savedStaff._id);
        console.log("✅ Test data cleaned up");

        console.log("\n🎉 All staff management tests passed successfully!");

    } catch (error) {
        console.error("❌ Test failed:", error.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log("✅ Disconnected from MongoDB");
        process.exit(0);
    }
}

// Run the test
testStaffManagement();