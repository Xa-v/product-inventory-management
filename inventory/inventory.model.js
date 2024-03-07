const {DataTypes} = require("sequelize");

module.exports = model;

function model(sequelize) {
  // Define the attributes of the Inventory model
  const attributes = {
    productID: {type: DataTypes.INTEGER, allowNull: false},
    stockIn: {type: DataTypes.INTEGER, allowNull: false}, 
    stockOut: {type: DataTypes.INTEGER, allowNull: false},
    productName: {type: DataTypes.STRING, allowNull: false},
  };

  // Additional options for the model
  const options = {};

  // Define and return the Inventory model
  return sequelize.define("Inventory", attributes, options);
}
