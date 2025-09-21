const ContactMessage = require('../models/contactMessageModel');

// Submit a contact form message
async function submitContactMessage(req, res) {
    try {
        const { name, email, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                message: "All fields are required",
                error: true,
                success: false
            });
        }

        // Create new contact message
        const contactMessage = new ContactMessage({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            subject: subject.trim(),
            message: message.trim()
        });

        await contactMessage.save();

        res.status(201).json({
            message: "Thank you for your message! We will get back to you soon.",
            error: false,
            success: true,
            data: {
                id: contactMessage._id,
                submittedAt: contactMessage.createdAt
            }
        });

    } catch (err) {
        res.status(500).json({
            message: err.message || 'Failed to submit contact message',
            error: true,
            success: false
        });
    }
}

// Get all contact messages (Admin only)
async function getContactMessages(req, res) {
    try {
        const { page = 1, limit = 20, status, search } = req.query;

        let query = {};

        // Filter by status if provided
        if (status && ['unread', 'read', 'replied', 'archived'].includes(status)) {
            query.status = status;
        }

        // Search functionality
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { name: searchRegex },
                { email: searchRegex },
                { subject: searchRegex },
                { message: searchRegex }
            ];
        }

        const skip = (page - 1) * limit;

        const messages = await ContactMessage.find(query)
            .populate('repliedBy', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await ContactMessage.countDocuments(query);

        // Get status counts for dashboard
        const statusCounts = await ContactMessage.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const statusSummary = {
            unread: 0,
            read: 0,
            replied: 0,
            archived: 0
        };

        statusCounts.forEach(item => {
            statusSummary[item._id] = item.count;
        });

        res.json({
            message: "Contact messages retrieved successfully",
            error: false,
            success: true,
            data: {
                messages,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalMessages: total,
                    hasNextPage: page * limit < total,
                    hasPrevPage: page > 1
                },
                statusSummary
            }
        });

    } catch (err) {
        res.status(500).json({
            message: err.message || 'Failed to retrieve contact messages',
            error: true,
            success: false
        });
    }
}

// Update contact message status (Admin only)
async function updateContactMessageStatus(req, res) {
    try {
        const { messageId } = req.params;
        const { status, adminNotes } = req.body;

        if (!['unread', 'read', 'replied', 'archived'].includes(status)) {
            return res.status(400).json({
                message: "Invalid status",
                error: true,
                success: false
            });
        }

        const updateData = { status };
        
        if (adminNotes !== undefined) {
            updateData.adminNotes = adminNotes;
        }

        if (status === 'replied') {
            updateData.repliedAt = new Date();
            updateData.repliedBy = req.userId;
        }

        const message = await ContactMessage.findByIdAndUpdate(
            messageId,
            updateData,
            { new: true }
        ).populate('repliedBy', 'name email');

        if (!message) {
            return res.status(404).json({
                message: "Message not found",
                error: true,
                success: false
            });
        }

        res.json({
            message: "Message status updated successfully",
            error: false,
            success: true,
            data: message
        });

    } catch (err) {
        res.status(500).json({
            message: err.message || 'Failed to update message status',
            error: true,
            success: false
        });
    }
}

// Delete contact message (Admin only)
async function deleteContactMessage(req, res) {
    try {
        const { messageId } = req.params;

        const message = await ContactMessage.findByIdAndDelete(messageId);

        if (!message) {
            return res.status(404).json({
                message: "Message not found",
                error: true,
                success: false
            });
        }

        res.json({
            message: "Message deleted successfully",
            error: false,
            success: true
        });

    } catch (err) {
        res.status(500).json({
            message: err.message || 'Failed to delete message',
            error: true,
            success: false
        });
    }
}

// Get single contact message (Admin only)
async function getContactMessage(req, res) {
    try {
        const { messageId } = req.params;

        const message = await ContactMessage.findById(messageId)
            .populate('repliedBy', 'name email');

        if (!message) {
            return res.status(404).json({
                message: "Message not found",
                error: true,
                success: false
            });
        }

        // Mark as read if it was unread
        if (message.status === 'unread') {
            message.status = 'read';
            await message.save();
        }

        res.json({
            message: "Message retrieved successfully",
            error: false,
            success: true,
            data: message
        });

    } catch (err) {
        res.status(500).json({
            message: err.message || 'Failed to retrieve message',
            error: true,
            success: false
        });
    }
}

module.exports = {
    submitContactMessage,
    getContactMessages,
    updateContactMessageStatus,
    deleteContactMessage,
    getContactMessage
};
