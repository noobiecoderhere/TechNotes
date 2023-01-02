const express = require("express");
const app = express();
const path = require("path");

const PORT = process.env.PORT || 3001;

// Set public as the default lookup for static files
app.use(express.static(path.join(__dirname, "public")));

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
