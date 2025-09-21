const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  maxDiscount: {
    type: Number,
    default: null
  },
  minOrderAmount: {
    type: Number,
    default: 0
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usedCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient lookups
couponSchema.index({ code: 1, isActive: 1 });
couponSchema.index({ expiryDate: 1 });

// Virtual to check if coupon is valid
couponSchema.virtual('isValid').get(function() {
  const now = new Date();
  return this.isActive && 
         this.expiryDate > now &&
         (this.usageLimit === null || this.usedCount < this.usageLimit);
});

couponSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Coupon', couponSchema);
