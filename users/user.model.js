const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {      
        passwordHash: { type: DataTypes.STRING, allowNull: false },
        userName: { type: DataTypes.STRING, allowNull: false },
        datedeactivated:{  type: DataTypes.DATE, allowNull: true },
        datereactivated:{ type: DataTypes.DATE, allowNull: true },
        isactive:{type: DataTypes.STRING, allowNull: true }
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