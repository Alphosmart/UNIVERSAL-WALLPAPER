const Product = require("../models/productModel");

async function getUserProductsController(req, res) {
    try {
        const userId = req.userId;
        const { status, category } = req.query;

        // Build filter object
        let filter = { seller: userId };
        
        if (status) {
            filter.status = status;
        }
        
        if (category) {
            filter.category = category;
        }

        // Get user's products
        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .populate('seller', 'name email');

        res.status(200).json({
            message: "User products retrieved successfully",
            data: products,
            count: products.length,
            error: false,
            success: true
        });

    } catch (err) {
        console.log("Error in getUserProducts:", err.message);
        res.status(500).json({
            message: "Failed to get user products: " + err.message,
            error: true,
            success: false
        });
    }
}

module.exports = getUserProductsController;
