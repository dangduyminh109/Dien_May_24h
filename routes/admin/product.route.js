const express = require("express");
const router = express.Router();

const productController = require("../../controller/admin/Product.controller");

router.get("/", productController.show);
router.get("/create", productController.create);

module.exports = router;


