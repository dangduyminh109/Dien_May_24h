const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const validate = require("../../validates/product-category.validate");

const productCategoryController = require("../../controller/admin/Product-category.controller");

router.get("/", productCategoryController.show);
router.get("/create", productCategoryController.create);
router.get("/edit/:id", productCategoryController.edit);

router.post(
    "/create",
    upload.array("thumbnails", 1),
    validate,
    productCategoryController.createPost
);

router.patch(
    "/edit/:id",
    upload.array("thumbnails", 12),
    validate,
    productCategoryController.editPatch
);
router.patch("/update-status", productCategoryController.updateStatusPatch);
router.patch("/update-more", productCategoryController.updateMore);

router.delete("/delete-category/:id", productCategoryController.delete);
router.delete("/delete-more", productCategoryController.deleteMore);
module.exports = router;
