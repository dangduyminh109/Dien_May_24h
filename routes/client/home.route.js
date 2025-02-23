const express = require("express");
const router = express.Router();

const HomeController = require("../../controller/client/Home.controller");

router.get("/", HomeController.show);
router.get("/category/:slug", HomeController.showProductByCategory);

module.exports = router;


