const { logEvent } = require("./logger");
const { SERVER_ERROR } = require("../constants/http-status-codes");
const errorHandler = (err, req, res, next) => {
  logEvent(
    `${err.name} ${err.message} ${req.method} ${req.originalUrl} ${req.headers.origin}`,
    "error.log"
  );

  const statusCode = res.statusCode ?? SERVER_ERROR;

  res.status(statusCode).json({
    message: err.message,
  });
};

module.exports = errorHandler;
