const express = require("express");
const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    res.send("Users List");
  })
  .post()
  .patch()
  .delete();

module.exports = router;
