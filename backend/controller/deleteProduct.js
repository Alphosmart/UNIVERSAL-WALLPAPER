const Product = require("../models/productModel");
const Order = require("../models/orderModel");

async function deleteProductController(req, res) {
    try {
        const { productId } = req.params;

        // Find the product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        // Check if user is the seller
        if (product.seller.toString() !== req.userId) {
            return res.status(403).json({
                message: "You can only delete your own products",
                error: true,
                success: false
            });
        }

        // Check if there are any pending orders for this product
        const pendingOrders = await Order.find({
            product: productId,
            orderStatus: { $in: ['pending', 'confirmed', 'shipped'] }
        });

        if (pendingOrders.length > 0) {
            return res.status(400).json({
                message: "Cannot delete product with pending orders. Please complete or cancel all orders first.",
                error: true,
                success: false
            });
        }

        // Delete the product
        await Product.findByIdAndDelete(productId);

        res.status(200).json({
            message: "Product deleted successfully",
            error: false,
            success: true
        });

    } catch (err) {
        console.log("Error in deleteProduct:", err.message);
        res.status(500).json({
            message: "Failed to delete product: " + err.message,
            error: true,
            success: false
        });
    }
}

module.exports = deleteProductController;
