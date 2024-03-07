const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const UserAssignedBranch = sequelize.define("UserAssignedBranch", {
    userId: { type: DataTypes.INTEGER,allowNull: false,},
    username: { type: DataTypes.STRING,allowNull: false,},
    branchId: { type: DataTypes.INTEGER,allowNull: false,},
    branchName: { type: DataTypes.STRING,allowNull: false,},
    assignmentDate: {type: DataTypes.DATE,allowNull: false, defaultValue: DataTypes.NOW,},
  });

  return UserAssignedBranch;
}
