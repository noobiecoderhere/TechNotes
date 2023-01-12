require("dotenv").config();
const { Sequelize } = require("sequelize");
const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  MAX_OPEN_CONNECTIONS,
  MIN_OPEN_CONNECTIONS,
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: "localhost",
  dialect: "postgres",
  pool: {
    max: parseInt(MAX_OPEN_CONNECTIONS),
    min: parseInt(MIN_OPEN_CONNECTIONS),
    acquire: 30000, // max time (in ms) that pool will try to get a connection before throwing error
    idle: 10000, // max time (in ms) after which an idle (unused) connection is removed from a pool
  },
});

const authenticate = async () => {
  try {
    await sequelize.authenticate();
    console.log("Successfully connected to postgres through sequelize");
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  sequelize,
  authenticate,
};
