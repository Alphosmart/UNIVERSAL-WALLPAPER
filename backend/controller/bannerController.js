const bannerModel = require('../models/bannerModel')
const userModel = require('../models/userModel')
const uploadImage = require('../helper/uploadImage')

// Get all active banners for display
async function getBanners(req, res) {
    try {
        const banners = await bannerModel.find({ 
            isActive: true 
        }).sort({ 
            order: 1, 
            createdAt: -1 
        }).populate('createdBy', 'name email')

        res.json({
            data: banners,
            message: "Banners retrieved successfully",
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

// Get all banners for admin (including inactive)
async function getAllBannersAdmin(req, res) {
    try {
        const banners = await bannerModel.find({})
            .sort({ order: 1, createdAt: -1 })
            .populate('createdBy', 'name email')

        res.json({
            data: banners,
            message: "All banners retrieved successfully",
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

// Add new banner
async function addBanner(req, res) {
    try {
        const { 
            title, 
            description, 
            desktopImage, 
            mobileImage, 
            linkUrl, 
            isActive = true, 
            order = 0 
        } = req.body

        if (!title || !desktopImage || !mobileImage) {
            return res.status(400).json({
                message: "Title, desktop image, and mobile image are required",
                error: true,
                success: false
            })
        }

        const banner = new bannerModel({
            title,
            description,
            desktopImage,
            mobileImage,
            linkUrl,
            isActive,
            order,
            createdBy: req.userId
        })

        const savedBanner = await banner.save()

        res.status(201).json({
            data: savedBanner,
            message: "Banner created successfully",
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

// Update banner
async function updateBanner(req, res) {
    try {
        const { bannerId } = req.params
        const updateData = { ...req.body }
        updateData.updatedAt = new Date()

        const updatedBanner = await bannerModel.findByIdAndUpdate(
            bannerId,
            updateData,
            { new: true }
        ).populate('createdBy', 'name email')

        if (!updatedBanner) {
            return res.status(404).json({
                message: "Banner not found",
                error: true,
                success: false
            })
        }

        res.json({
            data: updatedBanner,
            message: "Banner updated successfully",
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

// Delete banner
async function deleteBanner(req, res) {
    try {
        const { bannerId } = req.params

        const deletedBanner = await bannerModel.findByIdAndDelete(bannerId)

        if (!deletedBanner) {
            return res.status(404).json({
                message: "Banner not found",
                error: true,
                success: false
            })
        }

        res.json({
            message: "Banner deleted successfully",
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

// Toggle banner active status
async function toggleBannerStatus(req, res) {
    try {
        const { bannerId } = req.params

        const banner = await bannerModel.findById(bannerId)
        
        if (!banner) {
            return res.status(404).json({
                message: "Banner not found",
                error: true,
                success: false
            })
        }

        banner.isActive = !banner.isActive
        banner.updatedAt = new Date()
        
        const updatedBanner = await banner.save()

        res.json({
            data: updatedBanner,
            message: `Banner ${updatedBanner.isActive ? 'activated' : 'deactivated'} successfully`,
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

// Update banners order
async function updateBannersOrder(req, res) {
    try {
        const { banners } = req.body // Array of { bannerId, order }

        if (!Array.isArray(banners)) {
            return res.status(400).json({
                message: "Banners must be an array",
                error: true,
                success: false
            })
        }

        // Update each banner's order
        const updatePromises = banners.map(({ bannerId, order }) => 
            bannerModel.findByIdAndUpdate(
                bannerId, 
                { order, updatedAt: new Date() },
                { new: true }
            )
        )

        await Promise.all(updatePromises)

        res.json({
            message: "Banner order updated successfully",
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

module.exports = {
    getBanners,
    getAllBannersAdmin,
    addBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
    updateBannersOrder
}
