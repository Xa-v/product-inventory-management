const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        username: { type: DataTypes.STRING, allowNull: false },
        passwordHash: { type: DataTypes.STRING, allowNull: true },
        firstname: { type: DataTypes.STRING, allowNull: false },
        lastname: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        role: {type: DataTypes.STRING, allowNull: true},
        hasPermission: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: true},
        datedeactivated:{  type: DataTypes.DATE, allowNull: true },
        datereactivated:{ type: DataTypes.DATE, allowNull: true },
        activestatus:{type: DataTypes.BOOLEAN, allowNull: true, defaultValue: true }
    };

    const options = {
        defaultScope: {
            // exclude password hash by default
            attributes: { exclude: ['passwordHash']}
        },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('User', attributes, options);
}