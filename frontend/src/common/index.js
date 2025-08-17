const backendDomain = "http://localhost:8080"

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
        url : `${backendDomain}/api/delete-product`,
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
    // Seller payment management APIs
    getSellerPaymentDetails : {
        url : `${backendDomain}/api/seller-payment-details`,
        method : 'get'
    },
    updateSellerPaymentDetails : {
        url : `${backendDomain}/api/seller-payment-details`,
        method : 'put'
    },
    uploadSellerDocument : {
        url : `${backendDomain}/api/seller-document-upload`,
        method : 'post'
    },
    verifySellerDocument : {
        url : `${backendDomain}/api/admin/verify-seller-document`,
        method : 'put'
    },
    getAllSellersPaymentDetails : {
        url : `${backendDomain}/api/admin/sellers-payment-details`,
        method : 'get'
    },
    // Payment method APIs
    getAvailablePaymentMethods : {
        url : `${backendDomain}/api/payment-methods/available`,
        method : 'post'
    },
    getSellerPaymentPreferences : {
        url : `${backendDomain}/api/seller/payment-preferences`,
        method : 'get'
    },
    updateSellerPaymentPreferences : {
        url : `${backendDomain}/api/seller/payment-preferences`,
        method : 'put'
    },
    // Seller application endpoints
    applyToBeSeller : {
        url : `${backendDomain}/api/seller/apply`,
        method : 'post'
    },
    uploadVerificationDocument : {
        url : `${backendDomain}/api/seller/upload-document`,
        method : 'post'
    },
    updateProfileForSeller : {
        url : `${backendDomain}/api/seller/update-profile`,
        method : 'put'
    },
    checkSellerEligibility : {
        url : `${backendDomain}/api/seller/check-eligibility`,
        method : 'get'
    },
    getSellerApplicationStatus : {
        url : `${backendDomain}/api/seller/application-status`,
        method : 'get'
    },
    getPendingSellerApplications : {
        url : `${backendDomain}/api/admin/pending-seller-applications`,
        method : 'get'
    },
    reviewSellerApplication : {
        url : `${backendDomain}/api/admin/review-seller-application`,
        method : 'put'
    },
    // Seller order management endpoints
    getSellerOrders : {
        url : `${backendDomain}/api/seller/orders`,
        method : 'get'
    },
    getSellerOrderStats : {
        url : `${backendDomain}/api/seller/order-stats`,
        method : 'get'
    },
    updateSellerOrderStatus : {
        url : `${backendDomain}/api/seller/orders`,
        method : 'put'
    },
    // Order tracking endpoints
    getOrderTracking : {
        url : `${backendDomain}/api/orders/:orderId/tracking`,
        method : 'get'
    },
    getBuyerOrdersWithTracking : {
        url : `${backendDomain}/api/buyer/orders/tracking`,
        method : 'get'
    },
    updateOrderTracking : {
        url : `${backendDomain}/api/seller/orders/:orderId/tracking`,
        method : 'put'
    },
    trackByNumber : {
        url : `${backendDomain}/api/track/:trackingNumber`,
        method : 'get'
    },
    // Shipping endpoints
    getShippingSettings : {
        url : `${backendDomain}/api/admin/shipping/settings`,
        method : 'get'
    },
    updateGlobalShippingSettings : {
        url : `${backendDomain}/api/admin/shipping/global`,
        method : 'put'
    },
    createShippingZone : {
        url : `${backendDomain}/api/admin/shipping/zones`,
        method : 'post'
    },
    updateShippingZone : {
        url : `${backendDomain}/api/admin/shipping/zones/:zoneId`,
        method : 'put'
    },
    deleteShippingZone : {
        url : `${backendDomain}/api/admin/shipping/zones/:zoneId`,
        method : 'delete'
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
    
    // Shipping Company APIs
    registerShippingCompany : {
        url : `${backendDomain}/api/shipping-company/register`,
        method : 'post'
    },
    getShippingCompanyProfile : {
        url : `${backendDomain}/api/shipping-company/profile`,
        method : 'get'
    },
    updateShippingCompanyProfile : {
        url : `${backendDomain}/api/shipping-company/profile`,
        method : 'put'
    },
    getAvailableOrders : {
        url : `${backendDomain}/api/shipping-company/available-orders`,
        method : 'get'
    },
    submitShippingQuote : {
        url : `${backendDomain}/api/shipping-company/orders`,
        method : 'post'
    },
    getShippingQuotes : {
        url : `${backendDomain}/api/shipping-company/quotes`,
        method : 'get'
    },
    getShippingCompanyStats : {
        url : `${backendDomain}/api/shipping-company/stats`,
        method : 'get'
    },
    
    // Order Shipping APIs
    getOrderShippingQuotes : {
        url : `${backendDomain}/api/orders`,
        method : 'get'
    },
    selectShippingQuote : {
        url : `${backendDomain}/api/orders`,
        method : 'post'
    },
    
    // Admin Shipping Company Management
    getAllShippingCompanies : {
        url : `${backendDomain}/api/admin/shipping-companies`,
        method : 'get'
    },
    updateShippingCompanyStatus : {
        url : `${backendDomain}/api/admin/shipping-companies`,
        method : 'put'
    },
    
    // Maintenance Mode
    maintenanceStatus : {
        url : `${backendDomain}/api/maintenance-status`,
        method : 'get'
    }
}

export default SummaryApi
