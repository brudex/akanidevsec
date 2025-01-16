module.exports = (sequelize, DataTypes) => {
    const DeploymentConfig = sequelize.define('DeploymentConfig', {
        uuid: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        microserviceUuid: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'microservices',
                key: 'uuid'
            }
        },
        environmentUuid: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'deployment_environments',
                key: 'uuid'
            }
        },
        namespace: {
            type: DataTypes.STRING,
            allowNull: false
        },
        deploymentName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        serviceName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        externalUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: true
            }
        },
        internalUrl: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'deployment_configs',
        timestamps: true
    });

    DeploymentConfig.associate = (models) => {
        DeploymentConfig.belongsTo(models.Microservice, {
            foreignKey: 'microserviceUuid',
            as: 'microservice'
        });
        DeploymentConfig.belongsTo(models.DeploymentEnvironment, {
            foreignKey: 'environmentUuid',
            as: 'environment'
        });
    };

    return DeploymentConfig;
};