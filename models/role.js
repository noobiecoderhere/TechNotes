const { sequelize } = require("../config/sequelize");
const { DataTypes } = require("sequelize");
const {
  MANAGER_ROLE_NAME,
  ADMIN_ROLE_NAME,
  EMPLOYEE_ROLE_NAME,
} = require("../constants/role");

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      values: [MANAGER_ROLE_NAME, ADMIN_ROLE_NAME, EMPLOYEE_ROLE_NAME],
      validate: {
        isIn: [[MANAGER_ROLE_NAME, ADMIN_ROLE_NAME, EMPLOYEE_ROLE_NAME]],
      },
    },
  },
  {
    tableName: "role",
    timestamps: true,
  }
);

module.exports = Role;
