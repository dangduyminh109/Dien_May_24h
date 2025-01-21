const express = require("express");
const router = express.Router();

const HomeController = require("../../controller/client/Home.controller");

router.get("/", HomeController.show);

module.exports = router;


