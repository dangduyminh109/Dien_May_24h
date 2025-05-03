const express = require("express");
const router = express.Router();
const UserController = require("../../controller/client/User.controller");

router.get("/profile", UserController.show);

module.exports = router;
