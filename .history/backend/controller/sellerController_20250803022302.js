const userModel = require('../models/userModel');

// Apply to become seller
async function applyToBeSeller(req, res) {
    try {
        const userId = req.userId;
        const { businessType } = req.body;

        // Validate input
        if (!businessType) {
            return res.status(400).json({
                message: "Business type is required",
                error: true,
                success: false
            });
        }

        // Find user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        // Check if user already has a seller application or is already a seller
        if (user.sellerStatus === 'verified') {
            return res.status(400).json({
                message: "You are already a verified seller",
                error: true,
                success: false
            });
        }

        if (user.sellerStatus === 'pending_verification') {
            return res.status(400).json({
                message: "Your seller application is already pending verification",
                error: true,
                success: false
            });
        }

        // Update user with seller application
        await userModel.findByIdAndUpdate(userId, {
            sellerStatus: 'pending_verification',
            businessType: businessType,
            sellerApplicationDate: new Date()
        });

        res.json({
            message: "Seller application submitted successfully! Please wait for admin approval.",
            error: false,
            success: true,
            data: {
                sellerStatus: 'pending_verification',
                businessType: businessType
            }
        });

    } catch (err) {
        console.error('Error in applyToBeSeller:', err);
        res.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

// Upload verification document
async function uploadVerificationDocument(req, res) {
    try {
        const userId = req.userId;
        const { documentType, documentUrl } = req.body;

        if (!documentType || !documentUrl) {
            return res.status(400).json({
                message: "Document type and URL are required",
                error: true,
                success: false
            });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        // Initialize verificationDocuments if it doesn't exist
        if (!user.verificationDocuments) {
            user.verificationDocuments = [];
        }

        // Add or update document
        const existingDocIndex = user.verificationDocuments.findIndex(
            doc => doc.type === documentType
        );

        if (existingDocIndex >= 0) {
            user.verificationDocuments[existingDocIndex] = {
                type: documentType,
                url: documentUrl,
                uploadedAt: new Date()
            };
        } else {
            user.verificationDocuments.push({
                type: documentType,
                url: documentUrl,
                uploadedAt: new Date()
            });
        }

        await user.save();

        res.json({
            message: "Document uploaded successfully",
            error: false,
            success: true,
            data: {
                documentType,
                documentUrl
            }
        });

    } catch (err) {
        console.error('Error in uploadVerificationDocument:', err);
        res.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

// Get seller applications (admin only)
async function getSellerApplications(req, res) {
    try {
        const applications = await userModel.find({
            sellerStatus: { $in: ['pending_verification', 'verified', 'rejected'] }
        }).select('-password');

        res.json({
            message: "Seller applications fetched successfully",
            error: false,
            success: true,
            data: applications
        });

    } catch (err) {
        console.error('Error in getSellerApplications:', err);
        res.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

// Update seller application status (admin only)
async function updateSellerStatus(req, res) {
    try {
        const { userId } = req.params;
        const { status, rejectionReason } = req.body;

        if (!['verified', 'rejected', 'pending_verification'].includes(status)) {
            return res.status(400).json({
                message: "Invalid status",
                error: true,
                success: false
            });
        }

        const updateData = { sellerStatus: status };
        if (status === 'rejected' && rejectionReason) {
            updateData.rejectionReason = rejectionReason;
        }
        if (status === 'verified') {
            updateData.verifiedAt = new Date();
        }

        const user = await userModel.findByIdAndUpdate(userId, updateData, { new: true });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        res.json({
            message: `Seller application ${status} successfully`,
            error: false,
            success: true,
            data: user
        });

    } catch (err) {
        console.error('Error in updateSellerStatus:', err);
        res.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

module.exports = {
    applyToBeSeller,
    uploadVerificationDocument,
    getSellerApplications,
    updateSellerStatus
};
