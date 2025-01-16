const express = require('express');
const router = express.Router();
const apiAuth = require('../../middlewares/api-auth');

// Import API route modules
const projectRoutes = require('./project.routes');
const serviceRoutes = require('./service.routes');
const deploymentRoutes = require('./deployment.routes');
const environmentRoutes = require('./environment.routes');

// API routes with authentication
router.use('/projects', apiAuth, projectRoutes);
router.use('/services', apiAuth, serviceRoutes);
router.use('/deployment', apiAuth, deploymentRoutes);
router.use('/environments', apiAuth, environmentRoutes);

module.exports = router;