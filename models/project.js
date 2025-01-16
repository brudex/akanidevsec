module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define('Project', {
        uuid: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        gitlabUrl: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isUrl: true
            }
        },
        projectName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        projectStatus: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
                max: 4
            }
        },
        projectOwner: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'users',
                key: 'uuid'
            }
        },
        developers: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: []
        },
        cicdSpecification: {
            type: DataTypes.JSONB,
            allowNull: true
        }
    }, {
        tableName: 'projects',
        timestamps: true
    });

    Project.associate = (models) => {
        Project.hasMany(models.Service, {
            foreignKey: 'projectUuid',
            as: 'services'
        });
        Project.hasMany(models.ProjectNote, {
            foreignKey: 'projectUuid',
            as: 'notes'
        });
    };

    return Project;
};