const { uploadToCloudinary, verifyCloudinaryConfig } = require('../config/cloudinary');
const fs = require('fs');

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded",
                error: true,
                success: false
            })
        }

        const imagePath = req.file.path;
        let imageUrl = imagePath;

        // Try to upload to Cloudinary if configured
        if (verifyCloudinaryConfig()) {
            try {
                const cloudinaryResult = await uploadToCloudinary(imagePath);
                imageUrl = cloudinaryResult.secure_url;
                
                // Delete local file after successful cloud upload
                fs.unlink(imagePath, (err) => {
                    if (err) console.error('Error deleting local file:', err);
                });
            } catch (cloudinaryError) {
                console.warn('Cloudinary upload failed, using local storage:', cloudinaryError.message);
                // Keep local file as fallback
            }
        } else {
            console.info('Using local storage for image');
        }

        res.json({
            message: "Image uploaded successfully",
            data: { url: imageUrl },
            error: false,
            success: true
        })
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        })
    }
}

module.exports = uploadImage
