const { nextDay } = require("date-fns");
const { QueryTypes } = require("sequelize");
const { sequelize } = require("../config/sequelize");
const Role = require("../models/role");

const getRoleIdsByRoles = async (roles) => {
  try {
    const query = `SELECT id FROM role WHERE name IN (:roles)`;
    const roleIds = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: {
        roles,
      },
    });
    return roleIds.map((roleId) => roleId.id);
  } catch (err) {
    let localErr = new Error();
    localErr.message = err.message;
    localErr.location = "getRoleIdsByRoles";
    throw localErr;
  }
};

module.exports = {
  getRoleIdsByRoles,
};
