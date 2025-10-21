const orderModel = require('../models/orderModel');
// const { sendTrackingUpdateEmail } = require('../utils/emailService');

// Get order tracking information by order ID
async function getOrderTracking(request, response) {
    try {
        const { orderId } = request.params;
        const currentUserId = request.userId;

        // Find order and ensure it belongs to the current user (buyer)
        const order = await orderModel.findById(orderId)
            .populate('product', 'productName brandName category productImage')
            .populate('uploadedBy', 'name email role')
            .populate('buyer', 'name email');

        if (!order) {
            return response.status(404).json({
                message: "Order not found",
                error: true,
                success: false
            });
        }

        // Check if the current user is the buyer of this order
        if (order.buyer._id.toString() !== currentUserId) {
            return response.status(403).json({
                message: "You can only track your own orders",
                error: true,
                success: false
            });
        }

        response.status(200).json({
            message: "Order tracking information retrieved successfully",
            data: {
                orderId: order._id,
                orderStatus: order.orderStatus,
                paymentStatus: order.paymentStatus,
                trackingInfo: order.trackingInfo,
                statusHistory: order.statusHistory,
                productDetails: order.productDetails,
                quantity: order.quantity,
                totalAmount: order.totalAmount,
                shippingAddress: order.shippingAddress,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            },
            success: true,
            error: false
        });

    } catch (err) {
        console.error("Error in getOrderTracking:", err);
        response.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

// Get all orders for the current buyer with tracking info
async function getBuyerOrdersWithTracking(request, response) {
    try {
        const currentUserId = request.userId;

        // Get orders where the current user is the buyer
        const orders = await orderModel.find({
            buyer: currentUserId
        })
        .populate('product', 'productName brandName category productImage')
        .populate('uploadedBy', 'name email role')
        .sort({ createdAt: -1 }); // Latest orders first

        const ordersWithTracking = orders.map(order => ({
            orderId: order._id,
            orderStatus: order.orderStatus,
            paymentStatus: order.paymentStatus,
            trackingInfo: order.trackingInfo,
            productDetails: order.productDetails,
            quantity: order.quantity,
            totalAmount: order.totalAmount,
            seller: {
                name: order.seller.name,
                email: order.seller.email
            },
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            latestStatusUpdate: order.statusHistory.length > 0 
                ? order.statusHistory[order.statusHistory.length - 1] 
                : null
        }));

        response.status(200).json({
            message: "Buyer orders with tracking retrieved successfully",
            data: ordersWithTracking,
            success: true,
            error: false
        });

    } catch (err) {
        console.error("Error in getBuyerOrdersWithTracking:", err);
        response.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

// Update order status and tracking (for sellers/admins)
async function updateOrderTracking(request, response) {
    try {
        const { orderId } = request.params;
        const {
            orderStatus,
            trackingNumber,
            carrier,
            estimatedDelivery,
            currentLocation,
            note
        } = request.body;

        const currentUserId = request.userId;

        // Find the order
        const order = await orderModel.findById(orderId);

        if (!order) {
            return response.status(404).json({
                message: "Order not found",
                error: true,
                success: false
            });
        }

        // Check if the current user is the seller or admin
        if (order.seller.toString() !== currentUserId) {
            return response.status(403).json({
                message: "You can only update orders that you are selling",
                error: true,
                success: false
            });
        }

        // Update order status if provided
        if (orderStatus) {
            order.orderStatus = orderStatus;
            
            // Add to status history
            order.statusHistory.push({
                status: orderStatus,
                timestamp: new Date(),
                note: note || `Order status updated to ${orderStatus}`,
                location: currentLocation || order.trackingInfo.currentLocation
            });
        }

        // Update tracking information
        if (trackingNumber) {
            order.trackingInfo.trackingNumber = trackingNumber;
        }
        if (carrier) {
            order.trackingInfo.carrier = carrier;
        }
        if (estimatedDelivery) {
            order.trackingInfo.estimatedDelivery = new Date(estimatedDelivery);
        }
        if (currentLocation) {
            order.trackingInfo.currentLocation = currentLocation;
        }

        await order.save();

        // Send tracking update email if status was changed
        if (orderStatus) {
            try {
                const statusUpdate = {
                    status: orderStatus,
                    note: note || `Order status updated to ${orderStatus}`,
                    location: currentLocation || order.trackingInfo.currentLocation
                };
                // await sendTrackingUpdateEmail(order, statusUpdate);
                console.log("Order tracking updated:", order.trackingInfo?.trackingNumber, "Status:", orderStatus);
            } catch (emailError) {
                console.log("Error sending tracking update email:", emailError.message);
                // Don't fail the update if email fails
            }
        }

        response.status(200).json({
            message: "Order tracking updated successfully",
            data: {
                orderId: order._id,
                orderStatus: order.orderStatus,
                trackingInfo: order.trackingInfo,
                statusHistory: order.statusHistory
            },
            success: true,
            error: false
        });

    } catch (err) {
        console.error("Error in updateOrderTracking:", err);
        response.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

// Track order by tracking number (public endpoint)
async function trackByTrackingNumber(request, response) {
    try {
        const { trackingNumber } = request.params;

        const order = await orderModel.findOne({
            'trackingInfo.trackingNumber': trackingNumber
        })
        .populate('product', 'productName brandName category')
        .select('orderStatus trackingInfo statusHistory productDetails quantity totalAmount createdAt');

        if (!order) {
            return response.status(404).json({
                message: "Order not found with this tracking number",
                error: true,
                success: false
            });
        }

        response.status(200).json({
            message: "Order tracking information retrieved successfully",
            data: {
                orderStatus: order.orderStatus,
                trackingInfo: order.trackingInfo,
                statusHistory: order.statusHistory,
                productDetails: order.productDetails,
                quantity: order.quantity,
                totalAmount: order.totalAmount,
                orderDate: order.createdAt
            },
            success: true,
            error: false
        });

    } catch (err) {
        console.error("Error in trackByTrackingNumber:", err);
        response.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

module.exports = {
    getOrderTracking,
    getBuyerOrdersWithTracking,
    updateOrderTracking,
    trackByTrackingNumber
};
