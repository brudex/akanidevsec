module.exports = (sequelize, DataTypes) => {
    const DeploymentEnvironment = sequelize.define('DeploymentEnvironment', {
        uuid: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        environmentName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        clusterName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        clusterUrl: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isUrl: true
            }
        },
        namespace: {
            type: DataTypes.STRING,
            allowNull: false
        },
        loadBalancerUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: true
            }
        },
        externalDomainName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ecrUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ecrCredentials: {
            type: DataTypes.JSONB,
            allowNull: true
        },
        visibilityLevel: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
                max: 4
            }
        }
    }, {
        tableName: 'deployment_environments',
        timestamps: true
    });

    return DeploymentEnvironment;
};