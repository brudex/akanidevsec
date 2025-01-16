const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const serviceController = require('../controllers/service.controller');
const deploymentController = require('../controllers/deployment.controller');
const microserviceController = require('../controllers/microservice.controller');

// Project routes
router.get('/projects', projectController.listProjects);
router.post('/projects', projectController.createProject);
router.get('/projects/:uuid', projectController.projectDetails);
router.put('/projects/:uuid/status', projectController.updateProjectStatus);
router.post('/projects/:uuid/notes', projectController.addProjectNote);

// Service routes
router.post('/services', serviceController.createService);
router.put('/services/:uuid', serviceController.updateService);

// Microservice routes
router.post('/services/:serviceUuid/microservices', microserviceController.createMicroservice);
router.put('/microservices/:uuid', microserviceController.updateMicroservice);

// Deployment routes
router.get('/deployment/environments', deploymentController.listEnvironments);
router.post('/deployment/environments', deploymentController.createEnvironment);
router.post('/deployment/config', deploymentController.createDeploymentConfig);

module.exports = router;