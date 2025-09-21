const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");

async function buyMultipleProducts(request, response) {
    try {
        const currentUserId = request.userId;
        const { 
            cartItems, // Array of { productId, quantity }
            shippingAddress,
            buyerInfo,
            customerInfo,
            paymentMethod,
            orderNotes 
        } = request.body;

        // Validate required fields
        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            return response.status(400).json({
                message: "Cart items array is required and cannot be empty",
                error: true,
                success: false
            });
        }

        if (!shippingAddress) {
            return response.status(400).json({
                message: "Shipping address is required",
                error: true,
                success: false
            });
        }

        // Use customerInfo if buyerInfo is not provided (for compatibility)
        const finalBuyerInfo = buyerInfo || customerInfo;

        // Get current user details
        const currentUser = await userModel.findById(currentUserId);
        if (!currentUser) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        const createdOrders = [];
        let totalOrderAmount = 0;

        // Process each item in the cart
        for (const item of cartItems) {
            const { productId, quantity } = item;

            if (!productId || !quantity || quantity <= 0) {
                return response.status(400).json({
                    message: "Each item must have valid productId and quantity",
                    error: true,
                    success: false
                });
            }

            // Get product details
            const product = await productModel.findById(productId);
            if (!product) {
                return response.status(404).json({
                    message: `Product with ID ${productId} not found`,
                    error: true,
                    success: false
                });
            }

            // Check if product is available
            const availableStock = product.countInStock || product.stock || 0;
            if (availableStock < quantity) {
                return response.status(400).json({
                    message: `Insufficient stock for product ${product.productName}. Available: ${availableStock}, Requested: ${quantity}`,
                    error: true,
                    success: false
                });
            }

            // Check if user is trying to buy their own product
            if (product.seller && product.seller.toString() === currentUserId) {
                return response.status(400).json({
                    message: `You cannot buy your own product: ${product.productName}`,
                    error: true,
                    success: false
                });
            }

            // Calculate total amount for this item
            const itemTotal = product.sellingPrice * quantity;
            totalOrderAmount += itemTotal;

            // Create order for this product
            const orderPayload = {
                buyer: currentUserId,
                seller: product.seller,
                product: productId,
                productDetails: {
                    productName: product.productName,
                    brandName: product.brandName,
                    category: product.category,
                    price: product.price,
                    sellingPrice: product.sellingPrice,
                    productImage: product.productImage
                },
                quantity: quantity,
                totalAmount: itemTotal,
                shippingAddress: shippingAddress,
                buyerInfo: finalBuyerInfo,
                orderNotes: orderNotes || "",
                paymentMethod: paymentMethod || "cashOnDelivery"
            };

            const order = new orderModel(orderPayload);
            const savedOrder = await order.save();
            createdOrders.push(savedOrder);

            // Update product stock
            const updateData = {};
            if (product.countInStock !== undefined) {
                updateData.$inc = { countInStock: -quantity };
            } else if (product.stock !== undefined) {
                updateData.$inc = { stock: -quantity };
            }
            
            if (updateData.$inc) {
                await productModel.findByIdAndUpdate(productId, updateData);
            }
        }

        response.status(201).json({
            data: {
                orders: createdOrders,
                totalOrderAmount: totalOrderAmount,
                totalItems: cartItems.length,
                orderSummary: {
                    buyer: {
                        name: finalBuyerInfo?.name,
                        email: finalBuyerInfo?.email,
                        phone: finalBuyerInfo?.phone
                    },
                    shippingAddress: shippingAddress,
                    paymentMethod: paymentMethod || "cashOnDelivery",
                    orderDate: new Date().toISOString()
                }
            },
            message: `Successfully created ${createdOrders.length} orders`,
            success: true,
            error: false
        });

    } catch (err) {
        console.error("Error in buyMultipleProducts:", err);
        response.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

module.exports = buyMultipleProducts;
