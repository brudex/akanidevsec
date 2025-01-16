const db = require('../models');
const logger = require('../utils/logger');

const Controller = {};

Controller.index = async (req, res) => {
    try {
        // Fetch recent projects with their services
        const projects = await db.Project.findAll({
            include: [{
                model: db.Service,
                as: 'services'
            }],
            order: [['updatedAt', 'DESC']],
            limit: 5
        });

        res.render('dashboard/index', {
            title: 'Dashboard',
            layout: 'layouts/dashboard',
            path: req.path,
            projects
        });
    } catch (error) {
        logger.error('Error loading dashboard:', error);
        req.flash('error', 'Failed to load dashboard data');
        res.render('dashboard/index', {
            title: 'Dashboard',
            layout: 'layouts/dashboard',
            path: req.path,
            projects: []
        });
    }
};

module.exports = Controller;