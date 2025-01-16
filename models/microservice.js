module.exports = (sequelize, DataTypes) => {
    const Microservice = sequelize.define('Microservice', {
        uuid: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        serviceUuid: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'services',
                key: 'uuid'
            }
        },
        microserviceName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'microservices',
        timestamps: true
    });

    Microservice.associate = (models) => {
        Microservice.belongsTo(models.Service, {
            foreignKey: 'serviceUuid',
            as: 'service'
        });
        Microservice.hasMany(models.DeploymentConfig, {
            foreignKey: 'microserviceUuid',
            as: 'deploymentConfigs'
        });
    };

    return Microservice;
};