const productModel = require("../models/productModel");

const getProductController = async(req, res) => {
    try {
        // Try to get products from database
        const allProducts = await productModel.find().sort({ createdAt: -1 });

        res.json({
            message: "All Products",
            success: true,
            error: false,
            data: allProducts
        });

    } catch (err) {
        // If database is not available, return sample data
        console.log("Database error, returning sample data:", err.message);
        
        const sampleProducts = [
            {
                _id: "1",
                productName: "boAt Airdopes 121v2",
                brandName: "boAt",
                category: "airpodes",
                productImage: ["/static/media/boAt Airdopes 121 v2 1.webp"],
                description: "boAt Airdopes 121v2 TWS Earbuds with Beast Mode(Low Latency Upto 80ms) for Gaming, ENx Tech, ASAP Charge, 14H Playtime, Bluetooth v5.0",
                price: 2990,
                sellingPrice: 1299
            },
            {
                _id: "2",
                productName: "boAt Rockerz 450",
                brandName: "boAt",
                category: "earphones",
                productImage: ["/static/media/boAt Rockerz 450.webp"],
                description: "boAt Rockerz 450 Bluetooth On Ear Headphones with Mic, Upto 15 Hours Playback, 40mm Drivers, Padded Ear Cushions, Integrated Controls and Dual Modes(Active Black)",
                price: 2990,
                sellingPrice: 1499
            }
        ];

        res.json({
            message: "Sample Products (Database not connected)",
            success: true,
            error: false,
            data: sampleProducts
        });
    }
}

module.exports = getProductController;
