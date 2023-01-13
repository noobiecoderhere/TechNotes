const { sequelize } = require("../config/sequelize");
const { DataTypes, Sequelize } = require("sequelize");
const User = require("./user");
const Role = require("./role");

const UserRole = sequelize.define(
  "UserRole",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    role_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Role,
        key: "id",
      },
      defaultValue: 3, // Employee role by default
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "user_role_map",
    timestamps: true,
  }
);
User.hasMany(UserRole, { foreignKey: "user_id" });
UserRole.belongsTo(User, { foreignKey: "user_id" });

Role.hasMany(UserRole, { foreignKey: "role_id" });
UserRole.belongsTo(Role, { foreignKey: "role_id" });

module.exports = UserRole;
