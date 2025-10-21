const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const { sendEmail } = require("../services/emailService");

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
        const product = await Product.findById(productId).populate('uploadedBy', 'name email role');
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        // Check if product is available
        if (product.status !== 'ACTIVE') {
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
        console.log('Order saved:', savedOrder._id);
        console.log('Tracking number after save:', savedOrder.trackingInfo?.trackingNumber);

        // Update product stock
        product.stock -= quantity;
        if (product.stock === 0) {
            product.status = 'sold';
        }
        await product.save();

        // Populate the order with product and seller details for response
        const populatedOrder = await Order.findById(savedOrder._id)
            .populate('product', 'productName brandName category')
            .populate('uploadedBy', 'name email role')
            .populate('buyer', 'name email');

        // Send order confirmation email with tracking ID
        try {
            await sendEmail(buyer.email, 'orderConfirmation', {
                customerName: buyer.name,
                orderId: populatedOrder._id.toString().slice(-8),
                trackingNumber: populatedOrder.trackingInfo?.trackingNumber,
                totalAmount: populatedOrder.totalAmount,
                productName: populatedOrder.productDetails.productName,
                brandName: populatedOrder.productDetails.brandName,
                quantity: populatedOrder.quantity,
                orderDate: new Date().toLocaleDateString(),
                estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()
            });
            console.log("Order confirmation email sent successfully with tracking ID:", populatedOrder.trackingInfo?.trackingNumber);
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
