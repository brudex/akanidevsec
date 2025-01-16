const db = require("../models");
const Joi = require("joi");
const logger = require("../utils/logger");
const { v4: uuidv4 } = require('uuid');
const Controller = {};

Controller.listEnvironments = async (req, res) => {
    try {
        const environments = await db.DeploymentEnvironment.findAll();
        res.render("deployment/environments", {
            title: "Deployment Environments",
            environments
        });
    } catch (error) {
        logger.error('Error listing environments:', error);
        req.flash("error", "Failed to load environments");
        res.redirect("/dashboard");
    }
};

Controller.createEnvironment = async (req, res) => {
    const schema = Joi.object({
        environmentName: Joi.string().required(),
        clusterName: Joi.string().required(),
        clusterUrl: Joi.string().uri().required(),
        namespace: Joi.string().required(),
        loadBalancerUrl: Joi.string().uri().allow(null),
        externalDomainName: Joi.string().allow(null),
        ecrUrl: Joi.string().allow(null),
        ecrCredentials: Joi.object().allow(null),
        visibilityLevel: Joi.number().min(0).max(4).required()
    });

    try {
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const environment = await db.DeploymentEnvironment.create({
            ...value,
            uuid: uuidv4()
        });

        res.json({
            success: true,
            message: "Environment created successfully",
            environment
        });
    } catch (error) {
        logger.error('Error creating environment:', error);
        res.status(500).json({
            success: false,
            message: "Failed to create environment"
        });
    }
};

Controller.createDeploymentConfig = async (req, res) => {
    const schema = Joi.object({
        namespace: Joi.string().required(),
        deploymentName: Joi.string().required(),
        serviceName: Joi.string().required(),
        externalUrl: Joi.string().uri().allow(null),
        internalUrl: Joi.string().allow(null)
    });

    try {
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        // Check if environment visibility level is appropriate
        const environment = await db.DeploymentEnvironment.findOne({
            where: { uuid: req.params.environmentUuid }
        });

        const microservice = await db.Microservice.findOne({
            where: { uuid: req.params.microserviceUuid },
            include: [{
                model: db.Service,
                as: 'service',
                include: [{
                    model: db.Project,
                    as: 'project'
                }]
            }]
        });

        if (environment.visibilityLevel > microservice.service.project.projectStatus) {
            return res.status(403).json({
                success: false,
                message: "Project status does not meet environment visibility requirements"
            });
        }

        const deploymentConfig = await db.DeploymentConfig.create({
            ...value,
            uuid: uuidv4(),
            microserviceUuid: req.params.microserviceUuid,
            environmentUuid: req.params.environmentUuid
        });

        res.json({
            success: true,
            message: "Deployment configuration created successfully",
            deploymentConfig
        });
    } catch (error) {
        logger.error('Error creating deployment config:', error);
        res.status(500).json({
            success: false,
            message: "Failed to create deployment configuration"
        });
    }
};

module.exports = Controller;