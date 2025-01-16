module.exports = (sequelize, DataTypes) => {
    const Service = sequelize.define('Service', {
        uuid: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        projectUuid: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'projects',
                key: 'uuid'
            }
        },
        serviceName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        repositoryUrl: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isUrl: true
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'services',
        timestamps: true
    });

    Service.associate = (models) => {
        Service.belongsTo(models.Project, {
            foreignKey: 'projectUuid',
            as: 'project'
        });
        Service.hasMany(models.Microservice, {
            foreignKey: 'serviceUuid',
            as: 'microservices'
        });
    };

    return Service;
};