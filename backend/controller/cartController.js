const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// Get user's cart
const getUserCart = async (req, res) => {
    try {
        const userId = req.userId;
        
        let cart = await Cart.findOne({ userId }).populate('items.productId');
        
        if (!cart) {
            cart = new Cart({ userId, items: [] });
            await cart.save();
        }

        res.json({
            message: "Cart retrieved successfully",
            data: cart,
            success: true,
            error: false
        });
    } catch (err) {
        console.error("Error getting user cart:", err);
        res.status(500).json({
            message: err.message || "Failed to get cart",
            error: true,
            success: false
        });
    }
};

// Add item to cart
const addToCart = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({
                message: "Product ID is required",
                error: true,
                success: false
            });
        }

        // Verify product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        let cart = await Cart.findOne({ userId });
        
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (existingItemIndex > -1) {
            // Update quantity of existing item
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item to cart
            cart.items.push({
                productId: product._id,
                productName: product.productName,
                price: product.price,
                sellingPrice: product.sellingPrice,
                quantity: quantity,
                productImage: product.productImage?.[0] || '',
                category: product.category,
                brandName: product.brandName
            });
        }

        await cart.save();
        await cart.populate('items.productId');

        res.json({
            message: "Item added to cart successfully",
            data: cart,
            success: true,
            error: false
        });
    } catch (err) {
        console.error("Error adding to cart:", err);
        res.status(500).json({
            message: err.message || "Failed to add item to cart",
            error: true,
            success: false
        });
    }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId, quantity } = req.body;

        if (!productId || quantity === undefined) {
            return res.status(400).json({
                message: "Product ID and quantity are required",
                error: true,
                success: false
            });
        }

        const cart = await Cart.findOne({ userId });
        
        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
                error: true,
                success: false
            });
        }

        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                message: "Item not found in cart",
                error: true,
                success: false
            });
        }

        if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            cart.items.splice(itemIndex, 1);
        } else {
            // Update quantity
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();
        await cart.populate('items.productId');

        res.json({
            message: "Cart updated successfully",
            data: cart,
            success: true,
            error: false
        });
    } catch (err) {
        console.error("Error updating cart:", err);
        res.status(500).json({
            message: err.message || "Failed to update cart",
            error: true,
            success: false
        });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId } = req.params;

        const cart = await Cart.findOne({ userId });
        
        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
                error: true,
                success: false
            });
        }

        cart.items = cart.items.filter(
            item => item.productId.toString() !== productId
        );

        await cart.save();
        await cart.populate('items.productId');

        res.json({
            message: "Item removed from cart successfully",
            data: cart,
            success: true,
            error: false
        });
    } catch (err) {
        console.error("Error removing from cart:", err);
        res.status(500).json({
            message: err.message || "Failed to remove item from cart",
            error: true,
            success: false
        });
    }
};

// Clear entire cart
const clearCart = async (req, res) => {
    try {
        const userId = req.userId;

        const cart = await Cart.findOne({ userId });
        
        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
                error: true,
                success: false
            });
        }

        cart.items = [];
        await cart.save();

        res.json({
            message: "Cart cleared successfully",
            data: cart,
            success: true,
            error: false
        });
    } catch (err) {
        console.error("Error clearing cart:", err);
        res.status(500).json({
            message: err.message || "Failed to clear cart",
            error: true,
            success: false
        });
    }
};

// Sync local cart with server cart (for when user logs in)
const syncCart = async (req, res) => {
    try {
        const userId = req.userId;
        const { localCartItems = [] } = req.body;

        let cart = await Cart.findOne({ userId });
        
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Merge local cart items with server cart
        for (const localItem of localCartItems) {
            // Verify product still exists
            const product = await Product.findById(localItem._id || localItem.productId);
            if (!product) continue;

            const existingItemIndex = cart.items.findIndex(
                item => item.productId.toString() === (localItem._id || localItem.productId)
            );

            if (existingItemIndex > -1) {
                // Update quantity (use higher quantity)
                cart.items[existingItemIndex].quantity = Math.max(
                    cart.items[existingItemIndex].quantity,
                    localItem.quantity || 1
                );
            } else {
                // Add new item from local cart
                cart.items.push({
                    productId: product._id,
                    productName: product.productName,
                    price: product.price,
                    sellingPrice: product.sellingPrice,
                    quantity: localItem.quantity || 1,
                    productImage: product.productImage?.[0] || '',
                    category: product.category,
                    brandName: product.brandName
                });
            }
        }

        await cart.save();
        await cart.populate('items.productId');

        res.json({
            message: "Cart synced successfully",
            data: cart,
            success: true,
            error: false
        });
    } catch (err) {
        console.error("Error syncing cart:", err);
        res.status(500).json({
            message: err.message || "Failed to sync cart",
            error: true,
            success: false
        });
    }
};

module.exports = {
    getUserCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    syncCart
};
