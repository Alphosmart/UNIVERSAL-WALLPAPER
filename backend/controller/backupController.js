const Backup = require('../models/backupModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const Settings = require('../models/settingsModel');
const mongoose = require('mongoose');

// Create a database backup
async function createDatabaseBackup(req, res) {
    try {
        const { backupName, description, includeCollections, backupType = 'manual' } = req.body;
        const userId = req.userId;

        // Validate input
        if (!backupName) {
            return res.status(400).json({
                message: "Backup name is required",
                error: true,
                success: false
            });
        }

        // Create backup record
        const backup = await Backup.createBackup({
            backupName,
            description,
            createdBy: userId,
            backupType,
            includeCollections: includeCollections || ['products', 'users', 'settings']
        });

        await backup.save();

        // Start backup process
        performBackup(backup._id, backup.configuration.includeCollections);

        res.json({
            message: "Backup process started successfully",
            error: false,
            success: true,
            data: {
                backupId: backup.backupId,
                status: backup.status,
                createdAt: backup.createdAt
            }
        });

    } catch (err) {
        console.error('Error creating backup:', err);
        res.status(500).json({
            message: err.message || "Failed to create backup",
            error: true,
            success: false
        });
    }
}

// Perform the actual backup process (async)
async function performBackup(backupObjectId, includeCollections) {
    try {
        const backup = await Backup.findById(backupObjectId);
        if (!backup) {
            throw new Error('Backup record not found');
        }

        // Backup Products
        if (includeCollections.includes('products')) {
            try {
                const products = await Product.find({}).lean();
                backup.addCollectionData('products', products);
                console.log(`Backed up ${products.length} products`);
            } catch (error) {
                backup.addError('products', error);
                console.error('Error backing up products:', error);
            }
        }

        // Backup Users (excluding sensitive data)
        if (includeCollections.includes('users')) {
            try {
                const users = await User.find({})
                    .select('-password -resetToken -verificationToken')
                    .lean();
                backup.addCollectionData('users', users);
                console.log(`Backed up ${users.length} users`);
            } catch (error) {
                backup.addError('users', error);
                console.error('Error backing up users:', error);
            }
        }

        // Backup Settings
        if (includeCollections.includes('settings')) {
            try {
                const settings = await Settings.find({}).lean();
                backup.addCollectionData('settings', settings);
                console.log(`Backed up ${settings.length} settings`);
            } catch (error) {
                backup.addError('settings', error);
                console.error('Error backing up settings:', error);
            }
        }

        // Backup Orders (if Order model exists)
        if (includeCollections.includes('orders')) {
            try {
                // Check if Order model exists
                const Order = mongoose.models.Order;
                if (Order) {
                    const orders = await Order.find({}).lean();
                    backup.addCollectionData('orders', orders);
                    console.log(`Backed up ${orders.length} orders`);
                }
            } catch (error) {
                backup.addError('orders', error);
                console.error('Error backing up orders:', error);
            }
        }

        // Mark backup as completed
        await backup.markCompleted();
        console.log(`Backup ${backup.backupId} completed successfully`);

    } catch (error) {
        console.error('Backup process failed:', error);
        const backup = await Backup.findById(backupObjectId);
        if (backup) {
            await backup.markFailed(error);
        }
    }
}

// Get list of all backups
async function getBackupList(req, res) {
    try {
        const { page = 1, limit = 10, status, backupType } = req.query;
        
        const filter = {};
        if (status) filter.status = status;
        if (backupType) filter.backupType = backupType;

        const backupQuery = Backup.listBackups(filter);
        const backups = await backupQuery
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Backup.countDocuments(filter);

        res.json({
            message: "Backups retrieved successfully",
            error: false,
            success: true,
            data: {
                backups,
                pagination: {
                    current: page,
                    total: Math.ceil(total / limit),
                    totalRecords: total
                }
            }
        });

    } catch (err) {
        console.error('Error getting backup list:', err);
        res.status(500).json({
            message: err.message || "Failed to retrieve backups",
            error: true,
            success: false
        });
    }
}

// Get backup details
async function getBackupDetails(req, res) {
    try {
        const { backupId } = req.params;
        const { includeData = false } = req.query;

        let backup;
        if (includeData === 'true') {
            backup = await Backup.getBackupById(backupId);
        } else {
            backup = await Backup.findOne({ backupId })
                .populate('createdBy', 'name email')
                .select('-backupData');
        }

        if (!backup) {
            return res.status(404).json({
                message: "Backup not found",
                error: true,
                success: false
            });
        }

        res.json({
            message: "Backup details retrieved successfully",
            error: false,
            success: true,
            data: backup
        });

    } catch (err) {
        console.error('Error getting backup details:', err);
        res.status(500).json({
            message: err.message || "Failed to retrieve backup details",
            error: true,
            success: false
        });
    }
}

// Restore from backup
async function restoreFromBackup(req, res) {
    try {
        const { backupId } = req.params;
        const { collections = [], restoreType = 'full', confirmRestore = false } = req.body;
        const userId = req.userId;

        if (!confirmRestore) {
            return res.status(400).json({
                message: "Restore confirmation required. Set confirmRestore to true.",
                error: true,
                success: false
            });
        }

        const backup = await Backup.getBackupById(backupId);
        if (!backup) {
            return res.status(404).json({
                message: "Backup not found",
                error: true,
                success: false
            });
        }

        if (backup.status !== 'completed') {
            return res.status(400).json({
                message: "Cannot restore from incomplete backup",
                error: true,
                success: false
            });
        }

        // Perform restore
        const restoreResult = await performRestore(backup, collections, restoreType);

        // Record restore in backup history
        await backup.recordRestore(userId, restoreType, collections, 'Restored via API');

        res.json({
            message: "Restore completed successfully",
            error: false,
            success: true,
            data: restoreResult
        });

    } catch (err) {
        console.error('Error restoring backup:', err);
        res.status(500).json({
            message: err.message || "Failed to restore backup",
            error: true,
            success: false
        });
    }
}

// Perform the actual restore process
async function performRestore(backup, collections, restoreType) {
    const result = {
        restoredCollections: [],
        errors: []
    };

    try {
        // Restore Products
        if (collections.includes('products') && backup.backupData.products) {
            try {
                await Product.deleteMany({}); // Clear existing data
                await Product.insertMany(backup.backupData.products);
                result.restoredCollections.push('products');
                console.log(`Restored ${backup.backupData.products.length} products`);
            } catch (error) {
                result.errors.push({ collection: 'products', error: error.message });
            }
        }

        // Restore Users (excluding sensitive data that wasn't backed up)
        if (collections.includes('users') && backup.backupData.users) {
            try {
                // Don't delete all users, merge instead to preserve admin accounts
                for (const userData of backup.backupData.users) {
                    await User.findByIdAndUpdate(
                        userData._id,
                        { $set: userData },
                        { upsert: true, new: true }
                    );
                }
                result.restoredCollections.push('users');
                console.log(`Restored ${backup.backupData.users.length} users`);
            } catch (error) {
                result.errors.push({ collection: 'users', error: error.message });
            }
        }

        // Restore Settings
        if (collections.includes('settings') && backup.backupData.settings) {
            try {
                await Settings.deleteMany({});
                await Settings.insertMany(backup.backupData.settings);
                result.restoredCollections.push('settings');
                console.log(`Restored ${backup.backupData.settings.length} settings`);
            } catch (error) {
                result.errors.push({ collection: 'settings', error: error.message });
            }
        }

    } catch (error) {
        result.errors.push({ collection: 'general', error: error.message });
    }

    return result;
}

// Delete backup
async function deleteBackup(req, res) {
    try {
        const { backupId } = req.params;

        const backup = await Backup.findOneAndDelete({ backupId });
        if (!backup) {
            return res.status(404).json({
                message: "Backup not found",
                error: true,
                success: false
            });
        }

        res.json({
            message: "Backup deleted successfully",
            error: false,
            success: true,
            data: { backupId }
        });

    } catch (err) {
        console.error('Error deleting backup:', err);
        res.status(500).json({
            message: err.message || "Failed to delete backup",
            error: true,
            success: false
        });
    }
}

// Get backup statistics
async function getBackupStatistics(req, res) {
    try {
        const stats = await Backup.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalSize: { $sum: '$statistics.totalSize' }
                }
            }
        ]);

        const totalBackups = await Backup.countDocuments();
        const recentBackups = await Backup.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('createdBy', 'name')
            .select('backupId backupName status createdAt statistics.totalSize');

        res.json({
            message: "Backup statistics retrieved successfully",
            error: false,
            success: true,
            data: {
                total: totalBackups,
                statusBreakdown: stats,
                recent: recentBackups
            }
        });

    } catch (err) {
        console.error('Error getting backup statistics:', err);
        res.status(500).json({
            message: err.message || "Failed to retrieve backup statistics",
            error: true,
            success: false
        });
    }
}

module.exports = {
    createDatabaseBackup,
    getBackupList,
    getBackupDetails,
    restoreFromBackup,
    deleteBackup,
    getBackupStatistics
};
