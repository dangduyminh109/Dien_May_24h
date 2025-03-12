const express = require("express");
const router = express.Router();
const profileController = require("../../controller/admin/Profile.controller");

router.get("/", profileController.show);
module.exports = router;
