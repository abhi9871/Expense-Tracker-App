const express = require('express');
const forgotPasswordController = require('../controllers/resetpassword');
const router = express.Router();

// Forgot Password route
router.post('/forgotPassword', forgotPasswordController.forgotPassword);

// Reset Password route
router.post('/resetpassword/:requestId', forgotPasswordController.resetPassword);

module.exports = router;