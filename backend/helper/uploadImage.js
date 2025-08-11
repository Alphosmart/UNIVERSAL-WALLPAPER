const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded",
                error: true,
                success: false
            })
        }

        // For now, just return the file path
        // In a real application, you might want to use cloud storage like Cloudinary
        const imagePath = req.file.path

        res.json({
            message: "Image uploaded successfully",
            data: { url: imagePath },
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
