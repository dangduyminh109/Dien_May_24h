const express = require("express");
const router = express.Router();

const productController = require("../../controller/client/Product.controller");

router.get("/", productController.show);

module.exports = router;


