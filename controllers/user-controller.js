const User = require("../models/user");
const {
  SUCCESS,
  BAD_REQUEST,
  CONFLICT,
} = require("../constants/http-status-codes");
const { isValidCreateUserReq } = require("../utils/validators/user-validator");
const bcrypt = require("bcrypt");
const { sequelize } = require("../config/sequelize");
const roleController = require("./role-controller");
const UserRole = require("../models/user-role");
const Note = require("../models/note");
const { QueryTypes } = require("sequelize");

const getAllUsers = async (req, res, next) => {
  try {
    const query = `SELECT u.id, u.username, u.active, array_agg(r.name) as roles
    FROM public.user u
    INNER JOIN user_role_map urm ON u.id = urm.user_id
    INNER JOIN role r ON r.id = urm.role_id
    GROUP BY u.id, u.username
    `;
    const users = await sequelize.query(query, {
      type: QueryTypes.SELECT,
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
  // Update username, active, roles via single request
  try {
    const { id, username, active, roles } = req.body;
    // Request Validation
    if (
      !id ||
      !username ||
      typeof active !== "boolean" ||
      !Array.isArray(roles)
    ) {
      return res.status(BAD_REQUEST).json({
        message: "All fields are required",
      });
    }
    // Checking if user exists
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(BAD_REQUEST).json({
        message: "User not found",
      });
    }

    // Check if username already exists with another user
    const duplicateUser = await User.findOne({
      attributes: ["id"],
      where: { username },
    });
    if (duplicateUser?.id !== id) {
      return res.status(CONFLICT).json({
        message: "Username already exists ! Please choose a different one",
      });
    }

    await User.update({ username, roles, active }, { where: { id: user.id } });
    res.status(SUCCESS).json({
      message: "User updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.body;
    // Request validation
    if (!id) {
      return res.status(BAD_REQUEST).json({
        message: "User ID is required",
      });
    }
    // Check if user exists
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(BAD_REQUEST).json({
        message: "User not found",
      });
    }

    // Disallow deletion if any note is assigned
    const assignedNote = await Note.findOne({
      where: { assigned_user_id: id },
    });

    if (assignedNote) {
      return res.status(BAD_REQUEST).json({
        message: "User has assigned notes",
      });
    }

    // Delete logic
    await user.destroy();

    res.status(SUCCESS).json({
      message: `User with ID ${id} deleted successfully`,
    });
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
