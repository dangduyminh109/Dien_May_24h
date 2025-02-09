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

router.patch(
    "/edit/:id",
    upload.array("thumbnails", 12),
    productController.editPost
);
router.patch("/update-price", productController.updatePricePatch);
router.patch("/update-status", productController.updateStatusPatch);
router.patch("/update-more", productController.updateMore);

router.delete("/delete-product/:id", productController.delete);
router.delete("/delete-more", productController.deleteMore);
module.exports = router;
