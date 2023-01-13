const User = require("../models/user");
const {
  SUCCESS,
  BAD_REQUEST,
  CONFLICT,
} = require("../constants/http-status-codes");
const { isValidCreateUserReq } = require("../utils/validators/user");
const bcrypt = require("bcrypt");
const { sequelize } = require("../config/sequelize");
const roleController = require("./role");
const UserRole = require("../models/user-role");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "active"],
    });
    if (!users?.length) {
      return res.status(SUCCESS).json({
        users: [],
      });
    }
    res.status(SUCCESS).json({
      users,
    });
  } catch (err) {
    next(err);
  }
};

const createNewUser = async (req, res, next) => {
  let createUserTranscation = await sequelize.transaction();
  try {
    const { username, password, roles } = req.body;
    // Validation
    if (!isValidCreateUserReq(username, password, roles)) {
      return res.status(BAD_REQUEST).json({
        message: "All fields are required !",
      });
    }

    // Duplicate user
    const duplicateUser = await User.findOne({
      attributes: ["id"],
      where: { username },
    });
    if (duplicateUser?.id) {
      return res.status(CONFLICT).json({
        message: "Username already exists !",
      });
    }

    // Encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10); // 10 rounds of salting

    // Get coressponding role IDs
    const roleIds = await roleController.getRoleIdsByRoles(roles, {
      transaction: createUserTranscation,
    });

    const userObj = { username, password: hashedPwd, active: true };

    const newUser = await User.create(userObj, {
      transaction: createUserTranscation,
    });
    if (!newUser) {
      await createUserTranscation.rollback();
      return res.status(BAD_REQUEST).json({
        message: "Invalid user data  reciever",
      });
    }
    // For each role ID, create a new user role object to insert into user role table
    let userRoles = [];
    roleIds?.forEach((roleId) => {
      userRoles.push({
        user_id: newUser.id,
        role_id: roleId,
        active: true,
      });
    });
    await UserRole.bulkCreate(userRoles, {
      transaction: createUserTranscation,
    });
    await createUserTranscation.commit();
    res.status(SUCCESS).json({ userId: newUser.id });
  } catch (err) {
    await createUserTranscation.rollback();
    let localErr = new Error();
    localErr.message = err.message;
    localErr.location = "createNewUser";
    next(localErr);
  }
};

const updateUser = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
