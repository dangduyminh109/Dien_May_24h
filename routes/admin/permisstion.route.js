const express = require("express");
const router = express.Router();

const roleController = require("../../controller/admin/Role.controller");

router.get("/", roleController.show);

module.exports = router;
