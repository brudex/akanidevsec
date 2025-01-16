const db = require("../models");
const Joi = require("joi");
const logger = require("../utils/logger");
const { v4: uuidv4 } = require('uuid');
const Controller = {};

Controller.createMicroservice = async (req, res) => {
    const schema = Joi.object({
        microserviceName: Joi.string().required(),
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

        const microservice = await db.Microservice.create({
            ...value,
            uuid: uuidv4(),
            serviceUuid: req.params.serviceUuid
        });

        res.json({
            success: true,
            message: "Microservice created successfully",
            microservice
        });
    } catch (error) {
        logger.error('Error creating microservice:', error);
        res.status(500).json({
            success: false,
            message: "Failed to create microservice"
        });
    }
};

Controller.updateMicroservice = async (req, res) => {
    const schema = Joi.object({
        microserviceName: Joi.string(),
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

        const microservice = await db.Microservice.findOne({
            where: { uuid: req.params.uuid }
        });

        if (!microservice) {
            return res.status(404).json({
                success: false,
                message: "Microservice not found"
            });
        }

        await microservice.update(value);

        res.json({
            success: true,
            message: "Microservice updated successfully",
            microservice
        });
    } catch (error) {
        logger.error('Error updating microservice:', error);
        res.status(500).json({
            success: false,
            message: "Failed to update microservice"
        });
    }
};

module.exports = Controller;