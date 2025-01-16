const express = require('express');
const router = express.Router();
const deploymentController = require('../../controllers/deployment.controller');

router.get('/environments', deploymentController.listEnvironments);
router.post('/environments', deploymentController.createEnvironment);
router.post('/config', deploymentController.createDeploymentConfig);

module.exports = router;