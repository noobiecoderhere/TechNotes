const {
  MANAGER_ROLE_NAME,
  EMPLOYEE_ROLE_NAME,
  ADMIN_ROLE_NAME,
} = require("../../constants/role-constants");

const isValidCreateUserReq = (username, password, roles) => {
  if (!username?.length) return false;
  if (!password?.length) return false;
  if (!roles?.length) return false;
  if (!Array.isArray(roles)) return false;
  const allowedRoles = [MANAGER_ROLE_NAME, EMPLOYEE_ROLE_NAME, ADMIN_ROLE_NAME];
  for (const role of roles) {
    if (!allowedRoles.includes(role)) {
      return false;
    }
  }
  return true;
};

module.exports = {
  isValidCreateUserReq,
};
