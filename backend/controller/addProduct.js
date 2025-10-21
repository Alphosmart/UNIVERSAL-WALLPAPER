const Product = require("../models/productModel");
const User = require("../models/userModel");
const CurrencyService = require("../services/currencyService");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads/products');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Please upload only image files!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
}).array('productImages', 5); // Allow up to 5 images

async function addProductController(req, res) {
    try {
        // Handle file upload first
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({
                    message: "File upload error: " + err.message,
                    error: true,
                    success: false
                });
            } else if (err) {
                return res.status(400).json({
                    message: err.message,
                    error: true,
                    success: false
                });
            }

            // Now process the product data
            const {
                productName,
                brandName,
                category,
                productImage, // base64 images from frontend
                description,
                price,
                sellingPrice,
                currency, // Seller's local currency
                stock,
                condition,
                location,
                tags
            } = req.body;

            // Validate required fields
            if (!productName || !category || !price || !sellingPrice) {
                return res.status(400).json({
                    message: "Product name, category, price, and selling price are required",
                    error: true,
                    success: false
                });
            }

            // Get current user information
            const currentUser = await User.findById(req.userId);
            if (!currentUser) {
                return res.status(404).json({
                    message: "User not found",
                    error: true,
                    success: false
                });
            }

            // Find the company seller (single company model)
            const companySeller = await User.findOne({ 
                email: 'alpho4luv@gmail.com',
                role: 'ADMIN'
            });

            if (!companySeller) {
                return res.status(500).json({
                    message: "Company seller not found",
                    error: true,
                    success: false
                });
            }

            // Check if user has admin privileges or staff product upload permissions
            const canUpload = currentUser.role === 'ADMIN' || 
                             (currentUser.role === 'STAFF' && currentUser.permissions?.canUploadProducts);
            
            if (!canUpload) {
                return res.status(403).json({
                    message: "Insufficient permissions. Only administrators and authorized staff can add products to the store",
                    error: true,
                    success: false
                });
            }

            // Use current user as the seller (either admin or verified seller)
            let sellerId = currentUser._id;
            
            // For admin users, check if they want to use a specific seller account
            if (currentUser.role === 'ADMIN') {
                // Admin can optionally specify a seller, otherwise use their own account
                sellerId = req.body.sellerId || currentUser._id;
            }

            // Determine currency (from request or user default)
            const sellerCurrency = currency || currentUser.preferences?.currency || 'NGN';
            
            // Validate currency
            if (!CurrencyService.isCurrencySupported(sellerCurrency)) {
                return res.status(400).json({
                    message: `Unsupported currency: ${sellerCurrency}`,
                    error: true,
                    success: false
                });
            }

            // Process uploaded files and base64 images
            let allImages = [];
            
            // Add uploaded files to images array
            if (req.files && req.files.length > 0) {
                req.files.forEach(file => {
                    allImages.push(`/uploads/products/${file.filename}`);
                });
            }
            
            // Add base64 images from frontend
            if (productImage && Array.isArray(productImage)) {
                allImages = allImages.concat(productImage);
            } else if (productImage && typeof productImage === 'string') {
                allImages.push(productImage);
            }

            // Create new product with multi-currency support
            const newProduct = new Product({
                productName,
                brandName,
                category,
                productImage: allImages,
                description,
                
                // New multi-currency pricing structure
                pricing: {
                    originalPrice: {
                        amount: parseFloat(price),
                        currency: sellerCurrency
                    },
                    sellingPrice: {
                        amount: parseFloat(sellingPrice),
                        currency: sellerCurrency
                    }
                },
                
                // Legacy fields for backward compatibility
                price: parseFloat(price),
                sellingPrice: parseFloat(sellingPrice),
                
                seller: sellerId, // Assign to the current seller (admin or verified seller)
                sellerInfo: {
                    name: currentUser.name,
                    email: currentUser.email,
                    currency: sellerCurrency,
                    location: currentUser.address?.country || location
                },
                
                // Upload tracking information
                uploadedBy: req.userId,
                uploadedByInfo: {
                    name: currentUser.name,
                    email: currentUser.email,
                    role: currentUser.role,
                    uploadedAt: new Date()
                },
                
                // Company reference - use the designated company seller
                companyId: companySeller._id,
                
                stock: parseInt(stock) || 1,
                condition: condition || 'new',
                location,
                tags: typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : (tags || [])
            });

            // Pre-calculate conversions for common currencies
            const cachedPrices = CurrencyService.updateCachedPrices(newProduct);
            newProduct.pricing.convertedPrices = cachedPrices;
            
            const savedProduct = await newProduct.save();

            // Update user's upload statistics
            await User.findByIdAndUpdate(req.userId, {
                $inc: { 'uploadStats.totalProducts': 1 },
                'uploadStats.lastUpload': new Date()
            });

            res.status(201).json({
                message: "Product added successfully",
                data: savedProduct,
                error: false,
                success: true
            });
        });

    } catch (err) {
        console.log("Error in addProduct:", err.message);
        res.status(500).json({
            message: "Failed to add product: " + err.message,
            error: true,
            success: false
        });
    }
}

module.exports = addProductController;
