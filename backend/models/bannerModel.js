const mongoose = require('mongoose')

const bannerSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true,
        maxlength: 200
    },
    desktopImage: {
        type: String,
        required: true
    },
    mobileImage: {
        type: String,
        required: true
    },
    linkUrl: {
        type: String,
        default: ""
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

// Index for faster queries
bannerSchema.index({ isActive: 1, order: 1 })

const bannerModel = mongoose.model("banner", bannerSchema)

module.exports = bannerModel
