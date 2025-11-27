const mongoose = require('mongoose');
const Product = require('./models/productModel');
require('dotenv').config({ path: './.env' });

// Test product names to remove
const testProductNames = [
    'Professional Brush & Roller Set',
    'Vintage Floral Wallpaper',
    'Premium Kitchen Wall Paint',
    'Spa Blue Ceiling Paint',
    'Professional Wood Stain',
    'Colorful Decorative Panels',
    'High Quality Wall Primer',
    'Modern Geometric Wallpaper',
    'Premium Vinyl Wallpaper',
    'Eggshell Wall Paint',
    '3D Decorative Panels',
    'Ceramic Floor Tiles',
    'LED Pendant Lights',
    'Luxury Vinyl Flooring'
];

// Test brand names
const testBrandNames = [
    'ToolMaster',
    'ClassicStyles',
    'KitchenPro',
    'AquaDesigns',
    'WorkSpace',
    'DecoMax'
];

async function removeTestProducts() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to database\n');

        // Find test products
        const testProducts = await Product.find({
            $or: [
                { productName: { $in: testProductNames } },
                { brandName: { $in: testBrandNames } }
            ]
        });

        console.log(`Found ${testProducts.length} test products:\n`);
        testProducts.forEach((p, i) => {
            console.log(`${i + 1}. ${p.productName} - ${p.brandName}`);
        });

        if (testProducts.length === 0) {
            console.log('\nNo test products found in database.');
            mongoose.connection.close();
            return;
        }

        console.log('\n⚠️  Do you want to delete these products? (yes/no)');
        console.log('Run this script with --confirm flag to delete:\n');
        console.log('node remove-test-products.js --confirm\n');

        if (process.argv.includes('--confirm')) {
            const result = await Product.deleteMany({
                $or: [
                    { productName: { $in: testProductNames } },
                    { brandName: { $in: testBrandNames } }
                ]
            });

            console.log(`\n✅ Successfully deleted ${result.deletedCount} test products`);
        } else {
            console.log('Preview mode - no products deleted.');
        }

        mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

removeTestProducts();
