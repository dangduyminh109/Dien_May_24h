const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = require("../../helpers/multer.helper");
const upload = multer({ storage });

const productController = require("../../controller/admin/Product.controller");

router.get("/", productController.show);
router.get("/create", productController.create);
router.get("/edit/:id", productController.edit);

router.post(
    "/create",
    upload.array("thumbnails", 12),
    productController.createPost
);
router.post(
    "/edit/:id",
    upload.array("thumbnails", 12),
    productController.editPost
);
router.post("/update-price", productController.updatePricePost);
router.post("/update-status", productController.updateStatusPost);
module.exports = router;
