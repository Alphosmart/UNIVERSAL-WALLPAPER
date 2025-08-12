const Product = require("../models/productModel");

async function updateProductController(req, res) {
    try {
        const { productId } = req.params;
        const updateData = req.body;

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
                message: "You can only update your own products",
                error: true,
                success: false
            });
        }

        // Remove fields that shouldn't be updated directly
        delete updateData.seller;
        delete updateData.sellerInfo;
        delete updateData.createdAt;
        delete updateData.updatedAt;

        // Update the product
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate('seller', 'name email');

        res.status(200).json({
            message: "Product updated successfully",
            data: updatedProduct,
            error: false,
            success: true
        });

    } catch (err) {
        console.log("Error in updateProduct:", err.message);
        res.status(500).json({
            message: "Failed to update product: " + err.message,
            error: true,
            success: false
        });
    }
}

module.exports = updateProductController;
