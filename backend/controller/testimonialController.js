const testimonialModel = require('../models/testimonialModel');
const userModel = require('../models/userModel');

// Get all testimonials for display (public)
async function getTestimonials(req, res) {
    try {
        const { limit = 6, featured = false } = req.query;
        
        let query = { isActive: true };
        if (featured === 'true') {
            query.featured = true;
        }
        
        const testimonials = await testimonialModel
            .find(query)
            .sort({ featured: -1, order: 1, createdAt: -1 })
            .limit(parseInt(limit))
            .select('-createdBy -updatedBy');
            
        res.json({
            message: "Testimonials retrieved successfully",
            error: false,
            success: true,
            data: testimonials
        });
        
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

// Get all testimonials for admin
async function getAllTestimonialsAdmin(req, res) {
    try {
        // Check if user is admin
        if (req.userId) {
            const sessionUser = await userModel.findById(req.userId);
            if (sessionUser?.role !== 'ADMIN') {
                return res.status(401).json({
                    message: "Access denied. Admin role required.",
                    error: true,
                    success: false
                });
            }
        }
        
        const testimonials = await testimonialModel
            .find()
            .populate('createdBy', 'name email')
            .populate('updatedBy', 'name email')
            .sort({ order: 1, createdAt: -1 });
            
        res.json({
            message: "All testimonials retrieved successfully",
            error: false,
            success: true,
            data: testimonials
        });
        
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

// Add new testimonial (admin only)
async function addTestimonial(req, res) {
    try {
        // Check if user is admin
        if (req.userId) {
            const sessionUser = await userModel.findById(req.userId);
            if (sessionUser?.role !== 'ADMIN') {
                return res.status(401).json({
                    message: "Access denied. Admin role required.",
                    error: true,
                    success: false
                });
            }
        }
        
        const { name, role, image, rating, text, location, isActive, featured, order } = req.body;
        
        // Validation
        if (!name || !role || !image || !rating || !text) {
            throw new Error("Please provide all required fields: name, role, image, rating, text");
        }
        
        if (rating < 1 || rating > 5) {
            throw new Error("Rating must be between 1 and 5");
        }
        
        const newTestimonial = new testimonialModel({
            name: name.trim(),
            role: role.trim(),
            image,
            rating: parseInt(rating),
            text: text.trim(),
            location: location?.trim() || '',
            isActive: isActive !== undefined ? isActive : true,
            featured: featured || false,
            order: order || 0,
            createdBy: req.userId
        });
        
        const savedTestimonial = await newTestimonial.save();
        
        res.status(201).json({
            message: "Testimonial added successfully",
            error: false,
            success: true,
            data: savedTestimonial
        });
        
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

// Update testimonial (admin only)
async function updateTestimonial(req, res) {
    try {
        // Check if user is admin
        if (req.userId) {
            const sessionUser = await userModel.findById(req.userId);
            if (sessionUser?.role !== 'ADMIN') {
                return res.status(401).json({
                    message: "Access denied. Admin role required.",
                    error: true,
                    success: false
                });
            }
        }
        
        const { testimonialId } = req.params;
        const updateData = { ...req.body };
        
        // Add updatedBy field
        updateData.updatedBy = req.userId;
        
        // Validation for rating if provided
        if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
            throw new Error("Rating must be between 1 and 5");
        }
        
        const updatedTestimonial = await testimonialModel.findByIdAndUpdate(
            testimonialId,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!updatedTestimonial) {
            return res.status(404).json({
                message: "Testimonial not found",
                error: true,
                success: false
            });
        }
        
        res.json({
            message: "Testimonial updated successfully",
            error: false,
            success: true,
            data: updatedTestimonial
        });
        
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

// Delete testimonial (admin only)
async function deleteTestimonial(req, res) {
    try {
        // Check if user is admin
        if (req.userId) {
            const sessionUser = await userModel.findById(req.userId);
            if (sessionUser?.role !== 'ADMIN') {
                return res.status(401).json({
                    message: "Access denied. Admin role required.",
                    error: true,
                    success: false
                });
            }
        }
        
        const { testimonialId } = req.params;
        
        const deletedTestimonial = await testimonialModel.findByIdAndDelete(testimonialId);
        
        if (!deletedTestimonial) {
            return res.status(404).json({
                message: "Testimonial not found",
                error: true,
                success: false
            });
        }
        
        res.json({
            message: "Testimonial deleted successfully",
            error: false,
            success: true,
            data: deletedTestimonial
        });
        
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

// Toggle testimonial active status (admin only)
async function toggleTestimonialStatus(req, res) {
    try {
        // Check if user is admin
        if (req.userId) {
            const sessionUser = await userModel.findById(req.userId);
            if (sessionUser?.role !== 'ADMIN') {
                return res.status(401).json({
                    message: "Access denied. Admin role required.",
                    error: true,
                    success: false
                });
            }
        }
        
        const { testimonialId } = req.params;
        
        const testimonial = await testimonialModel.findById(testimonialId);
        
        if (!testimonial) {
            return res.status(404).json({
                message: "Testimonial not found",
                error: true,
                success: false
            });
        }
        
        testimonial.isActive = !testimonial.isActive;
        testimonial.updatedBy = req.userId;
        await testimonial.save();
        
        res.json({
            message: `Testimonial ${testimonial.isActive ? 'activated' : 'deactivated'} successfully`,
            error: false,
            success: true,
            data: testimonial
        });
        
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

// Update testimonials order (admin only)
async function updateTestimonialsOrder(req, res) {
    try {
        // Check if user is admin
        if (req.userId) {
            const sessionUser = await userModel.findById(req.userId);
            if (sessionUser?.role !== 'ADMIN') {
                return res.status(401).json({
                    message: "Access denied. Admin role required.",
                    error: true,
                    success: false
                });
            }
        }
        
        const { testimonialsOrder } = req.body;
        
        if (!Array.isArray(testimonialsOrder)) {
            throw new Error("Invalid testimonials order data");
        }
        
        // Update order for each testimonial
        const updatePromises = testimonialsOrder.map((item, index) => 
            testimonialModel.findByIdAndUpdate(
                item.id,
                { 
                    order: index,
                    updatedBy: req.userId
                },
                { new: true }
            )
        );
        
        await Promise.all(updatePromises);
        
        res.json({
            message: "Testimonials order updated successfully",
            error: false,
            success: true
        });
        
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = {
    getTestimonials,
    getAllTestimonialsAdmin,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    toggleTestimonialStatus,
    updateTestimonialsOrder
};