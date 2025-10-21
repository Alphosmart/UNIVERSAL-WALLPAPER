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
            .populate('uploadedBy', 'name email role')
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
        ).populate('uploadedBy', 'name email role');

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

// Promote user to admin role (super admin only)
async function promoteToAdmin(req, res) {
    try {
        const { userId } = req.body;
        
        // Check if current user is admin
        const currentUser = await userModel.findById(req.userId);
        if (!currentUser || currentUser.role !== 'ADMIN') {
            return res.status(403).json({
                message: "Access denied. Admin privileges required.",
                error: true,
                success: false
            });
        }

        // Find target user
        const targetUser = await userModel.findById(userId);
        if (!targetUser) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        // Update user role to admin
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { 
                role: 'ADMIN',
                'permissions.canUploadProducts': true,
                'permissions.canEditProducts': true,
                'permissions.canDeleteProducts': true,
                'permissions.canManageOrders': true,
                'permissions.grantedBy': req.userId,
                'permissions.grantedAt': new Date()
            },
            { new: true }
        ).select('-password');

        res.json({
            message: `User ${targetUser.name} promoted to Admin successfully`,
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

// Grant product upload permissions to staff
async function grantProductPermissions(req, res) {
    try {
        const { userId, permissions } = req.body;
        
        // Check if current user is admin
        const currentUser = await userModel.findById(req.userId);
        if (!currentUser || currentUser.role !== 'ADMIN') {
            return res.status(403).json({
                message: "Access denied. Admin privileges required.",
                error: true,
                success: false
            });
        }

        // Find target user
        const targetUser = await userModel.findById(userId);
        if (!targetUser) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        // Prepare permission updates
        const permissionUpdates = {
            'permissions.grantedBy': req.userId,
            'permissions.grantedAt': new Date()
        };

        // Set specific permissions
        if (permissions.canUploadProducts !== undefined) {
            permissionUpdates['permissions.canUploadProducts'] = permissions.canUploadProducts;
        }
        if (permissions.canEditProducts !== undefined) {
            permissionUpdates['permissions.canEditProducts'] = permissions.canEditProducts;
        }
        if (permissions.canDeleteProducts !== undefined) {
            permissionUpdates['permissions.canDeleteProducts'] = permissions.canDeleteProducts;
        }
        if (permissions.canManageOrders !== undefined) {
            permissionUpdates['permissions.canManageOrders'] = permissions.canManageOrders;
        }

        // If user is being granted any permissions, promote to STAFF role
        const hasAnyPermission = Object.values(permissions).some(perm => perm === true);
        if (hasAnyPermission && targetUser.role === 'GENERAL') {
            permissionUpdates.role = 'STAFF';
        }

        // Update user permissions
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            permissionUpdates,
            { new: true }
        ).select('-password');

        res.json({
            message: `Permissions updated for ${targetUser.name} successfully`,
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

// Get all staff members with their permissions
async function getAllStaff(req, res) {
    try {
        // Check if current user is admin
        const currentUser = await userModel.findById(req.userId);
        if (!currentUser || currentUser.role !== 'ADMIN') {
            return res.status(403).json({
                message: "Access denied. Admin privileges required.",
                error: true,
                success: false
            });
        }

        // Get all staff and admin users
        const staff = await userModel.find({
            role: { $in: ['STAFF', 'ADMIN'] }
        }).select('-password').sort({ createdAt: -1 });

        res.json({
            message: "Staff members fetched successfully",
            data: staff,
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

// Get staff upload statistics
async function getStaffUploadStats(req, res) {
    try {
        // Check if current user is admin
        const currentUser = await userModel.findById(req.userId);
        if (!currentUser || currentUser.role !== 'ADMIN') {
            return res.status(403).json({
                message: "Access denied. Admin privileges required.",
                error: true,
                success: false
            });
        }

        const Product = require('../models/productModel');
        
        // Get upload statistics by staff
        const uploadStats = await Product.aggregate([
            {
                $group: {
                    _id: '$uploadedBy',
                    totalUploads: { $sum: 1 },
                    latestUpload: { $max: '$uploadedByInfo.uploadedAt' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'uploader'
                }
            },
            {
                $unwind: '$uploader'
            },
            {
                $project: {
                    _id: 1,
                    name: '$uploader.name',
                    email: '$uploader.email',
                    role: '$uploader.role',
                    totalUploads: 1,
                    latestUpload: 1
                }
            },
            {
                $sort: { totalUploads: -1 }
            }
        ]);

        res.json({
            message: "Upload statistics fetched successfully",
            data: uploadStats,
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

// Promote user to verified seller for product management (admin only)
async function promoteToVerifiedSeller(req, res) {
    try {
        const { userId } = req.body;
        
        // Check if current user is admin
        const currentUser = await userModel.findById(req.userId);
        if (!currentUser || currentUser.role !== 'ADMIN') {
            return res.status(403).json({
                message: "Access denied. Admin privileges required.",
                error: true,
                success: false
            });
        }

        // Find target user
        const targetUser = await userModel.findById(userId);
        if (!targetUser) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        // Update user to verified seller status
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { 
                sellerStatus: 'verified',
                verifiedAt: new Date(),
                businessType: 'Company Employee' // Mark as internal company seller
            },
            { new: true }
        ).select('-password');

        res.json({
            message: `${targetUser.name} has been granted verified seller status for product management`,
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
    // getAllShippingCompanies, // Removed - single company model
    // updateShippingCompanyStatus, // Removed - single company model
    setSellerSuspension,
    promoteToAdmin,
    grantProductPermissions,
    getAllStaff,
    getStaffUploadStats,
    promoteToVerifiedSeller
};
