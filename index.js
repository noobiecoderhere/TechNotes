require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/cors-options");
const sequelizeConfig = require("./config/sequelize");
const mainRouter = require("./routes/root-router");
const PORT = process.env.PORT || 3001;

// logger middleware
app.use(logger);

// Apply CORS policies
app.use(cors());

// Parse JSON inputs from payload
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// Set public as the default lookup for static files
app.use(express.static(path.join(__dirname, "public")));

// Check connection to database
sequelizeConfig.authenticate();

// Routing
mainRouter(app);

// Custom error handler
app.use(errorHandler);

// Render 404 page response as per request
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Page Not Found" });
  } else {
    res.type("txt").send("404 Page Not Found");
  }
});

app.listen(PORT, () => {
  console.log(`Express server running on port: ${PORT}`);
});
