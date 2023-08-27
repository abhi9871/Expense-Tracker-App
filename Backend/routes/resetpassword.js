const express = require('express');
const forgotPasswordController = require('../controllers/resetpassword');
const router = express.Router();

// Forgot Password route
router.post('/forgotpassword', forgotPasswordController.forgotPassword);

module.exports = router;