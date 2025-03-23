const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const validate = require("../../validates/product-category.validate");

const productCategoryController = require("../../controller/admin/Product-category.controller");
const authorization = require("../../middlewares/authorization.middleware");

router.get("/", authorization("view-category"), productCategoryController.show);
router.get(
    "/create",
    authorization("add-category"),
    productCategoryController.create
);
router.get(
    "/edit/:id",
    authorization("update-category"),
    productCategoryController.edit
);
router.get(
    "/detail/:id",
    authorization("view-category"),
    productCategoryController.detail
);

router.post(
    "/create",
    authorization("add-category"),
    upload.array("thumbnails", 1),
    validate,
    productCategoryController.createPost
);

router.patch(
    "/edit/:id",
    authorization("update-category"),
    upload.array("thumbnails", 12),
    validate,
    productCategoryController.editPatch
);
router.patch(
    "/update-status",
    authorization("update-category"),
    productCategoryController.updateStatusPatch
);
router.patch(
    "/update-more",
    authorization("update-category"),
    productCategoryController.updateMore
);

router.delete(
    "/delete-category/:id",
    authorization("delete-category"),
    productCategoryController.delete
);
router.delete(
    "/delete-more",
    authorization("delete-category"),
    productCategoryController.deleteMore
);
module.exports = router;
