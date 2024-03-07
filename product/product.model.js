const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {      
        productname: { type: DataTypes.STRING, allowNull: false },
        price: { type: DataTypes.INTEGER, allowNull: false },
        productcategory:{type: DataTypes.STRING, allowNull: false} ,
        stockavailable:{ type:DataTypes.INTEGER, allowNull:false,defaultValue: 0}
    
    };

const options = {
    defaultScope: {},
    scopes: {},
};

    return sequelize.define('Product', attributes, options);
}