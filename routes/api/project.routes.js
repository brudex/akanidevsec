const express = require('express');
const router = express.Router();
const projectController = require('../../controllers/project.controller');

router.get('/', projectController.listProjects);
router.post('/', projectController.createProject);
router.get('/:uuid', projectController.projectDetails);
router.put('/:uuid/status', projectController.updateProjectStatus);
router.post('/:uuid/notes', projectController.addProjectNote);

module.exports = router;