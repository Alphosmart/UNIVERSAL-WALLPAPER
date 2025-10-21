const Order = require("../models/orderModel");

async function getUserOrdersController(req, res) {
    try {
        const userId = req.userId;
        const { status, type } = req.query;

        let filter = {};
        
        // Determine if getting orders as buyer or seller
        if (type === 'selling') {
            filter.seller = userId;
        } else {
            // Default to buying orders
            filter.buyer = userId;
        }
        
        if (status) {
            filter.orderStatus = status;
        }

        // Get user's orders
        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .populate('product', 'productName brandName category productImage')
            .populate('uploadedBy', 'name email role')
            .populate('buyer', 'name email');

        res.status(200).json({
            message: `${type === 'selling' ? 'Selling' : 'Purchase'} orders retrieved successfully`,
            data: orders,
            count: orders.length,
            error: false,
            success: true
        });

    } catch (err) {
        console.log("Error in getUserOrders:", err.message);
        res.status(500).json({
            message: "Failed to get user orders: " + err.message,
            error: true,
            success: false
        });
    }
}

module.exports = getUserOrdersController;
