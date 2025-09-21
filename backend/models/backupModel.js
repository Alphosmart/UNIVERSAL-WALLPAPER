const mongoose = require('mongoose');

const backupSchema = new mongoose.Schema({
    // Basic backup information
    backupId: {
        type: String,
        unique: true,
        required: true,
        default: () => `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    },
    backupName: {
        type: String,
        required: true
    },
    description: String,
    
    // Backup metadata
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    backupType: {
        type: String,
        enum: ['manual', 'scheduled', 'automatic'],
        default: 'manual'
    },
    status: {
        type: String,
        enum: ['in_progress', 'completed', 'failed', 'partial'],
        default: 'in_progress'
    },
    
    // Backup statistics
    statistics: {
        totalCollections: Number,
        totalDocuments: Number,
        totalSize: Number, // Size in bytes
        collections: [{
            name: String,
            documentCount: Number,
            size: Number
        }]
    },
    
    // Backup data structure
    backupData: {
        // Products backup
        products: [{
            type: mongoose.Schema.Types.Mixed
        }],
        
        // Users backup (excluding sensitive data)
        users: [{
            type: mongoose.Schema.Types.Mixed
        }],
        
        // Settings backup
        settings: [{
            type: mongoose.Schema.Types.Mixed
        }],
        
        // Orders backup
        orders: [{
            type: mongoose.Schema.Types.Mixed
        }],
        
        // Cart data backup
        carts: [{
            type: mongoose.Schema.Types.Mixed
        }],
        
        // Additional collections can be added here
        additional: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    },
    
    // Backup configuration
    configuration: {
        includeCollections: [String],
        excludeCollections: [String],
        excludeFields: {
            users: [String], // e.g., ['password', 'resetToken']
            products: [String],
            orders: [String]
        },
        compression: {
            enabled: Boolean,
            algorithm: String
        }
    },
    
    // Error handling
    backupErrors: [{
        collectionName: String,
        errorMessage: String,
        timestamp: Date
    }],
    
    // Restore information
    restoreHistory: [{
        restoredAt: Date,
        restoredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        restoreType: {
            type: String,
            enum: ['full', 'partial', 'collection_specific']
        },
        restoredCollections: [String],
        notes: String
    }],
    
    // Backup retention
    expiresAt: Date,
    isArchived: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    suppressReservedKeysWarning: true
});

// Indexes for better performance
backupSchema.index({ createdAt: -1 });
backupSchema.index({ createdBy: 1 });
backupSchema.index({ status: 1 });
backupSchema.index({ backupType: 1 });
backupSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static methods for backup operations
backupSchema.statics.createBackup = async function(options = {}) {
    const {
        backupName,
        description,
        createdBy,
        backupType = 'manual',
        includeCollections = ['products', 'users', 'settings', 'orders'],
        excludeFields = {
            users: ['password', 'resetToken', 'verificationToken']
        }
    } = options;
    
    const backupId = `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const backup = new this({
        backupId,
        backupName,
        description,
        createdBy,
        backupType,
        configuration: {
            includeCollections,
            excludeFields,
            compression: { enabled: false }
        },
        backupData: {},
        statistics: {
            totalCollections: 0,
            totalDocuments: 0,
            totalSize: 0,
            collections: []
        }
    });
    
    return backup;
};

backupSchema.statics.listBackups = async function(filter = {}) {
    return this.find(filter)
        .populate('createdBy', 'name email')
        .select('-backupData') // Exclude large backup data from list
        .sort({ createdAt: -1 });
};

backupSchema.statics.getBackupById = async function(backupId) {
    return this.findOne({ backupId })
        .populate('createdBy', 'name email')
        .populate('restoreHistory.restoredBy', 'name email');
};

// Instance methods
backupSchema.methods.addCollectionData = function(collectionName, data) {
    if (!this.backupData[collectionName]) {
        this.backupData[collectionName] = [];
    }
    
    this.backupData[collectionName] = data;
    
    // Update statistics
    this.statistics.collections.push({
        name: collectionName,
        documentCount: data.length,
        size: JSON.stringify(data).length
    });
    
    this.statistics.totalDocuments += data.length;
    this.statistics.totalSize += JSON.stringify(data).length;
    this.statistics.totalCollections = this.statistics.collections.length;
};

backupSchema.methods.markCompleted = function() {
    this.status = 'completed';
    return this.save();
};

backupSchema.methods.markFailed = function(error) {
    this.status = 'failed';
    this.backupErrors.push({
        collectionName: collectionName,
        errorMessage: error.message,
        timestamp: new Date()
    });
    return this.save();
};

backupSchema.methods.addError = function(collection, error) {
    this.backupErrors.push({
        collectionName: collection,
        errorMessage: error.message || error,
        timestamp: new Date()
    });
    
    if (this.status === 'completed') {
        this.status = 'partial';
    }
};

backupSchema.methods.recordRestore = function(restoredBy, restoreType, restoredCollections, notes) {
    this.restoreHistory.push({
        restoredAt: new Date(),
        restoredBy,
        restoreType,
        restoredCollections,
        notes
    });
    return this.save();
};

const Backup = mongoose.model('Backup', backupSchema);

module.exports = Backup;
