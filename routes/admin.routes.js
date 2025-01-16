const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middlewares/auth.middleware');

// Admin middleware for all routes
router.use(isAdmin);

// Environment management
router.get('/environments', (req, res) => {
    res.render('admin/environments', { 
        title: 'Manage Environments',
        layout: 'layouts/dashboard'
    });
});

// User management
router.get('/users', (req, res) => {
    res.render('admin/users', { 
        title: 'Manage Users',
        layout: 'layouts/dashboard'
    });
});

// System settings
router.get('/settings', (req, res) => {
    res.render('admin/settings', { 
        title: 'System Settings',
        layout: 'layouts/dashboard'
    });
});

module.exports = router;