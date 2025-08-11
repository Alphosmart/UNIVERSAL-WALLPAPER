const express = require('express');
const router = express.Router();

// Import controllers
const userSignUpController = require('../controller/userSignUp');
const userSignInController = require('../controller/userSignin');
const userDetailsController = require('../controller/userDetails');
const authToken = require('../middleware/authToken');

// Basic routes only to test
router.post('/signup', userSignUpController);
router.post('/signin', userSignInController);
router.get('/user-details', authToken, userDetailsController);

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

module.exports = router;
