const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/productModel');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected successfully');
        
        // Clear existing test products
        const deleteResult = await Product.deleteMany({});
        console.log(`🗑️ Cleared ${deleteResult.deletedCount} existing products`);
        
        console.log('🆕 Creating sample products with correct product categories...');
        
        const sampleUserId = new mongoose.Types.ObjectId();
        
        const sampleProducts = [
            {
                productName: "Modern Geometric Wallpaper",
                category: "wallpapers",
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
                category: "wallpapers", 
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
                productName: "Premium Kitchen Wall Paint",
                category: "wall-paint",
                brandName: "KitchenPro",
                description: "Durable, easy-to-clean wall paint perfect for kitchen spaces",
                status: "ACTIVE",
                seller: sampleUserId,
                uploadedBy: sampleUserId,
                productImage: ["sample3.jpg"],
                pricing: {
                    originalPrice: { amount: 45.99, currency: "USD" },
                    sellingPrice: { amount: 35.99, currency: "USD" }
                }
            },
            {
                productName: "Spa Blue Ceiling Paint",
                category: "ceiling-paint",
                brandName: "AquaDesigns",
                description: "Relaxing spa-inspired ceiling paint for bathroom spaces",
                status: "ACTIVE",
                seller: sampleUserId,
                uploadedBy: sampleUserId,
                productImage: ["sample4.jpg"],
                pricing: {
                    originalPrice: { amount: 52.99, currency: "USD" },
                    sellingPrice: { amount: 42.99, currency: "USD" }
                }
            },
            {
                productName: "Professional Wood Stain",
                category: "wood-stain",
                brandName: "WorkSpace",
                description: "High-quality wood stain for office furniture and panels",
                status: "ACTIVE",
                seller: sampleUserId,
                uploadedBy: sampleUserId,
                productImage: ["sample5.jpg"],
                pricing: {
                    originalPrice: { amount: 38.99, currency: "USD" },
                    sellingPrice: { amount: 29.99, currency: "USD" }
                }
            },
            {
                productName: "Colorful Decorative Panels",
                category: "decorative-panels",
                brandName: "KidsDecor",
                description: "Vibrant decorative panels perfect for children's rooms",
                status: "ACTIVE",
                seller: sampleUserId,
                uploadedBy: sampleUserId,
                productImage: ["sample6.jpg"],
                pricing: {
                    originalPrice: { amount: 65.99, currency: "USD" },
                    sellingPrice: { amount: 55.99, currency: "USD" }
                }
            },
            {
                productName: "High Quality Wall Primer",
                category: "primer",
                brandName: "BaseCoat",
                description: "Professional wall primer for perfect paint adhesion",
                status: "ACTIVE",
                seller: sampleUserId,
                uploadedBy: sampleUserId,
                productImage: ["sample7.jpg"],
                pricing: {
                    originalPrice: { amount: 28.99, currency: "USD" },
                    sellingPrice: { amount: 22.99, currency: "USD" }
                }
            },
            {
                productName: "Professional Brush & Roller Set",
                category: "brushes-rollers",
                brandName: "ToolMaster",
                description: "Complete set of professional brushes and rollers for painting",
                status: "ACTIVE",
                seller: sampleUserId,
                uploadedBy: sampleUserId,
                productImage: ["sample8.jpg"],
                pricing: {
                    originalPrice: { amount: 34.99, currency: "USD" },
                    sellingPrice: { amount: 26.99, currency: "USD" }
                }
            }
        ];

        // Insert the sample products
        const insertResult = await Product.insertMany(sampleProducts);
        console.log(`✅ Successfully created ${insertResult.length} sample products`);

        // Get all unique categories
        const categories = await Product.distinct('category', { status: 'ACTIVE' });
        console.log('📂 Available product categories:', categories.sort());
        
        // Get all unique brands
        const brands = await Product.distinct('brandName', { status: 'ACTIVE' });
        console.log('🏷️ Available brands:', brands.sort());
        
        console.log('✨ Product categories are now properly aligned with the add product form!');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        mongoose.disconnect();
        console.log('📤 Database connection closed');
    }
};

connectDB();