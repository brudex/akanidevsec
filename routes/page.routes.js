const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth.middleware');

// Public pages
router.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login', layout: false });
});

router.get('/register', (req, res) => {
    res.render('register', { title: 'Register', layout: false });
});

// Protected pages
router.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard/index', { title: 'Dashboard', layout: 'layouts/dashboard' });
});

router.get('/projects', isAuthenticated, (req, res) => {
    res.render('projects/list', { title: 'Projects', layout: 'layouts/dashboard' });
});

router.get('/projects/create', isAuthenticated, (req, res) => {
    res.render('projects/create', { title: 'Create Project', layout: 'layouts/dashboard' });
});

router.get('/projects/:uuid', isAuthenticated, (req, res) => {
    res.render('projects/details', { title: 'Project Details', layout: 'layouts/dashboard' });
});

module.exports = router;