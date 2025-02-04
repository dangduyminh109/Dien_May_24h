const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = require("../../helpers/multer.helper")
const upload = multer({ storage });

const productController = require("../../controller/admin/Product.controller");

router.get("/", productController.show);
router.get("/create", productController.create);
router.post(
    "/create",
    upload.array("thumbnail", 12),
    productController.createPost
);

module.exports = router;


