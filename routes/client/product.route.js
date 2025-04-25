const express = require("express");
const router = express.Router();

const productController = require("../../controller/client/Product.controller");

router.get("/", productController.show);

router.get("/suggest", productController.suggest);

router.get("/:slug", productController.show);

router.get("/detail/:slug", productController.detail);

module.exports = router;
