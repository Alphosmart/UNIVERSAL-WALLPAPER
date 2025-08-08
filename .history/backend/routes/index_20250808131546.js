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
const buyMultipleProductsController = require('../controller/buyMultipleProducts');
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
    getPendingSellerApplications,
    updateSellerStatus,
    reviewSellerApplication,
    updateProfileForSeller,
    checkSellerEligibility,
    getSellerPaymentDetails,
    updateSellerPaymentDetails,
    uploadSellerDocument,
    getSellerApplicationStatus
} = require('../controller/sellerController');
const {
    getSellerOrders,
    updateSellerOrderStatus,
    getSellerOrderStats
} = require('../controller/sellerOrdersController');
const {
    getAdminSettings,
    updateAdminSettings
} = require('../controller/settingsController');
const {
    getUserPreferences,
    updateUserPreferences
} = require('../controller/userPreferences');
const {
    createDatabaseBackup,
    getBackupList,
    getBackupDetails,
    restoreFromBackup,
    deleteBackup,
    getBackupStatistics
} = require('../controller/backupController');
const {
    getShippingSettings,
    updateGlobalShippingSettings,
    createShippingZone,
    updateShippingZone,
    deleteShippingZone,
    calculateShippingCost,
    getShippingMethods
} = require('../controller/shippingController');
const {
    getBanners,
    getAllBannersAdmin,
    addBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
    updateBannersOrder
} = require('../controller/bannerController');
const {
    getAvailablePaymentMethods,
    getSellerPaymentPreferences,
    updateSellerPaymentPreferences
} = require('../controller/paymentMethodController');
const {
    getOrderTracking,
    getBuyerOrdersWithTracking,
    updateOrderTracking,
    trackByTrackingNumber
} = require('../controller/orderTrackingController');

// User authentication routes
router.post('/signup', userSignUpController);
router.post('/signin', userSignInController);
router.get('/user-details', authToken, userDetailsController);
// Profile routes
router.put('/update-profile', authToken, updateProfile);
router.get('/user-preferences', authToken, getUserPreferences);
router.put('/user-preferences', authToken, updateUserPreferences);
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
router.post('/buy-multiple-products', authToken, buyMultipleProductsController);
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
router.get('/admin/pending-seller-applications', authToken, getPendingSellerApplications);
router.put('/admin/update-seller-status/:userId', authToken, updateSellerStatus);
router.put('/admin/review-seller-application/:userId', authToken, reviewSellerApplication);
router.get('/admin/settings', authToken, getAdminSettings);
router.put('/admin/settings', authToken, updateAdminSettings);

// Database backup routes (admin only)
router.post('/admin/backup/create', authToken, createDatabaseBackup);
router.get('/admin/backup/list', authToken, getBackupList);
router.get('/admin/backup/stats', authToken, getBackupStatistics);
router.get('/admin/backup/:backupId', authToken, getBackupDetails);
router.post('/admin/backup/:backupId/restore', authToken, restoreFromBackup);
router.delete('/admin/backup/:backupId', authToken, deleteBackup);

// Seller routes
router.post('/seller/apply', authToken, applyToBeSeller);
router.get('/seller/application-status', authToken, getSellerApplicationStatus);
router.post('/seller/upload-document', authToken, uploadVerificationDocument);
router.post('/upload-verification-document', authToken, uploadVerificationDocument);
router.put('/seller/update-profile', authToken, updateProfileForSeller);
router.get('/seller/check-eligibility', authToken, checkSellerEligibility);

// Seller payment management routes
router.get('/seller-payment-details', authToken, getSellerPaymentDetails);
router.put('/seller-payment-details', authToken, updateSellerPaymentDetails);
router.post('/seller-document-upload', authToken, uploadSellerDocument);

// Seller order management routes
router.get('/seller/orders', authToken, getSellerOrders);
router.get('/seller/order-stats', authToken, getSellerOrderStats);
router.put('/seller/orders/:orderId/status', authToken, updateSellerOrderStatus);

// Shipping routes
// Admin shipping management
router.get('/admin/shipping/settings', authToken, getShippingSettings);
router.put('/admin/shipping/global', authToken, updateGlobalShippingSettings);
router.post('/admin/shipping/zones', authToken, createShippingZone);
router.put('/admin/shipping/zones/:zoneId', authToken, updateShippingZone);
router.delete('/admin/shipping/zones/:zoneId', authToken, deleteShippingZone);

// Public shipping endpoints
router.post('/shipping/calculate', calculateShippingCost);
router.get('/shipping/methods/:country', getShippingMethods);

// Banner routes (public)
router.get('/banners', getBanners);

// Admin banner routes
router.get('/admin/banners', authToken, getAllBannersAdmin);
router.post('/admin/banners', authToken, addBanner);
router.put('/admin/banners/:bannerId', authToken, updateBanner);
router.delete('/admin/banners/:bannerId', authToken, deleteBanner);
router.put('/admin/banners/:bannerId/toggle', authToken, toggleBannerStatus);
router.put('/admin/banners/order', authToken, updateBannersOrder);

// Payment method routes
router.post('/payment-methods/available', getAvailablePaymentMethods);
router.get('/seller/payment-preferences/:sellerId', getSellerPaymentPreferences);
router.put('/seller/payment-preferences', authToken, updateSellerPaymentPreferences);

// Order tracking routes
router.get('/orders/:orderId/tracking', authToken, getOrderTracking);
router.get('/buyer/orders/tracking', authToken, getBuyerOrdersWithTracking);
router.put('/seller/orders/:orderId/tracking', authToken, updateOrderTracking);
router.get('/track/:trackingNumber', trackByTrackingNumber); // Public endpoint

// Development route to create admin user
router.get('/create-admin', createAdminUser);

module.exports = router