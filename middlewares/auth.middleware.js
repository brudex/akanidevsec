const logger = require('../utils/logger');

// Mock user for testing
const MOCK_USER = {
    id: 1,
    uuid: '123e4567-e89b-12d3-a456-426614174000',
    email: 'demo@example.com',
    fullName: 'Demo User',
    isAdmin: true
};

const isAuthenticated = (req, res, next) => {
    // For development, always set mock user
    if (process.env.NODE_ENV !== 'production') {
        req.session = req.session || {};
        req.session.user = MOCK_USER;
        return next();
    }

    // Check if user is authenticated
    if (req.session && req.session.user) {
        return next();
    }

    logger.warn('Unauthorized access attempt', { 
        path: req.path,
        ip: req.ip
    });
    
    req.flash('error', 'Please login to continue');
    res.redirect('/auth/login');
};

const isAdmin = (req, res, next) => {
    // Check if user is authenticated
    if (!req.session || !req.session.user) {
        logger.warn('Unauthenticated admin access attempt', {
            path: req.path,
            ip: req.ip
        });
        req.flash('error', 'Please login to continue');
        return res.redirect('/auth/login');
    }

    // Check if user is admin
    if (!req.session.user.isAdmin) {
        logger.warn('Unauthorized admin access attempt', {
            path: req.path,
            ip: req.ip,
            user: req.session.user.uuid
        });
        req.flash('error', 'You do not have permission to access this area');
        return res.redirect('/dashboard');
    }

    next();
};

module.exports = { 
    isAuthenticated,
    isAdmin,
    MOCK_USER
};