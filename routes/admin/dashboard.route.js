const express = require("express");
const router = express.Router();

const dashboardController = require("../../controller/admin/Dashboard.controller");

router.get("/", dashboardController.show);

module.exports = router;


