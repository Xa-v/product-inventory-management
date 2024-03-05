const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  };

  const options = {};

  return sequelize.define("OldPassword", attributes, options);
}