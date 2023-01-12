const { sequelize } = require("../config/sequelize");
const { DataTypes, Sequelize } = require("sequelize");
const Note = require("./note");
const Role = require("./role");
const UserRole = require("./user-role");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "user",
    timestamps: true,
  }
);

User.hasMany(Note);
User.hasMany(UserRole);
User.belongsToMany(Role);
module.exports = User;
