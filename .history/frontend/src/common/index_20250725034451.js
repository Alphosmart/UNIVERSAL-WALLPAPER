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
    addProduct : {
        url : `${backendDomain}/api/add-product`,
        method : 'post'
    },
    userProducts : {
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
    }
}

export default SummaryApi
