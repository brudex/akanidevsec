const db = require("../models");
const Joi = require("joi");
const logger = require("../utils/logger");
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const Controller = {};

Controller.listProjects = async (req, res) => {
    try {
        const projects = await db.Project.findAll({
            include: [{
                model: db.Service,
                as: 'services',
                include: [{
                    model: db.Microservice,
                    as: 'microservices'
                }]
            }],
            order: [['updatedAt', 'DESC']]
        });
        
        res.json({
            success: true,
            projects
        });
    } catch (error) {
        logger.error('Error listing projects:', error);
        res.status(500).json({
            success: false,
            message: "Failed to load projects"
        });
    }
};

Controller.createProject = async (req, res) => {
    const schema = Joi.object({
        projectName: Joi.string().required().min(3).max(50)
            .pattern(/^[a-zA-Z0-9\s\-_]{3,50}$/),
        description: Joi.string().allow(''),
        developers: Joi.array().items(Joi.string())
    });

    try {
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const project = await db.Project.create({
            ...value,
            uuid: uuidv4(),
            projectOwner: req.session.user.uuid,
            projectStatus: 0 // Default to DEVELOPMENT
        });

        res.json({
            success: true,
            message: "Project created successfully",
            project
        });
    } catch (error) {
        logger.error('Error creating project:', error);
        res.status(500).json({
            success: false,
            message: "Failed to create project"
        });
    }
};

Controller.projectDetails = async (req, res) => {
    try {
        const project = await db.Project.findOne({
            where: { uuid: req.params.uuid },
            include: [
                {
                    model: db.Service,
                    as: 'services',
                    include: [{
                        model: db.Microservice,
                        as: 'microservices',
                        include: [{
                            model: db.DeploymentConfig,
                            as: 'deploymentConfigs',
                            include: [{
                                model: db.DeploymentEnvironment,
                                as: 'environment'
                            }]
                        }]
                    }]
                },
                {
                    model: db.ProjectNote,
                    as: 'notes',
                    order: [['createdAt', 'DESC']]
                }
            ]
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        res.json({
            success: true,
            project
        });
    } catch (error) {
        logger.error('Error fetching project details:', error);
        res.status(500).json({
            success: false,
            message: "Failed to load project details"
        });
    }
};

Controller.updateProjectStatus = async (req, res) => {
    const schema = Joi.object({
        status: Joi.number().min(0).max(4).required()
    });

    try {
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const project = await db.Project.findOne({
            where: { uuid: req.params.uuid }
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        // Validate status transition
        if (value.status - project.projectStatus > 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid status transition. Status can only be increased by one level at a time."
            });
        }

        project.projectStatus = value.status;
        await project.save();

        res.json({
            success: true,
            message: "Project status updated successfully",
            project
        });
    } catch (error) {
        logger.error('Error updating project status:', error);
        res.status(500).json({
            success: false,
            message: "Failed to update project status"
        });
    }
};

Controller.addProjectNote = async (req, res) => {
    const schema = Joi.object({
        noteText: Joi.string().allow(''),
        file: Joi.object().optional()
    });

    try {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        let filePath = null;
        let fileName = null;
        let fileSize = null;

        if (req.file) {
            if (req.file.size > 52428800) { // 50MB
                return res.status(400).json({
                    success: false,
                    message: "File size exceeds 50MB limit"
                });
            }
            
            // Create notes directory if it doesn't exist
            const notesDir = path.join(__dirname, '../public/uploads/notes');
            if (!fs.existsSync(notesDir)) {
                fs.mkdirSync(notesDir, { recursive: true });
            }

            // Generate unique filename
            fileName = req.file.originalname;
            const fileExt = path.extname(fileName);
            const uniqueFileName = `${uuidv4()}${fileExt}`;
            filePath = path.join(notesDir, uniqueFileName);
            fileSize = req.file.size;

            // Save file
            fs.writeFileSync(filePath, req.file.buffer);
        }

        const note = await db.ProjectNote.create({
            uuid: uuidv4(),
            projectUuid: req.params.uuid,
            noteText: req.body.noteText,
            filePath,
            fileName,
            fileSize
        });

        res.json({
            success: true,
            message: "Note added successfully",
            note
        });
    } catch (error) {
        logger.error('Error adding project note:', error);
        res.status(500).json({
            success: false,
            message: "Failed to add note"
        });
    }
};

Controller.deleteProject = async (req, res) => {
    try {
        const project = await db.Project.findOne({
            where: { uuid: req.params.uuid }
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        // Check if user has permission to delete
        if (project.projectOwner !== req.session.user.uuid) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to delete this project"
            });
        }

        await project.destroy();

        res.json({
            success: true,
            message: "Project deleted successfully"
        });
    } catch (error) {
        logger.error('Error deleting project:', error);
        res.status(500).json({
            success: false,
            message: "Failed to delete project"
        });
    }
};

module.exports = Controller;