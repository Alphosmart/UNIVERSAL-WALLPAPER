const Order = require("../models/orderModel");

async function updateOrderStatusController(req, res) {
    try {
        const { orderId } = req.params;
        const { orderStatus, paymentStatus } = req.body;

        // Find the order
        const order = await Order.findById(orderId)
            .populate('product', 'productName')
            .populate('uploadedBy', 'name email role')
            .populate('buyer', 'name email');

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                error: true,
                success: false
            });
        }

        // Check if user is either the buyer or seller
        const isAuthorized = order.buyer._id.toString() === req.userId || 
                           order.seller._id.toString() === req.userId;

        if (!isAuthorized) {
            return res.status(403).json({
                message: "You are not authorized to update this order",
                error: true,
                success: false
            });
        }

        // Update fields
        const updateData = {};
        
        if (orderStatus) {
            // Check if trying to cancel order
            if (orderStatus === 'cancelled') {
                // Validate cancellation is allowed
                const nonCancellableStatuses = ['shipped', 'delivered', 'cancelled'];
                if (nonCancellableStatuses.includes(order.orderStatus)) {
                    return res.status(400).json({
                        message: `Cannot cancel order that is already ${order.orderStatus}`,
                        error: true,
                        success: false
                    });
                }
                // Both buyer and seller can cancel orders (if not shipped/delivered)
                updateData.orderStatus = orderStatus;
            } else {
                // Only seller can update order status to other statuses
                if (order.seller._id.toString() === req.userId) {
                    updateData.orderStatus = orderStatus;
                } else {
                    return res.status(403).json({
                        message: "Only seller can update order status",
                        error: true,
                        success: false
                    });
                }
            }
        }

        if (paymentStatus) {
            updateData.paymentStatus = paymentStatus;
        }

        // Update the order
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { $set: updateData },
            { new: true, runValidators: true }
        )
        .populate('product', 'productName brandName category')
        .populate('uploadedBy', 'name email role')
        .populate('buyer', 'name email');

        res.status(200).json({
            message: "Order status updated successfully",
            data: updatedOrder,
            error: false,
            success: true
        });

    } catch (err) {
        console.log("Error in updateOrderStatus:", err.message);
        res.status(500).json({
            message: "Failed to update order status: " + err.message,
            error: true,
            success: false
        });
    }
}

module.exports = updateOrderStatusController;
