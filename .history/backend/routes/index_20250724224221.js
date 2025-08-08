const express = require('express');

const router = express.Router();

const userSignUpController = require('../controller/userSignUp');
const userSignInController = require('../controller/userSignin');
const userDetailsController = require('../controller/userDetails');
const authToken = require('../middleware/authToken');
const userLogout = require('../controller/userLogout');
const getProductController = require('../controller/getProduct');
const addProductController = require('../controller/addProduct');
const buyProductController = require('../controller/buyProduct');
const getUserProductsController = require('../controller/getUserProducts');
const getUserOrdersController = require('../controller/getUserOrders');
const updateProductController = require('../controller/updateProduct');
const deleteProductController = require('../controller/deleteProduct');
const updateOrderStatusController = require('../controller/updateOrderStatus');

// User authentication routes
router.post('/signup', userSignUpController);
router.post('/signin', userSignInController);
router.get('/user-details', authToken, userDetailsController);
router.get('/userLogout', userLogout);

// Product routes
router.get('/get-product', getProductController);
router.post('/add-product', authToken, addProductController);
router.get('/user-products', authToken, getUserProductsController);
router.put('/update-product/:productId', authToken, updateProductController);
router.delete('/delete-product/:productId', authToken, deleteProductController);

// Order/Purchase routes
router.post('/buy-product', authToken, buyProductController);
router.get('/user-orders', authToken, getUserOrdersController);
router.put('/update-order-status/:orderId', authToken, updateOrderStatusController);

module.exports = router