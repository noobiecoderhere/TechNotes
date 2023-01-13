const userRouter = require("./user");

const mainRouter = (app) => {
  app.use("/users", userRouter);
};

module.exports = mainRouter;
