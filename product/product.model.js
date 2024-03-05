const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {      
        productname: { type: DataTypes.STRING, allowNull: false },
        price: { type: DataTypes.INTEGER, allowNull: false },
        productcategory:{type: DataTypes.STRING, allowNull: false} ,
    
    };

const options = {
    defaultScope: {},
    scopes: {},
};

    return sequelize.define('Product', attributes, options);
}