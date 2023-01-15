const userRouter = require("./user-router");

const mainRouter = (app) => {
  app.use("/users", userRouter);
};

module.exports = mainRouter;
