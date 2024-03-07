const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    name: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    status: {type: DataTypes.ENUM("active", "inactive"),allowNull: false,defaultValue: "active"},
  };

  return sequelize.define("Branches", attributes);
}
