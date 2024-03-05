const {DataTypes} = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    productname: {type: DataTypes.STRING, allowNull: false},
    quantity: {type: DataTypes.INTEGER, allowNull: false},
  
    customername: {type: DataTypes.STRING, allowNull: false},
    orderStatus: {type: DataTypes.INTEGER, allowNull: false},
  };

  const options = {};

  return sequelize.define("Orders", attributes, options);
}