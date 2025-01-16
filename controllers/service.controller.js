const db = require("../models");
const Joi = require("joi");
const logger = require("../utils/logger");
const { v4: uuidv4 } = require('uuid');
const Controller = {};

Controller.createService = async (req, res) => {
    const schema = Joi.object({
        serviceName: Joi.string().required(),
        repositoryUrl: Joi.string().uri().required(),
        description: Joi.string().allow('')
    });

    try {
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const service = await db.Service.create({
            ...value,
            uuid: uuidv4(),
            projectUuid: req.params.projectUuid
        });

        res.json({
            success: true,
            message: "Service created successfully",
            service
        });
    } catch (error) {
        logger.error('Error creating service:', error);
        res.status(500).json({
            success: false,
            message: "Failed to create service"
        });
    }
};

Controller.updateService = async (req, res) => {
    const schema = Joi.object({
        serviceName: Joi.string(),
        repositoryUrl: Joi.string().uri(),
        description: Joi.string().allow('')
    });

    try {
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const service = await db.Service.findOne({
            where: { uuid: req.params.uuid }
        });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        await service.update(value);

        res.json({
            success: true,
            message: "Service updated successfully",
            service
        });
    } catch (error) {
        logger.error('Error updating service:', error);
        res.status(500).json({
            success: false,
            message: "Failed to update service"
        });
    }
};

module.exports = Controller;