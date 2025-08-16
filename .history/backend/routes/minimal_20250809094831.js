const express = require('express');

const router = express.Router();

const userSignUpController = require('../controller/userSignUpTest');

// Basic user routes only
router.post('/signup', userSignUpController);

module.exports = router;
