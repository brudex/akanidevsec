const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');

// Authentication routes
router.post('/login', accountController.loginPost);
router.post('/register', accountController.createUserPost);
router.get('/logout', accountController.logout);

// Password management
router.post('/forgot-password', accountController.forgotPassword);
router.post('/reset-password', accountController.resetPassword);
router.post('/change-password', accountController.changePasswordPost);

module.exports = router;