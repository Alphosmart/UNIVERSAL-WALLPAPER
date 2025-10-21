const Product = require("../models/productModel");
const User = require("../models/userModel");
const CurrencyService = require("../services/currencyService");

async function getUserProductsController(req, res) {
    try {
        const userId = req.userId;
        const { status, category, currency } = req.query;

        // Get current user
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        // In single company model, only admins can access product management
        if (currentUser.role !== 'ADMIN') {
            return res.status(403).json({
                message: "Only administrators can manage company products",
                error: true,
                success: false
            });
        }

        // Get the company seller (single company admin)
        const companySeller = await User.findOne({ 
            email: 'alpho4luv@gmail.com',
            role: 'ADMIN'
        });

        if (!companySeller) {
            return res.status(500).json({
                message: "Company seller not found",
                error: true,
                success: false
            });
        }

        // Build filter object - get all company products (using uploadedBy field)
        let filter = { uploadedBy: companySeller._id };
        
        if (status) {
            filter.status = status;
        }
        
        if (category) {
            filter.category = category;
        }

        // Get company products
        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .populate('uploadedBy', 'name email role');

        // Convert prices if currency is specified
        let processedProducts = products;
        if (currency) {
            processedProducts = products.map(product => {
                const productObj = product.toObject();
                const convertedPricing = CurrencyService.convertProductPricing(productObj, currency);
                
                return {
                    ...productObj,
                    displayPricing: convertedPricing,
                    originalCurrency: productObj.pricing?.originalPrice?.currency || 'NGN'
                };
            });
        }

        res.status(200).json({
            message: "Company products retrieved successfully",
            data: processedProducts,
            count: processedProducts.length,
            currency: currency || null,
            error: false,
            success: true
        });

    } catch (err) {
        console.log("Error in getUserProducts:", err.message);
        res.status(500).json({
            message: "Failed to get company products: " + err.message,
            error: true,
            success: false
        });
    }
}

module.exports = getUserProductsController;
