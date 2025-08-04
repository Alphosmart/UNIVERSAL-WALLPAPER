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

        console.log('=== SELLER APPLICATION DEBUG ===');
        console.log('User ID:', userId);
        console.log('User phone:', user.phone);
        console.log('User address:', user.address);
        console.log('User verificationDocuments:', user.verificationDocuments);
        console.log('Business type:', businessType);

        // Validate required user information before allowing seller application
        const missingFields = [];
        
        // Check phone number
        if (!user.phone || user.phone.trim() === '') {
            missingFields.push('phone number');
            console.log('❌ Missing: phone number');
        } else {
            console.log('✅ Has phone number:', user.phone);
        }

        // Check address
        if (!user.address || !user.address.street || !user.address.city || !user.address.state) {
            missingFields.push('complete address (street, city, state)');
            console.log('❌ Missing: complete address');
            console.log('Address details:', user.address);
        } else {
            console.log('✅ Has complete address:', user.address);
        }

        // Check identification documents
        const hasIdentificationDoc = user.verificationDocuments && 
            user.verificationDocuments.some(doc => 
                doc.type === 'identity_proof' || doc.type === 'business_license'
            );
        
        if (!hasIdentificationDoc) {
            missingFields.push('identification document (identity proof or business license)');
            console.log('❌ Missing: identification document');
            console.log('Available docs:', user.verificationDocuments);
        } else {
            console.log('✅ Has identification document');
        }

        console.log('Missing fields:', missingFields);
        console.log('=== END DEBUG ===');

        // If any required fields are missing, return error
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Please complete your profile before applying to become a seller. Missing: ${missingFields.join(', ')}`,
                error: true,
                success: false,
                missingFields: missingFields
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

        // Transform data to match frontend expectations
        const transformedApplications = applications.map(app => ({
            _id: app._id,
            name: app.name,
            email: app.email,
            phone: app.phone,
            address: app.address,
            sellerStatus: app.sellerStatus,
            sellerApplicationDate: app.sellerApplicationDate,
            verifiedAt: app.verifiedAt,
            rejectionReason: app.rejectionReason,
            // Structure business type in the format frontend expects
            paymentDetails: {
                taxInfo: {
                    businessType: app.businessType
                },
                // Structure verification documents in the format frontend expects  
                verificationDocuments: app.verificationDocuments || []
            },
            // Also keep the original fields for compatibility
            businessType: app.businessType,
            verificationDocuments: app.verificationDocuments || []
        }));

        res.json({
            message: "Seller applications fetched successfully",
            error: false,
            success: true,
            data: transformedApplications
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

// Get pending seller applications (admin only)
async function getPendingSellerApplications(req, res) {
    try {
        const applications = await userModel.find({
            sellerStatus: 'pending_verification'
        }).select('-password');

        // Transform data to match frontend expectations
        const transformedApplications = applications.map(app => ({
            _id: app._id,
            name: app.name,
            email: app.email,
            phone: app.phone,
            address: app.address,
            sellerStatus: app.sellerStatus,
            sellerApplicationDate: app.sellerApplicationDate,
            verifiedAt: app.verifiedAt,
            rejectionReason: app.rejectionReason,
            // Structure business type in the format frontend expects
            paymentDetails: {
                taxInfo: {
                    businessType: app.businessType
                },
                // Structure verification documents in the format frontend expects  
                verificationDocuments: app.verificationDocuments || []
            },
            // Also keep the original fields for compatibility
            businessType: app.businessType,
            verificationDocuments: app.verificationDocuments || []
        }));

        res.json({
            message: "Pending seller applications fetched successfully",
            error: false,
            success: true,
            data: transformedApplications
        });

    } catch (err) {
        console.error('Error in getPendingSellerApplications:', err);
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

// Review seller application (admin only) - alternative endpoint for frontend compatibility
async function reviewSellerApplication(req, res) {
    try {
        const { userId } = req.params;
        const { action, rejectionReason } = req.body;

        // Map action to status
        let status;
        switch (action) {
            case 'approve':
                status = 'verified';
                break;
            case 'reject':
                status = 'rejected';
                break;
            default:
                return res.status(400).json({
                    message: "Invalid action. Use 'approve' or 'reject'",
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
            message: `Seller application ${action}d successfully`,
            error: false,
            success: true,
            data: user
        });

    } catch (err) {
        console.error('Error in reviewSellerApplication:', err);
        res.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

// Update user profile for seller application
async function updateProfileForSeller(req, res) {
    try {
        const userId = req.userId;
        const { phone, address } = req.body;

        // Validate input
        if (!phone || !address || !address.street || !address.city || !address.state) {
            return res.status(400).json({
                message: "Phone number and complete address (street, city, state) are required",
                error: true,
                success: false
            });
        }

        // Update user profile
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                phone: phone,
                address: {
                    street: address.street,
                    city: address.city,
                    state: address.state,
                    zipCode: address.zipCode || '',
                    country: address.country || 'India'
                }
            },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        res.json({
            message: "Profile updated successfully",
            error: false,
            success: true,
            data: updatedUser
        });

    } catch (err) {
        console.error('Error in updateProfileForSeller:', err);
        res.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

// Check seller application eligibility
async function checkSellerEligibility(req, res) {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        const missingFields = [];
        const requirements = {
            phone: !!user.phone && user.phone.trim() !== '',
            address: !!(user.address && user.address.street && user.address.city && user.address.state),
            identification: !!(user.verificationDocuments && 
                user.verificationDocuments.some(doc => 
                    doc.type === 'identity_proof' || doc.type === 'business_license'
                ))
        };

        if (!requirements.phone) missingFields.push('phone number');
        if (!requirements.address) missingFields.push('complete address');
        if (!requirements.identification) missingFields.push('identification document');

        const isEligible = missingFields.length === 0;

        res.json({
            message: isEligible ? "You are eligible to apply as a seller" : "Complete your profile to apply as a seller",
            error: false,
            success: true,
            data: {
                isEligible,
                requirements,
                missingFields,
                currentStatus: user.sellerStatus || 'none',
                user: {
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    verificationDocuments: user.verificationDocuments || []
                }
            }
        });

    } catch (err) {
        console.error('Error in checkSellerEligibility:', err);
        res.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

// Get seller payment details
async function getSellerPaymentDetails(req, res) {
    try {
        const userId = req.userId;
        
        // Find user and check if they are a verified seller
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        if (user.sellerStatus !== 'verified') {
            return res.status(403).json({
                message: "Access denied. You must be a verified seller to access payment details.",
                error: true,
                success: false
            });
        }

        // Return payment details with default structure if not set
        const paymentDetails = user.paymentDetails || {
            bankAccount: {
                accountNumber: '',
                routingNumber: '',
                accountHolderName: '',
                bankName: '',
                accountType: 'checking'
            },
            paypalEmail: '',
            taxInfo: {
                ssn: '',
                ein: '',
                businessType: 'individual'
            }
        };

        const sellerSettings = user.sellerSettings || {
            payoutSchedule: 'weekly',
            minimumPayout: 25.00
        };

        res.json({
            message: "Seller payment details retrieved successfully",
            data: {
                paymentDetails,
                sellerSettings,
                documents: user.verificationDocuments || []
            },
            success: true,
            error: false
        });

    } catch (err) {
        console.error('Error getting seller payment details:', err);
        res.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

// Update seller payment details
async function updateSellerPaymentDetails(req, res) {
    try {
        const userId = req.userId;
        const { paymentDetails, sellerSettings } = req.body;

        // Find user and check if they are a verified seller
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        if (user.sellerStatus !== 'verified') {
            return res.status(403).json({
                message: "Access denied. You must be a verified seller to update payment details.",
                error: true,
                success: false
            });
        }

        // Update payment details
        const updateData = {};
        if (paymentDetails) {
            updateData.paymentDetails = paymentDetails;
        }
        if (sellerSettings) {
            updateData.sellerSettings = sellerSettings;
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        );

        res.json({
            message: "Payment details updated successfully",
            data: {
                paymentDetails: updatedUser.paymentDetails,
                sellerSettings: updatedUser.sellerSettings
            },
            success: true,
            error: false
        });

    } catch (err) {
        console.error('Error updating seller payment details:', err);
        res.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

// Upload seller document
async function uploadSellerDocument(req, res) {
    try {
        const userId = req.userId;
        const { documentType, documentUrl, documentName } = req.body;

        if (!documentType || !documentUrl) {
            return res.status(400).json({
                message: "Document type and URL are required",
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

        // Initialize verificationDocuments if it doesn't exist
        if (!user.verificationDocuments) {
            user.verificationDocuments = [];
        }

        // Add new document
        const newDocument = {
            type: documentType,
            url: documentUrl,
            name: documentName || `${documentType}_document`,
            uploadDate: new Date(),
            status: 'pending_review'
        };

        user.verificationDocuments.push(newDocument);
        await user.save();

        res.json({
            message: "Document uploaded successfully",
            data: {
                document: newDocument,
                allDocuments: user.verificationDocuments
            },
            success: true,
            error: false
        });

    } catch (err) {
        console.error('Error uploading seller document:', err);
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
    getPendingSellerApplications,
    updateSellerStatus,
    reviewSellerApplication,
    updateProfileForSeller,
    checkSellerEligibility,
    getSellerPaymentDetails,
    updateSellerPaymentDetails,
    uploadSellerDocument
};
