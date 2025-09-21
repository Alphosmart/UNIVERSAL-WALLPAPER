const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Verify configuration
const verifyCloudinaryConfig = () => {
    const requiredVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
    const missingVars = requiredVars.filter(varName => !process.env[varName] || process.env[varName].includes('your_'));
    
    if (missingVars.length > 0) {
        console.warn(`⚠️  Cloudinary not configured. Missing or placeholder values for: ${missingVars.join(', ')}`);
        console.warn('Images will be stored locally. Update .env with actual Cloudinary credentials for cloud storage.');
        return false;
    }
    
    console.log('✅ Cloudinary configured successfully');
    return true;
};

// Upload image to Cloudinary
const uploadToCloudinary = async (filePath, options = {}) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'ecommerce-products',
            quality: 'auto',
            fetch_format: 'auto',
            ...options
        });
        return result;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};

// Delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw error;
    }
};

module.exports = {
    cloudinary,
    verifyCloudinaryConfig,
    uploadToCloudinary,
    deleteFromCloudinary
};
