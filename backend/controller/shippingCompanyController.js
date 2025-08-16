const userModel = require('../models/userModel');
const ShippingQuote = require('../models/shippingQuoteModel');
const Delivery = require('../models/deliveryModel');
const orderModel = require('../models/orderModel');
const bcrypt = require('bcryptjs');

// Register shipping company
async function registerShippingCompany(request, response) {
    try {
        const { 
            name, 
            email, 
            password, 
            phone,
            companyInfo,
            serviceAreas,
            shippingServices,
            operatingHours,
            address
        } = request.body;

        // Check if email already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return response.status(400).json({
                message: "Email already registered",
                error: true,
                success: false
            });
        }

        // Hash password
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        // Create shipping company user
        const payload = {
            name,
            email,
            password: hashPassword,
            phone,
            address,
            role: 'SHIPPING_COMPANY',
            shippingCompanyStatus: 'pending_verification',
            companyInfo,
            serviceAreas,
            shippingServices,
            operatingHours
        };

        const newShippingCompany = new userModel(payload);
        const savedUser = await newShippingCompany.save();

        response.status(201).json({
            data: {
                _id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role,
                shippingCompanyStatus: savedUser.shippingCompanyStatus
            },
            success: true,
            error: false,
            message: "Shipping company registered successfully. Verification pending."
        });

    } catch (err) {
        console.error("Error in registerShippingCompany:", err);
        response.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

// Get shipping company profile
async function getShippingCompanyProfile(request, response) {
    try {
        const currentUserId = request.userId;

        const shippingCompany = await userModel.findById(currentUserId)
            .select('-password')
            .lean();

        if (!shippingCompany || shippingCompany.role !== 'SHIPPING_COMPANY') {
            return response.status(404).json({
                message: "Shipping company not found",
                error: true,
                success: false
            });
        }

        response.json({
            data: shippingCompany,
            success: true,
            error: false,
            message: "Profile retrieved successfully"
        });

    } catch (err) {
        console.error("Error in getShippingCompanyProfile:", err);
        response.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

// Update shipping company profile
async function updateShippingCompanyProfile(request, response) {
    try {
        const currentUserId = request.userId;
        const updateData = request.body;

        // Remove sensitive fields that shouldn't be updated directly
        delete updateData.password;
        delete updateData.role;
        delete updateData.shippingCompanyStatus;
        delete updateData._id;

        const updatedCompany = await userModel.findByIdAndUpdate(
            currentUserId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedCompany) {
            return response.status(404).json({
                message: "Shipping company not found",
                error: true,
                success: false
            });
        }

        response.json({
            data: updatedCompany,
            success: true,
            error: false,
            message: "Profile updated successfully"
        });

    } catch (err) {
        console.error("Error in updateShippingCompanyProfile:", err);
        response.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

// Get available orders for shipping (orders that need shipping quotes)
async function getAvailableOrders(request, response) {
    try {
        const currentUserId = request.userId;
        const { page = 1, limit = 10, city, state } = request.query;

        // Get shipping company's service areas
        const shippingCompany = await userModel.findById(currentUserId)
            .select('serviceAreas shippingCompanyStatus');

        if (!shippingCompany || shippingCompany.role !== 'SHIPPING_COMPANY') {
            return response.status(403).json({
                message: "Access denied",
                error: true,
                success: false
            });
        }

        if (shippingCompany.shippingCompanyStatus !== 'verified') {
            return response.status(403).json({
                message: "Shipping company not verified",
                error: true,
                success: false
            });
        }

        // Build location filter based on service areas
        let locationFilter = {};
        if (shippingCompany.serviceAreas && shippingCompany.serviceAreas.length > 0) {
            const serviceableAreas = shippingCompany.serviceAreas.flatMap(area => {
                if (area.cities && area.cities.length > 0) {
                    return area.cities;
                }
                return [];
            });
            
            if (serviceableAreas.length > 0) {
                locationFilter['shippingAddress.city'] = { $in: serviceableAreas };
            }
        }

        // Find orders that are confirmed and need shipping
        const orders = await orderModel.find({
            orderStatus: { $in: ['confirmed', 'processing'] },
            ...locationFilter
        })
        .populate('buyer', 'name email phone')
        .populate('seller', 'name email phone address')
        .populate('product', 'productName brandName category productImage weight dimensions')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean();

        // Filter out orders that already have quotes from this shipping company
        const orderIds = orders.map(order => order._id);
        const existingQuotes = await ShippingQuote.find({
            orderId: { $in: orderIds },
            shippingCompanyId: currentUserId
        }).select('orderId');

        const quotedOrderIds = existingQuotes.map(quote => quote.orderId.toString());
        const availableOrders = orders.filter(order => 
            !quotedOrderIds.includes(order._id.toString())
        );

        const total = await orderModel.countDocuments({
            orderStatus: { $in: ['confirmed', 'processing'] },
            ...locationFilter
        });

        response.json({
            data: {
                orders: availableOrders,
                pagination: {
                    current: page,
                    pages: Math.ceil(total / limit),
                    total
                }
            },
            success: true,
            error: false,
            message: "Available orders retrieved successfully"
        });

    } catch (err) {
        console.error("Error in getAvailableOrders:", err);
        response.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

// Submit shipping quote for an order
async function submitShippingQuote(request, response) {
    try {
        const currentUserId = request.userId;
        const { orderId } = request.params;
        const { 
            serviceType, 
            estimatedDeliveryTime, 
            quotedPrice, 
            notes 
        } = request.body;

        // Verify the order exists and is available for shipping
        const order = await orderModel.findById(orderId)
            .populate('seller', 'address');

        if (!order) {
            return response.status(404).json({
                message: "Order not found",
                error: true,
                success: false
            });
        }

        if (!['confirmed', 'processing'].includes(order.orderStatus)) {
            return response.status(400).json({
                message: "Order is not available for shipping",
                error: true,
                success: false
            });
        }

        // Check if quote already exists
        const existingQuote = await ShippingQuote.findOne({
            orderId,
            shippingCompanyId: currentUserId
        });

        if (existingQuote) {
            return response.status(400).json({
                message: "Quote already submitted for this order",
                error: true,
                success: false
            });
        }

        // Create shipping quote
        const quoteData = {
            orderId,
            shippingCompanyId: currentUserId,
            sellerId: order.seller._id,
            buyerId: order.buyer,
            serviceType,
            estimatedDeliveryTime,
            quotedPrice,
            pickupAddress: order.seller.address,
            deliveryAddress: order.shippingAddress,
            packageDetails: {
                weight: order.product?.weight || 1,
                dimensions: order.product?.dimensions || { length: 10, width: 10, height: 10 },
                description: order.productDetails?.productName || 'Package'
            },
            notes
        };

        const shippingQuote = new ShippingQuote(quoteData);
        const savedQuote = await shippingQuote.save();

        response.status(201).json({
            data: savedQuote,
            success: true,
            error: false,
            message: "Shipping quote submitted successfully"
        });

    } catch (err) {
        console.error("Error in submitShippingQuote:", err);
        response.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

// Get shipping company's quotes
async function getMyQuotes(request, response) {
    try {
        const currentUserId = request.userId;
        const { page = 1, limit = 10, status } = request.query;

        let filter = { shippingCompanyId: currentUserId };
        if (status) {
            filter.status = status;
        }

        const quotes = await ShippingQuote.find(filter)
            .populate('orderId', 'orderStatus productDetails totalAmount')
            .populate('sellerId', 'name email phone')
            .populate('buyerId', 'name email phone')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const total = await ShippingQuote.countDocuments(filter);

        response.json({
            data: {
                quotes,
                pagination: {
                    current: page,
                    pages: Math.ceil(total / limit),
                    total
                }
            },
            success: true,
            error: false,
            message: "Quotes retrieved successfully"
        });

    } catch (err) {
        console.error("Error in getMyQuotes:", err);
        response.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

// Get shipping company dashboard stats
async function getShippingCompanyStats(request, response) {
    try {
        const currentUserId = request.userId;

        // Get stats using aggregation
        const stats = await Promise.all([
            // Total quotes
            ShippingQuote.countDocuments({ shippingCompanyId: currentUserId }),
            
            // Accepted quotes
            ShippingQuote.countDocuments({ 
                shippingCompanyId: currentUserId, 
                status: 'accepted' 
            }),
            
            // Active deliveries
            Delivery.countDocuments({ 
                shippingCompanyId: currentUserId, 
                deliveryStatus: { $in: ['assigned', 'picked_up', 'in_transit', 'out_for_delivery'] }
            }),
            
            // Completed deliveries this month
            Delivery.countDocuments({
                shippingCompanyId: currentUserId,
                deliveryStatus: 'delivered',
                createdAt: {
                    $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
            }),

            // Total revenue
            Delivery.aggregate([
                { $match: { shippingCompanyId: currentUserId, deliveryStatus: 'delivered' } },
                { $group: { _id: null, totalRevenue: { $sum: '$cost.actualAmount' } } }
            ])
        ]);

        const [totalQuotes, acceptedQuotes, activeDeliveries, monthlyDeliveries, revenueResult] = stats;

        response.json({
            data: {
                totalQuotes,
                acceptedQuotes,
                activeDeliveries,
                monthlyDeliveries,
                totalRevenue: revenueResult[0]?.totalRevenue || 0,
                acceptanceRate: totalQuotes > 0 ? ((acceptedQuotes / totalQuotes) * 100).toFixed(1) : 0
            },
            success: true,
            error: false,
            message: "Dashboard stats retrieved successfully"
        });

    } catch (err) {
        console.error("Error in getShippingCompanyStats:", err);
        response.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

module.exports = {
    registerShippingCompany,
    getShippingCompanyProfile,
    updateShippingCompanyProfile,
    getAvailableOrders,
    submitShippingQuote,
    getMyQuotes,
    getShippingCompanyStats
};
