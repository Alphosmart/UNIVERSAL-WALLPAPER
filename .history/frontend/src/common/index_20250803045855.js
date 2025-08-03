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
    }
}

export default SummaryApi
