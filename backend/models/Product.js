const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  title: {
    type: String,
    maxLength: 100
  },
  photos: [{
    url: {
      type: String,
      required: true
    },
    description: {
      type: String,
      maxLength: 200
    },
    cloudinaryId: String
  }],
  verified: {
    type: Boolean,
    default: false
  },
  helpfulVotes: {
    helpful: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    notHelpful: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  reported: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const variantSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  price: {
    type: Number,
    required: true
  },
  sku: {
    type: String,
    unique: true
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    default: null
  },
  category: {
    type: String,
    required: true
  },
  subCategory: {
    type: String,
    default: null
  },
  brand: {
    type: String,
    required: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    }
  }],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  variants: [variantSchema],
  features: [{
    type: String
  }],
  specifications: {
    type: Map,
    of: String
  },
  weight: {
    type: Number,
    default: 1
  },
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number }
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviews: [reviewSchema],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String
  }],
  seoTitle: {
    type: String
  },
  seoDescription: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ seller: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });

// Update the updatedAt field before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual for availability status
productSchema.virtual('isInStock').get(function() {
  return this.stock > 0;
});

// Method to calculate average rating
productSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = (totalRating / this.reviews.length).toFixed(1);
    this.numReviews = this.reviews.length;
  }
  return this.save();
};

// Method to add review
productSchema.methods.addReview = function(userId, name, rating, comment) {
  // Check if user already reviewed
  const existingReview = this.reviews.find(review => 
    review.user.toString() === userId.toString()
  );
  
  if (existingReview) {
    // Update existing review
    existingReview.rating = rating;
    existingReview.comment = comment;
    existingReview.createdAt = new Date();
  } else {
    // Add new review
    this.reviews.push({
      user: userId,
      name,
      rating,
      comment
    });
  }
  
  return this.calculateAverageRating();
};

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
