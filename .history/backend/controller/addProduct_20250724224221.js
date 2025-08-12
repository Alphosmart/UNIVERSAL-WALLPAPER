const Product = require("../models/productModel");
const User = require("../models/userModel");

async function addProductController(req, res) {
    try {
        const {
            productName,
            brandName,
            category,
            productImage,
            description,
            price,
            sellingPrice,
            stock,
            condition,
            location,
            tags
        } = req.body;

        // Validate required fields
        if (!productName || !category || !price || !sellingPrice) {
            return res.status(400).json({
                message: "Product name, category, price, and selling price are required",
                error: true,
                success: false
            });
        }

        // Get seller information
        const seller = await User.findById(req.userId);
        if (!seller) {
            return res.status(404).json({
                message: "Seller not found",
                error: true,
                success: false
            });
        }

        // Create new product
        const newProduct = new Product({
            productName,
            brandName,
            category,
            productImage: productImage || [],
            description,
            price,
            sellingPrice,
            seller: req.userId,
            sellerInfo: {
                name: seller.name,
                email: seller.email
            },
            stock: stock || 1,
            condition: condition || 'new',
            location,
            tags: tags || []
        });

        const savedProduct = await newProduct.save();

        res.status(201).json({
            message: "Product added successfully",
            data: savedProduct,
            error: false,
            success: true
        });

    } catch (err) {
        console.log("Error in addProduct:", err.message);
        res.status(500).json({
            message: "Failed to add product: " + err.message,
            error: true,
            success: false
        });
    }
}

module.exports = addProductController;
