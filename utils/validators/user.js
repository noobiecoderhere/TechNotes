const isValidCreateUserReq = (username, password, roles) => {
  if (!username?.length) return false;
  if (!password?.length) return false;
  if (!roles?.length) return false;
  if (!Array.isArray(roles)) return false;
  return true;
};

module.exports = {
  isValidCreateUserReq,
};
