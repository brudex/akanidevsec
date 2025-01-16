const express = require('express');
const router = express.Router();

// Import route modules
const pageRoutes = require('./page.routes');
const apiRoutes = require('./api.routes');
const copilotRoutes = require('./copilot.routes');
const authRoutes = require('./auth.routes');
const adminRoutes = require('./admin.routes');

// Auth middleware
const { isAuthenticated } = require('../middlewares/auth.middleware');

// Public routes
router.use('/', pageRoutes);
router.use('/api', apiRoutes);
router.use('/auth', authRoutes);

// Protected routes
router.use('/copilot', isAuthenticated, copilotRoutes);
router.use('/admin', isAuthenticated, adminRoutes);

// 404 handler
router.get('*', (req, res) => {
    res.render('404', { layout: false });
});

module.exports = router;