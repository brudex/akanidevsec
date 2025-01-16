module.exports = (sequelize, DataTypes) => {
    const ProjectNote = sequelize.define('ProjectNote', {
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
        noteText: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        filePath: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fileName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fileSize: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                max: 52428800 // 50MB in bytes
            }
        }
    }, {
        tableName: 'project_notes',
        timestamps: true
    });

    ProjectNote.associate = (models) => {
        ProjectNote.belongsTo(models.Project, {
            foreignKey: 'projectUuid',
            as: 'project'
        });
    };

    return ProjectNote;
};