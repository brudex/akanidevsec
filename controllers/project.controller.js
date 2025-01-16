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
            }]
        });
        
        res.render("projects/list", {
            title: "Projects",
            projects
        });
    } catch (error) {
        logger.error('Error listing projects:', error);
        req.flash("error", "Failed to load projects");
        res.redirect("/dashboard");
    }
};

Controller.createProjectView = async (req, res) => {
    res.render("projects/create", {
        title: "Create Project"
    });
};

Controller.createProject = async (req, res) => {
    const schema = Joi.object({
        gitlabUrl: Joi.string().uri().required(),
        projectName: Joi.string().required(),
        description: Joi.string().allow(''),
        developers: Joi.array().items(Joi.string().uuid()),
        cicdSpecification: Joi.object()
    });

    try {
        const { error, value } = schema.validate(req.body);
        if (error) {
            req.flash("error", error.details[0].message);
            return res.redirect("/projects/create");
        }

        const project = await db.Project.create({
            ...value,
            uuid: uuidv4(),
            projectOwner: req.session.user.uuid,
            projectStatus: 0
        });

        req.flash("success", "Project created successfully");
        res.redirect(`/projects/${project.uuid}`);
    } catch (error) {
        logger.error('Error creating project:', error);
        req.flash("error", "Failed to create project");
        res.redirect("/projects/create");
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
                    as: 'notes'
                }
            ]
        });

        if (!project) {
            req.flash("error", "Project not found");
            return res.redirect("/projects");
        }

        res.render("projects/details", {
            title: project.projectName,
            project
        });
    } catch (error) {
        logger.error('Error fetching project details:', error);
        req.flash("error", "Failed to load project details");
        res.redirect("/projects");
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

        project.projectStatus = value.status;
        await project.save();

        res.json({
            success: true,
            message: "Project status updated successfully"
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
            filePath = req.file.path;
            fileName = req.file.originalname;
            fileSize = req.file.size;
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

module.exports = Controller;