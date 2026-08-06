const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

// Update user profile
async function updateProfile(req, res) {
    try {
        const userId = req.userId;
        const { name, phone, address, profilePic, verificationDocuments, preferences, currentPassword, newPassword } = req.body;

        // Find user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        // If password change is requested, validate current password and update it
        const updateData = {};
        if (currentPassword !== undefined || newPassword !== undefined) {
            if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
                return res.status(400).json({
                    message: "Current password and new password are required to change your password",
                    error: true,
                    success: false
                });
            }

            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    message: "Current password and new password must both be provided",
                    error: true,
                    success: false
                });
            }

            if (newPassword.length < 8) {
                return res.status(400).json({
                    message: "New password must be at least 8 characters",
                    error: true,
                    success: false
                });
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    message: "Current password is incorrect",
                    error: true,
                    success: false
                });
            }

            if (await bcrypt.compare(newPassword, user.password)) {
                return res.status(400).json({
                    message: "New password must be different from the current password",
                    error: true,
                    success: false
                });
            }

            updateData.password = await bcrypt.hash(newPassword, 12);
            updateData.mustChangePassword = false;
            updateData.temporaryPasswordSetAt = undefined;
        }
        
        if (name !== undefined) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone;
        if (profilePic !== undefined) updateData.profilePic = profilePic;
        
        // Handle user preferences (currency, language, timezone)
        if (preferences) {
            if (!user.preferences) user.preferences = {};
            
            if (preferences.currency) {
                user.preferences.currency = preferences.currency;
            }
            if (preferences.language) {
                user.preferences.language = preferences.language;
            }
            if (preferences.timezone) {
                user.preferences.timezone = preferences.timezone;
            }
            
            updateData.preferences = user.preferences;
        }
        
        // Handle verification documents
        if (verificationDocuments && Array.isArray(verificationDocuments)) {
            // Initialize verificationDocuments if it doesn't exist
            if (!user.verificationDocuments) {
                user.verificationDocuments = [];
            }
            
            // Update or add verification documents
            verificationDocuments.forEach(newDoc => {
                if (newDoc.type && newDoc.url) {
                    const existingDocIndex = user.verificationDocuments.findIndex(
                        doc => doc.type === newDoc.type
                    );
                    
                    if (existingDocIndex >= 0) {
                        user.verificationDocuments[existingDocIndex] = {
                            type: newDoc.type,
                            url: newDoc.url,
                            uploadedAt: new Date()
                        };
                    } else {
                        user.verificationDocuments.push({
                            type: newDoc.type,
                            url: newDoc.url,
                            uploadedAt: new Date()
                        });
                    }
                }
            });
            
            updateData.verificationDocuments = user.verificationDocuments;
        }
        
        // Handle address update
        if (address) {
            updateData.address = {
                street: address.street || user.address?.street || '',
                city: address.city || user.address?.city || '',
                state: address.state || user.address?.state || '',
                zipCode: address.zipCode || user.address?.zipCode || '',
                country: address.country || user.address?.country || 'India'
            };
        }

        // Update user profile
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            updateData,
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
        console.error('Error in updateProfile:', err);
        res.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

module.exports = updateProfile;
