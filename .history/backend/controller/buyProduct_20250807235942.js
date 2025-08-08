const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
// const { sendOrderConfirmationEmail } = require("../utils/emailService");

async function buyProductController(req, res) {
    try {
        const {
            productId,
            quantity,
            shippingAddress,
            orderNotes
        } = req.body;

        // Validate required fields
        if (!productId || !quantity) {
            return res.status(400).json({
                message: "Product ID and quantity are required",
                error: true,
                success: false
            });
        }

        // Get product details
        const product = await Product.findById(productId).populate('seller', 'name email');
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        // Check if product is available
        if (product.status !== 'available') {
            return res.status(400).json({
                message: "Product is not available for purchase",
                error: true,
                success: false
            });
        }

        // Check stock availability
        if (product.stock < quantity) {
            return res.status(400).json({
                message: `Only ${product.stock} items available in stock`,
                error: true,
                success: false
            });
        }

        // Prevent self-purchase
        if (product.seller._id.toString() === req.userId) {
            return res.status(400).json({
                message: "You cannot buy your own product",
                error: true,
                success: false
            });
        }

        // Get buyer information
        const buyer = await User.findById(req.userId);
        if (!buyer) {
            return res.status(404).json({
                message: "Buyer not found",
                error: true,
                success: false
            });
        }

        // Calculate total amount
        const totalAmount = product.sellingPrice * quantity;

        // Create order
        const newOrder = new Order({
            buyer: req.userId,
            seller: product.seller._id,
            product: productId,
            productDetails: {
                productName: product.productName,
                brandName: product.brandName,
                category: product.category,
                price: product.price,
                sellingPrice: product.sellingPrice,
                productImage: product.productImage
            },
            quantity,
            totalAmount,
            shippingAddress,
            buyerInfo: {
                name: buyer.name,
                email: buyer.email,
                phone: buyer.phone || ''
            },
            orderNotes
        });

        const savedOrder = await newOrder.save();

        // Update product stock
        product.stock -= quantity;
        if (product.stock === 0) {
            product.status = 'sold';
        }
        await product.save();

        // Populate the order with product and seller details for response
        const populatedOrder = await Order.findById(savedOrder._id)
            .populate('product', 'productName brandName category')
            .populate('seller', 'name email')
            .populate('buyer', 'name email');

        // Send order confirmation email with tracking ID
        try {
            await sendOrderConfirmationEmail(populatedOrder);
        } catch (emailError) {
            console.log("Error sending confirmation email:", emailError.message);
            // Don't fail the order if email fails
        }

        res.status(201).json({
            message: "Order placed successfully",
            data: populatedOrder,
            error: false,
            success: true
        });

    } catch (err) {
        console.log("Error in buyProduct:", err.message);
        res.status(500).json({
            message: "Failed to place order: " + err.message,
            error: true,
            success: false
        });
    }
}

module.exports = buyProductController;
