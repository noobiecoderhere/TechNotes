const allowedOrigins = require("../constants/cors-constants");
const HTTP_STATUS_CODES = require("../constants/http-status-codes");

const corsOptions = {
  origin: (origin, callback) => {
    // If whitelisted or from resources like postman
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Blocked by CORS policy"));
    }
  },
  optionsSuccessStatus: HTTP_STATUS_CODES.SUCCESS,
  credentials: true,
};

module.exports = corsOptions;
