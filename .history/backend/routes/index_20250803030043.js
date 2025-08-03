const express = require('express');

const router = express.Router();

const userSignUpController = require('../controller/userSignUp');
const userSignInController = require('../controller/userSignin');
const userDetailsController = require('../controller/userDetails');
const updateProfile = require('../controller/updateProfile');
const authToken = require('../middleware/authToken');
const userLogout = require('../controller/userLogout');
const getProductController = require('../controller/getProduct');
const getSingleProductController = require('../controller/getSingleProduct');
const addProductController = require('../controller/addProduct');
const buyProductController = require('../controller/buyProduct');
const getUserProductsController = require('../controller/getUserProducts');
const getUserOrdersController = require('../controller/getUserOrders');
const updateProductController = require('../controller/updateProduct');
const deleteProductController = require('../controller/deleteProduct');
const updateOrderStatusController = require('../controller/updateOrderStatus');
const { 
    getAllUsers, 
    updateUserRole, 
    getAllProductsAdmin, 
    deleteProductAdmin, 
    updateProductStatus, 
    getDashboardStats 
} = require('../controller/adminController');
const createAdminUser = require('../controller/createAdminUser');
const {
    forgotPasswordController,
    verifyResetTokenController,
    resetPasswordController
} = require('../controller/forgotPassword');
const {
    getUserCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    syncCart
} = require('../controller/cartController');
const {
    applyToBeSeller,
    uploadVerificationDocument,
    getSellerApplications,
    updateSellerStatus,
    updateProfileForSeller,
    checkSellerEligibility
} = require('../controller/sellerController');

// User authentication routes
router.post('/signup', userSignUpController);
router.post('/signin', userSignInController);
router.get('/user-details', authToken, userDetailsController);
// Profile routes
router.put('/update-profile', authToken, updateProfile);
router.post('/upload-verification-document', authToken, uploadVerificationDocument);
router.get('/userLogout', userLogout);

// Password reset routes
router.post('/forgot-password', forgotPasswordController);
router.get('/verify-reset-token', verifyResetTokenController);
router.post('/reset-password', resetPasswordController);

// Product routes
router.get('/get-product', getProductController);
router.get('/product/:productId', getSingleProductController);
router.post('/add-product', authToken, addProductController);
router.get('/user-products', authToken, getUserProductsController);
router.put('/update-product/:productId', authToken, updateProductController);
router.delete('/delete-product/:productId', authToken, deleteProductController);

// Order/Purchase routes
router.post('/buy-product', authToken, buyProductController);
router.get('/user-orders', authToken, getUserOrdersController);
router.put('/update-order-status/:orderId', authToken, updateOrderStatusController);

// Cart routes
router.get('/cart', authToken, getUserCart);
router.post('/cart/add', authToken, addToCart);
router.put('/cart/update', authToken, updateCartItem);
router.delete('/cart/remove/:productId', authToken, removeFromCart);
router.delete('/cart/clear', authToken, clearCart);
router.post('/cart/sync', authToken, syncCart);

// Admin routes
router.get('/admin/all-users', authToken, getAllUsers);
router.put('/admin/update-user-role/:userId', authToken, updateUserRole);
router.get('/admin/all-products', authToken, getAllProductsAdmin);
router.delete('/admin/delete-product/:productId', authToken, deleteProductAdmin);
router.put('/admin/update-product-status/:productId', authToken, updateProductStatus);
router.get('/admin/dashboard-stats', authToken, getDashboardStats);
router.get('/admin/seller-applications', authToken, getSellerApplications);
router.put('/admin/update-seller-status/:userId', authToken, updateSellerStatus);

// Seller routes
router.post('/seller/apply', authToken, applyToBeSeller);
router.post('/seller/upload-document', authToken, uploadVerificationDocument);
router.put('/seller/update-profile', authToken, updateProfileForSeller);
router.get('/seller/check-eligibility', authToken, checkSellerEligibility);

// Development route to create admin user
router.get('/create-admin', createAdminUser);

module.exports = router