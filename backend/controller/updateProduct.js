const Product = require("../models/productModel");
const User = require("../models/userModel");

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

        // Get current user information
        const currentUser = await User.findById(req.userId);
        if (!currentUser) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        // Check permissions: Admin, staff with edit permissions, or original uploader
        const canEdit = currentUser.role === 'ADMIN' || 
                       (currentUser.role === 'STAFF' && currentUser.permissions?.canEditProducts) ||
                       product.uploadedBy?.toString() === req.userId;

        if (!canEdit) {
            return res.status(403).json({
                message: "Insufficient permissions to edit this product",
                error: true,
                success: false
            });
        }

        // Store previous values for edit history
        const previousValues = {};
        const fieldsToTrack = ['productName', 'brandName', 'category', 'description', 'price', 'sellingPrice', 'stock'];
        
        fieldsToTrack.forEach(field => {
            if (updateData[field] !== undefined && updateData[field] !== product[field]) {
                previousValues[field] = {
                    oldValue: product[field],
                    newValue: updateData[field]
                };
            }
        });

        // Remove fields that shouldn't be updated directly
        delete updateData.seller;
        delete updateData.sellerInfo;
        delete updateData.createdAt;
        delete updateData.updatedAt;
        delete updateData.uploadedBy;
        delete updateData.uploadedByInfo;

        // Add edit tracking information
        const editInfo = {
            editedBy: req.userId,
            editedByInfo: {
                name: currentUser.name,
                email: currentUser.email,
                role: currentUser.role,
                editedAt: new Date()
            },
            changes: previousValues
        };

        // Update the product with edit tracking
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { 
                $set: {
                    ...updateData,
                    lastEditedBy: req.userId,
                    lastEditedAt: new Date()
                },
                $push: {
                    editHistory: editInfo
                }
            },
            { new: true, runValidators: true }
        )
        .populate('uploadedBy', 'name email role');

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
