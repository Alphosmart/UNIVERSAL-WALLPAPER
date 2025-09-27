const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/productModel');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected successfully');
        
        // Get current product count
        const count = await Product.countDocuments();
        console.log(`📊 Current products in database: ${count}`);
        
        if (count === 0) {
            console.log('🆕 Creating sample products with categories...');
            
            const sampleUserId = new mongoose.Types.ObjectId();
            
            const sampleProducts = [
                {
                    productName: "Modern Geometric Wallpaper",
                    category: "Living Room",
                    brandName: "DesignCraft",
                    description: "Beautiful modern geometric patterns perfect for contemporary living spaces",
                    status: "ACTIVE",
                    seller: sampleUserId,
                    uploadedBy: sampleUserId,
                    productImage: ["sample1.jpg"],
                    pricing: {
                        originalPrice: { amount: 89.99, currency: "USD" },
                        sellingPrice: { amount: 69.99, currency: "USD" }
                    }
                },
                {
                    productName: "Vintage Floral Wallpaper",
                    category: "Bedroom", 
                    brandName: "ClassicStyles",
                    description: "Elegant vintage floral patterns for a romantic bedroom atmosphere",
                    status: "ACTIVE",
                    seller: sampleUserId,
                    uploadedBy: sampleUserId,
                    productImage: ["sample2.jpg"],
                    pricing: {
                        originalPrice: { amount: 79.99, currency: "USD" },
                        sellingPrice: { amount: 59.99, currency: "USD" }
                    }
                },
                {
                    productName: "Subway Tile Kitchen Wallpaper",
                    category: "Kitchen",
                    brandName: "KitchenPro",
                    description: "Classic subway tile pattern wallpaper perfect for kitchen backsplashes",
                    status: "ACTIVE", 
                    seller: sampleUserId,
                    uploadedBy: sampleUserId,
                    productImage: ["sample3.jpg"],
                    pricing: {
                        originalPrice: { amount: 49.99, currency: "USD" },
                        sellingPrice: { amount: 39.99, currency: "USD" }
                    }
                },
                {
                    productName: "Spa Blue Bathroom Wallpaper",
                    category: "Bathroom",
                    brandName: "AquaDesigns",
                    description: "Calming spa-inspired wallpaper perfect for bathroom renovations",
                    status: "ACTIVE",
                    seller: sampleUserId,
                    uploadedBy: sampleUserId,
                    productImage: ["sample4.jpg"],
                    pricing: {
                        originalPrice: { amount: 65.99, currency: "USD" },
                        sellingPrice: { amount: 49.99, currency: "USD" }
                    }
                },
                {
                    productName: "Minimalist Office Wallpaper",
                    category: "Office",
                    brandName: "WorkSpace",
                    description: "Clean, minimalist patterns ideal for professional office environments",
                    status: "ACTIVE",
                    seller: sampleUserId,
                    uploadedBy: sampleUserId,
                    productImage: ["sample5.jpg"],
                    pricing: {
                        originalPrice: { amount: 55.99, currency: "USD" },
                        sellingPrice: { amount: 45.99, currency: "USD" }
                    }
                },
                {
                    productName: "Fun Animals Kids Wallpaper",
                    category: "Children's Room",
                    brandName: "KidsDecor",
                    description: "Colorful animal-themed wallpaper perfect for children's bedrooms",
                    status: "ACTIVE",
                    seller: sampleUserId,
                    uploadedBy: sampleUserId,
                    productImage: ["sample6.jpg"],
                    pricing: {
                        originalPrice: { amount: 42.99, currency: "USD" },
                        sellingPrice: { amount: 32.99, currency: "USD" }
                    }
                }
            ];
            
            const result = await Product.insertMany(sampleProducts);
            console.log(`✅ Successfully created ${result.length} sample products`);
            
            // Show created categories
            const categories = await Product.aggregate([
                { $match: { status: 'ACTIVE' } },
                { $group: { _id: null, categories: { $addToSet: '$category' } } }
            ]);
            console.log('📂 Available categories:', categories[0]?.categories || []);
            
        } else {
            // Show existing categories
            const categories = await Product.aggregate([
                { $match: { status: 'ACTIVE' } },
                { $group: { _id: null, categories: { $addToSet: '$category' } } }
            ]);
            console.log('📂 Existing categories:', categories[0]?.categories || []);
            
            const brands = await Product.aggregate([
                { $match: { status: 'ACTIVE' } },
                { $group: { _id: null, brands: { $addToSet: '$brandName' } } }
            ]);
            console.log('🏷️ Existing brands:', brands[0]?.brands || []);
        }
        
        console.log('✨ Categories are now available for search suggestions!');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Database connection error:', error);
        process.exit(1);
    }
};

connectDB();