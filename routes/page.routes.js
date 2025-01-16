const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth.middleware');
const dashboardController = require('../controllers/dashboard.controller');

// Root route - redirect based on auth status
router.get('/', (req, res) => {
    if (req.session && req.session.user) {
        return res.redirect('/dashboard');
    }
    return res.redirect('/auth/login');
});

// Auth routes
router.get('/auth/login', (req, res) => {
    // Redirect to dashboard if already logged in
    if (req.session && req.session.user) {
        return res.redirect('/dashboard');
    }
    res.render('login', { 
        title: 'Login', 
        layout: 'layouts/auth',
        path: req.path
    });
});

router.get('/auth/register', (req, res) => {
    // Redirect to dashboard if already logged in
    if (req.session && req.session.user) {
        return res.redirect('/dashboard');
    }
    res.render('register', { 
        title: 'Register', 
        layout: 'layouts/auth',
        path: req.path
    });
});

// Protected pages
router.get('/dashboard', isAuthenticated, dashboardController.index);

router.get('/projects', isAuthenticated, (req, res) => {
    res.render('projects/list', { 
        title: 'Projects', 
        layout: 'layouts/dashboard',
        path: req.path
    });
});

router.get('/projects/create', isAuthenticated, (req, res) => {
    res.render('projects/create', { 
        title: 'Create Project', 
        layout: 'layouts/dashboard',
        path: req.path
    });
});

router.get('/projects/:uuid', isAuthenticated, (req, res) => {
    res.render('projects/details', { 
        title: 'Project Details', 
        layout: 'layouts/dashboard',
        path: req.path
    });
});

module.exports = router;