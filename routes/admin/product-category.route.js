const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const productCategoryController = require("../../controller/admin/Product-category.controller");

router.get("/", productCategoryController.show);
router.get("/create", productCategoryController.create);
router.get("/edit/:id", productCategoryController.edit);

router.post(
    "/create",
    upload.array("thumbnails", 1),
    productCategoryController.createPost
);

router.patch(
    "/edit/:id",
    upload.array("thumbnails", 12),
    productCategoryController.editPatch
);
router.patch("/update-status", productCategoryController.updateStatusPatch);
router.patch("/update-more", productCategoryController.updateMore);

router.delete("/delete-category/:id", productCategoryController.delete);
router.delete("/delete-more", productCategoryController.deleteMore);
module.exports = router;
