const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");

// Get all orders for the current seller
async function getSellerOrders(request, response) {
    try {
        const currentUserId = request.userId;

        // Get orders where the current user is the seller
        const orders = await orderModel.find({
            seller: currentUserId
        })
        .populate('buyer', 'name email phone')
        .populate('product', 'productName brandName category productImage')
        .sort({ createdAt: -1 }); // Latest orders first

        response.status(200).json({
            message: "Seller orders retrieved successfully",
            data: orders,
            success: true,
            error: false
        });

    } catch (err) {
        console.error("Error in getSellerOrders:", err);
        response.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

// Update order status (for sellers)
async function updateSellerOrderStatus(request, response) {
    try {
        const currentUserId = request.userId;
        const { orderId } = request.params;
        const { orderStatus, carrier, estimatedDelivery } = request.body;

        // Find the order and verify it belongs to the current seller
        const order = await orderModel.findOne({
            _id: orderId,
            seller: currentUserId
        });

        if (!order) {
            return response.status(404).json({
                message: "Order not found or you don't have permission to update it",
                error: true,
                success: false
            });
        }

        // Update order status and additional fields
        const updateData = { orderStatus };
        
        if (carrier) {
            updateData['trackingInfo.carrier'] = carrier;
        }
        
        if (estimatedDelivery) {
            updateData['trackingInfo.estimatedDelivery'] = new Date(estimatedDelivery);
        }

        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            updateData,
            { new: true }
        ).populate('buyer', 'name email phone')
         .populate('product', 'productName brandName category productImage');

        response.status(200).json({
            message: "Order status updated successfully",
            data: updatedOrder,
            success: true,
            error: false
        });

    } catch (err) {
        console.error("Error in updateSellerOrderStatus:", err);
        response.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

// Get seller order statistics
async function getSellerOrderStats(request, response) {
    try {
        const currentUserId = request.userId;

        // Get order counts by status
        const orderStats = await orderModel.aggregate([
            { $match: { seller: currentUserId } },
            {
                $group: {
                    _id: "$orderStatus",
                    count: { $sum: 1 },
                    totalAmount: { $sum: "$totalAmount" }
                }
            }
        ]);

        // Get total orders and revenue
        const totalStats = await orderModel.aggregate([
            { $match: { seller: currentUserId } },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: "$totalAmount" }
                }
            }
        ]);

        // Get recent orders (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentOrdersCount = await orderModel.countDocuments({
            seller: currentUserId,
            createdAt: { $gte: sevenDaysAgo }
        });

        // Format the response
        const stats = {
            ordersByStatus: orderStats.reduce((acc, stat) => {
                acc[stat._id] = {
                    count: stat.count,
                    totalAmount: stat.totalAmount
                };
                return acc;
            }, {}),
            totalOrders: totalStats[0]?.totalOrders || 0,
            totalRevenue: totalStats[0]?.totalRevenue || 0,
            recentOrders: recentOrdersCount
        };

        response.status(200).json({
            message: "Seller order statistics retrieved successfully",
            data: stats,
            success: true,
            error: false
        });

    } catch (err) {
        console.error("Error in getSellerOrderStats:", err);
        response.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

module.exports = {
    getSellerOrders,
    updateSellerOrderStatus,
    getSellerOrderStats
};
