const {DataTypes} = require("sequelize");

module.exports = model;


function model(sequelize) {
  const attributes = {
    adminId: {type: DataTypes.INTEGER, allowNull: false},
    userId: {type: DataTypes.INTEGER, allowNull: false},
    Field: {type: DataTypes.STRING, allowNull: false},
    value: {type: DataTypes.STRING, allowNull: false},
    updatedAt: {type: DataTypes.DATE, allowNull: false},
  };

  const options = {};

  return sequelize.define("Updated", attributes, options);
}
