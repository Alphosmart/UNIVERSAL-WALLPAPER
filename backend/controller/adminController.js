const userModel = require("../models/userModel");
const productModel = require("../models/productModel");

// Get all users (admin only)
async function getAllUsers(req, res) {
    try {
        // Check if user is admin
        if (req.userId) {
            const currentUser = await userModel.findById(req.userId);
            if (!currentUser || currentUser.role !== 'ADMIN') {
                return res.status(403).json({
                    message: "Access denied. Admin privileges required.",
                    error: true,
                    success: false
                });
            }
        } else {
            return res.status(401).json({
                message: "Please login to access this resource",
                error: true,
                success: false
            });
        }

        // Fetch all users excluding passwords
        const allUsers = await userModel.find({}).select("-password").sort({ createdAt: -1 });

        res.json({
            message: "All users fetched successfully",
            data: allUsers,
            success: true,
            error: false
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

// Update user role (admin only)
async function updateUserRole(req, res) {
    try {
        const { role } = req.body;
        const { userId } = req.params;

        // Check if current user is admin
        if (req.userId) {
            const currentUser = await userModel.findById(req.userId);
            if (!currentUser || currentUser.role !== 'ADMIN') {
                return res.status(403).json({
                    message: "Access denied. Admin privileges required.",
                    error: true,
                    success: false
                });
            }
        } else {
            return res.status(401).json({
                message: "Please login to access this resource",
                error: true,
                success: false
            });
        }

        // Validate role
        if (!['GENERAL', 'ADMIN'].includes(role)) {
            return res.status(400).json({
                message: "Invalid role. Must be GENERAL or ADMIN",
                error: true,
                success: false
            });
        }

        // Prevent admin from changing their own role
        if (req.userId === userId) {
            return res.status(400).json({
                message: "Cannot change your own role",
                error: true,
                success: false
            });
        }

        // Update user role
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        res.json({
            message: "User role updated successfully",
            data: updatedUser,
            success: true,
            error: false
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

// Get all products (admin only)
async function getAllProductsAdmin(req, res) {
    try {
        // Check if user is admin
        if (req.userId) {
            const currentUser = await userModel.findById(req.userId);
            if (!currentUser || currentUser.role !== 'ADMIN') {
                return res.status(403).json({
                    message: "Access denied. Admin privileges required.",
                    error: true,
                    success: false
                });
            }
        } else {
            return res.status(401).json({
                message: "Please login to access this resource",
                error: true,
                success: false
            });
        }

        // Fetch all products with seller information
        const allProducts = await productModel.find({})
            .populate('seller', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            message: "All products fetched successfully",
            data: allProducts,
            success: true,
            error: false
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

// Delete product (admin only)
async function deleteProductAdmin(req, res) {
    try {
        const { productId } = req.params;

        // Check if user is admin
        if (req.userId) {
            const currentUser = await userModel.findById(req.userId);
            if (!currentUser || currentUser.role !== 'ADMIN') {
                return res.status(403).json({
                    message: "Access denied. Admin privileges required.",
                    error: true,
                    success: false
                });
            }
        } else {
            return res.status(401).json({
                message: "Please login to access this resource",
                error: true,
                success: false
            });
        }

        // Delete the product
        const deletedProduct = await productModel.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        res.json({
            message: "Product deleted successfully",
            data: deletedProduct,
            success: true,
            error: false
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

// Update product status (admin only)
async function updateProductStatus(req, res) {
    try {
        const { productId } = req.params;
        const { status } = req.body;

        // Check if user is admin
        if (req.userId) {
            const currentUser = await userModel.findById(req.userId);
            if (!currentUser || currentUser.role !== 'ADMIN') {
                return res.status(403).json({
                    message: "Access denied. Admin privileges required.",
                    error: true,
                    success: false
                });
            }
        } else {
            return res.status(401).json({
                message: "Please login to access this resource",
                error: true,
                success: false
            });
        }

        // Validate status
        if (!['ACTIVE', 'INACTIVE', 'SOLD', 'PENDING'].includes(status)) {
            return res.status(400).json({
                message: "Invalid status. Must be ACTIVE, INACTIVE, SOLD, or PENDING",
                error: true,
                success: false
            });
        }

        // Update product status
        const updatedProduct = await productModel.findByIdAndUpdate(
            productId,
            { status },
            { new: true }
        ).populate('seller', 'name email');

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        res.json({
            message: "Product status updated successfully",
            data: updatedProduct,
            success: true,
            error: false
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

// Get dashboard statistics (admin only)
async function getDashboardStats(req, res) {
    try {
        // Check if user is admin
        if (req.userId) {
            const currentUser = await userModel.findById(req.userId);
            if (!currentUser || currentUser.role !== 'ADMIN') {
                return res.status(403).json({
                    message: "Access denied. Admin privileges required.",
                    error: true,
                    success: false
                });
            }
        } else {
            return res.status(401).json({
                message: "Please login to access this resource",
                error: true,
                success: false
            });
        }

        // Get various statistics
        const totalUsers = await userModel.countDocuments();
        const adminUsers = await userModel.countDocuments({ role: 'ADMIN' });
        const generalUsers = await userModel.countDocuments({ role: 'GENERAL' });
        
        const totalProducts = await productModel.countDocuments();
        const activeProducts = await productModel.countDocuments({ status: 'ACTIVE' });
        const soldProducts = await productModel.countDocuments({ status: 'SOLD' });
        
        // Recent users (last 7 days)
        const recentUsers = await userModel.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        });
        
        // Recent products (last 7 days)
        const recentProducts = await productModel.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        });

        const stats = {
            users: {
                total: totalUsers,
                admin: adminUsers,
                general: generalUsers,
                recent: recentUsers
            },
            products: {
                total: totalProducts,
                active: activeProducts,
                sold: soldProducts,
                recent: recentProducts
            }
        };

        res.json({
            message: "Dashboard statistics fetched successfully",
            data: stats,
            success: true,
            error: false
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

// Get all shipping companies (admin only)
async function getAllShippingCompanies(req, res) {
    try {
        // Check if user is admin
        if (req.userId) {
            const currentUser = await userModel.findById(req.userId);
            if (!currentUser || currentUser.role !== 'ADMIN') {
                return res.status(403).json({
                    message: "Access denied. Admin privileges required.",
                    error: true,
                    success: false
                });
            }
        } else {
            return res.status(401).json({
                message: "Please login to access this resource",
                error: true,
                success: false
            });
        }

        const { status, search } = req.query;
        let query = { role: 'SHIPPING_COMPANY' };

        // Filter by status if provided
        if (status && status !== 'all') {
            query.shippingCompanyStatus = status;
        }

        // Search by company name or contact email
        if (search) {
            query.$or = [
                { 'companyInfo.companyName': { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const shippingCompanies = await userModel.find(query).select('-password').sort({ createdAt: -1 });

        res.json({
            message: "Shipping companies fetched successfully",
            data: shippingCompanies,
            success: true,
            error: false
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

// Update shipping company status (admin only)
async function updateShippingCompanyStatus(req, res) {
    try {
        const { companyId, status, rejectionReason } = req.body;

        // Check if user is admin
        if (req.userId) {
            const currentUser = await userModel.findById(req.userId);
            if (!currentUser || currentUser.role !== 'ADMIN') {
                return res.status(403).json({
                    message: "Access denied. Admin privileges required.",
                    error: true,
                    success: false
                });
            }
        } else {
            return res.status(401).json({
                message: "Please login to access this resource",
                error: true,
                success: false
            });
        }

        // Validate status
        const validStatuses = ['pending_verification', 'verified', 'rejected', 'suspended'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status. Must be one of: " + validStatuses.join(', '),
                error: true,
                success: false
            });
        }

        // Find the shipping company
        const shippingCompany = await userModel.findOne({ _id: companyId, role: 'SHIPPING_COMPANY' });
        if (!shippingCompany) {
            return res.status(404).json({
                message: "Shipping company not found",
                error: true,
                success: false
            });
        }

        // Update the status and add admin action timestamp
        const updateData = {
            shippingCompanyStatus: status,
            adminActionDate: new Date(),
            adminId: req.userId
        };

        // Add rejection reason if status is rejected
        if (status === 'rejected' && rejectionReason) {
            updateData.rejectionReason = rejectionReason;
        }

        const updatedCompany = await userModel.findByIdAndUpdate(
            companyId,
            updateData,
            { new: true }
        ).select('-password');

        res.json({
            message: `Shipping company status updated to ${status} successfully`,
            data: updatedCompany,
            success: true,
            error: false
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

// Set seller suspension status (admin only)
async function setSellerSuspension(req, res) {
    try {
        const { userId } = req.params;
        const { suspend } = req.body;

        // Check if current user is admin
        if (req.userId) {
            const currentUser = await userModel.findById(req.userId);
            if (!currentUser || currentUser.role !== 'ADMIN') {
                return res.status(403).json({
                    message: "Access denied. Admin privileges required.",
                    error: true,
                    success: false
                });
            }
        } else {
            return res.status(401).json({
                message: "Please login to access this resource",
                error: true,
                success: false
            });
        }

        // Find the user to suspend/unsuspend
        const userToUpdate = await userModel.findById(userId);
        if (!userToUpdate) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        // Update seller status
        const newStatus = suspend ? 'suspended' : 'verified';
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { sellerStatus: newStatus },
            { new: true }
        ).select('-password');

        const action = suspend ? 'suspended' : 'unsuspended';
        res.json({
            message: `Seller ${action} successfully`,
            data: updatedUser,
            success: true,
            error: false
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = {
    getAllUsers,
    updateUserRole,
    getAllProductsAdmin,
    deleteProductAdmin,
    updateProductStatus,
    getDashboardStats,
    getAllShippingCompanies,
    updateShippingCompanyStatus,
    setSellerSuspension
};
