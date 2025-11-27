const backendDomain = process.env.NODE_ENV === 'production' 
    ? "https://universaldotwallpaper.onrender.com" 
    : "http://localhost:8080"  // Use local backend for development

const SummaryApi = {
    signUP : {
        url : `${backendDomain}/api/signup`,
        method : "post"
    },
    signIn : {
        url : `${backendDomain}/api/signin`,
        method : "post"
    },
    current_user : {
        url : `${backendDomain}/api/user-details`,
        method : "get"
    },
    logout_user : {
        url : `${backendDomain}/api/userLogout`,
        method : 'get'
    },
    allProduct : {
        url : `${backendDomain}/api/get-product`,
        method : 'get'
    },
    getSingleProduct : {
        url : `${backendDomain}/api/product`,
        method : 'get'
    },
    addProduct : {
        url : `${backendDomain}/api/add-product`,
        method : 'post'
    },
    userProducts : {
        url : `${backendDomain}/api/user-products`,
        method : 'get'
    },
    getUserProducts : {
        url : `${backendDomain}/api/user-products`,
        method : 'get'
    },
    updateProduct : {
        url : `${backendDomain}/api/update-product`,
        method : 'put'
    },
    deleteProduct : {
        url : `${backendDomain}/api/delete-product/:productId`,
        method : 'delete'
    },
    buyProduct : {
        url : `${backendDomain}/api/buy-product`,
        method : 'post'
    },
    buyMultipleProducts : {
        url : `${backendDomain}/api/buy-multiple-products`,
        method : 'post'
    },
    userOrders : {
        url : `${backendDomain}/api/user-orders`,
        method : 'get'
    },
    updateOrderStatus : {
        url : `${backendDomain}/api/update-order-status`,
        method : 'put'
    },
    // Admin endpoints
    adminAllUsers : {
        url : `${backendDomain}/api/admin/all-users`,
        method : 'get'
    },
    adminUpdateUserRole : {
        url : `${backendDomain}/api/admin/update-user-role`,
        method : 'put'
    },
    adminAllProducts : {
        url : `${backendDomain}/api/admin/all-products`,
        method : 'get'
    },
    adminDeleteProduct : {
        url : `${backendDomain}/api/admin/delete-product`,
        method : 'delete'
    },
    adminUpdateProductStatus : {
        url : `${backendDomain}/api/admin/update-product-status`,
        method : 'put'
    },
    adminDashboardStats : {
        url : `${backendDomain}/api/admin/dashboard-stats`,
        method : 'get'
    },
    getAdminSettings : {
        url : `${backendDomain}/api/admin/settings`,
        method : 'get'
    },
    updateAdminSettings : {
        url : `${backendDomain}/api/admin/settings`,
        method : 'put'
    },
    
    // Category Management APIs
    adminCategories : {
        url : `${backendDomain}/api/admin/categories`,
        method : 'get'
    },
    addCategory : {
        url : `${backendDomain}/api/admin/categories`,
        method : 'post'
    },
    updateCategory : {
        url : `${backendDomain}/api/admin/categories`,
        method : 'put'
    },
    deleteCategory : {
        url : `${backendDomain}/api/admin/categories`,
        method : 'delete'
    },
    reorderCategories : {
        url : `${backendDomain}/api/admin/categories/reorder`,
        method : 'put'
    },
    
    // Database backup APIs
    createBackup : {
        url : `${backendDomain}/api/admin/backup/create`,
        method : 'post'
    },
    getBackupList : {
        url : `${backendDomain}/api/admin/backup/list`,
        method : 'get'
    },
    getBackupStats : {
        url : `${backendDomain}/api/admin/backup/stats`,
        method : 'get'
    },
    getBackupDetails : {
        url : `${backendDomain}/api/admin/backup`,
        method : 'get'
    },
    restoreBackup : {
        url : `${backendDomain}/api/admin/backup`,
        method : 'post'
    },
    deleteBackup : {
        url : `${backendDomain}/api/admin/backup`,
        method : 'delete'
    },
    
    // Staff Management APIs
    getAllStaff : {
        url : `${backendDomain}/api/admin/staff`,
        method : 'get'
    },
    getAllUsers : {
        url : `${backendDomain}/api/admin/all-users`,
        method : 'get'
    },
    promoteToAdmin : {
        url : `${backendDomain}/api/admin/promote-to-admin`,
        method : 'post'
    },
    grantPermissions : {
        url : `${backendDomain}/api/admin/grant-permissions`,
        method : 'put'
    },
    getUploadStats : {
        url : `${backendDomain}/api/admin/staff/upload-stats`,
        method : 'get'
    },
    // Cart APIs
    getCart : {
        url : `${backendDomain}/api/cart`,
        method : 'get'
    },
    addToCart : {
        url : `${backendDomain}/api/cart/add`,
        method : 'post'
    },
    updateCartItem : {
        url : `${backendDomain}/api/cart/update`,
        method : 'put'
    },
    removeFromCart : {
        url : `${backendDomain}/api/cart/remove`,
        method : 'delete'
    },
    clearCart : {
        url : `${backendDomain}/api/cart/clear`,
        method : 'delete'
    },
    syncCart : {
        url : `${backendDomain}/api/cart/sync`,
        method : 'post'
    },
    // Password reset APIs
    forgotPassword : {
        url : `${backendDomain}/api/forgot-password`,
        method : 'post'
    },
    verifyResetToken : {
        url : `${backendDomain}/api/verify-reset-token`,
        method : 'get'
    },
    resetPassword : {
        url : `${backendDomain}/api/reset-password`,
        method : 'post'
    },
    // Profile management APIs
    updateProfile : {
        url : `${backendDomain}/api/update-profile`,
        method : 'put'
    },
    getUserPreferences : {
        url : `${backendDomain}/api/user-preferences`,
        method : 'get'
    },
    updateUserPreferences : {
        url : `${backendDomain}/api/user-preferences`,
        method : 'put'
    },
    uploadProfilePicture : {
        url : `${backendDomain}/api/upload-profile-picture`,
        method : 'put'
    },
    uploadVerificationDocumentProfile : {
        url : `${backendDomain}/api/upload-verification-document`,
        method : 'post'
    },

    // Payment method APIs
    getAvailablePaymentMethods : {
        url : `${backendDomain}/api/payment-methods/available`,
        method : 'post'
    },



    // Order tracking endpoints - Simplified for single company
    getOrderTracking : {
        url : `${backendDomain}/api/orders/:orderId/tracking`,
        method : 'get'
    },
    getBuyerOrdersWithTracking : {
        url : `${backendDomain}/api/buyer/orders/tracking`,
        method : 'get'
    },
    updateOrderTracking : {
        url : `${backendDomain}/api/admin/orders/:orderId/tracking`,
        method : 'put'
    },
    trackByNumber : {
        url : `${backendDomain}/api/track/:trackingNumber`,
        method : 'get'
    },
    calculateShippingCost : {
        url : `${backendDomain}/api/shipping/calculate`,
        method : 'post'
    },
    getShippingMethods : {
        url : `${backendDomain}/api/shipping/methods`,
        method : 'get'
    },
    getShippingInfo : {
        url : `${backendDomain}/api/shipping/info`,
        method : 'get'
    },
    // Banner endpoints
    getBanners : {
        url : `${backendDomain}/api/banners`,
        method : 'get'
    },
    getAllBannersAdmin : {
        url : `${backendDomain}/api/admin/banners`,
        method : 'get'
    },
    addBanner : {
        url : `${backendDomain}/api/admin/banners`,
        method : 'post'
    },
    updateBanner : {
        url : `${backendDomain}/api/admin/banners`,
        method : 'put'
    },
    deleteBanner : {
        url : `${backendDomain}/api/admin/banners`,
        method : 'delete'
    },
    toggleBannerStatus : {
        url : `${backendDomain}/api/admin/banners`,
        method : 'put'
    },
    updateBannersOrder : {
        url : `${backendDomain}/api/admin/banners/order`,
        method : 'put'
    },
    getAllSiteContent : {
        url : `${backendDomain}/api/admin/site-content`,
        method : 'get'
    },
    getSiteContent : {
        url : `${backendDomain}/api/admin/site-content`,
        method : 'get'
    },
    getPublicSiteContent : {
        url : `${backendDomain}/api/site-content`,
        method : 'get'
    },
    updateSiteContent : {
        url : `${backendDomain}/api/admin/site-content`,
        method : 'put'
    },
    resetSiteContent : {
        url : `${backendDomain}/api/admin/site-content/reset`,
        method : 'delete'
    },
    
    // Maintenance Mode
    maintenanceStatus : {
        url : `${backendDomain}/api/maintenance-status`,
        method : 'get'
    },
    
    // Email Template Management
    getAllEmailTemplates : {
        url : `${backendDomain}/api/admin/email/templates`,
        method : 'get'
    },
    getEmailTemplate : {
        url : `${backendDomain}/api/admin/email/templates/:templateType`,
        method : 'get'
    },
    saveEmailTemplate : {
        url : `${backendDomain}/api/admin/email/templates`,
        method : 'post'
    },
    deleteEmailTemplate : {
        url : `${backendDomain}/api/admin/email/templates/:templateType`,
        method : 'delete'
    },
    toggleEmailTemplate : {
        url : `${backendDomain}/api/admin/email/templates/:templateType/toggle`,
        method : 'patch'
    },
    previewEmailTemplate : {
        url : `${backendDomain}/api/admin/email/templates/preview`,
        method : 'post'
    },
    // Advanced Search APIs
    smartSearch : {
        url : `${backendDomain}/api/search/smart`,
        method : 'get'
    },
    searchSuggestions : {
        url : `${backendDomain}/api/search/suggestions`,
        method : 'get'
    },
    popularSearches : {
        url : `${backendDomain}/api/search/popular`,
        method : 'get'
    },
    searchFilters : {
        url : `${backendDomain}/api/search/filters`,
        method : 'get'
    },
    
    // Contact Us API
    contactUs : {
        url : `${backendDomain}/api/contact`,
        method : 'post'
    },

    // Payment Configuration API
    adminPaymentConfig : {
        url : `${backendDomain}/api/admin/payment-config`,
        method : 'get'
    },
    updatePaymentConfig : {
        url : `${backendDomain}/api/admin/payment-config`,
        method : 'post'
    },
    testPaymentMethod : {
        url : `${backendDomain}/api/admin/payment-config/test`,
        method : 'post'
    },

    // Testimonials APIs
    getTestimonials : {
        url : `${backendDomain}/api/testimonials`,
        method : 'get'
    },
    adminGetAllTestimonials : {
        url : `${backendDomain}/api/admin/testimonials`,
        method : 'get'
    },
    adminAddTestimonial : {
        url : `${backendDomain}/api/admin/testimonials`,
        method : 'post'
    },
    adminUpdateTestimonial : {
        url : `${backendDomain}/api/admin/testimonials`,
        method : 'put'
    },
    adminDeleteTestimonial : {
        url : `${backendDomain}/api/admin/testimonials`,
        method : 'delete'
    },
    adminToggleTestimonialStatus : {
        url : `${backendDomain}/api/admin/testimonials`,
        method : 'put'
    },
    adminReorderTestimonials : {
        url : `${backendDomain}/api/admin/testimonials/reorder`,
        method : 'put'
    }
}

// Add baseURL for convenience
SummaryApi.baseURL = backendDomain;

export default SummaryApi
