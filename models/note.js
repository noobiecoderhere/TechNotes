const { sequelize } = require("../config/sequelize");
const { DataTypes } = require("sequelize");
const User = require("./user");

const Note = sequelize.define(
  "Note",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "note",
    timestamps: true,
  }
);

Note.belongsTo(User, {
  foreignKey: "assigned_user_id",
});

module.exports = Note;
