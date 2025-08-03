const userModel = require('../models/userModel');

// Update user profile
async function updateProfile(req, res) {
    try {
        const userId = req.userId;
        const { name, phone, address, profilePic } = req.body;

        // Find user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        // Prepare update data
        const updateData = {};
        
        if (name !== undefined) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone;
        if (profilePic !== undefined) updateData.profilePic = profilePic;
        
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
