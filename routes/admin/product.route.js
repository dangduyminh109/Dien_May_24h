const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const productController = require("../../controller/admin/Product.controller");
const validate = require("../../validates/product.validate");
const authorization = require("../../middlewares/authorization.middleware");

router.get("/", authorization("view-product"), productController.show);
router.get("/create", authorization("add-product"), productController.create);
router.get(
    "/edit/:id",
    authorization("update-product"),
    productController.edit
);
router.get(
    "/detail/:id",
    authorization("view-product"),
    productController.detail
);

router.post(
    "/create",
    authorization("add-product"),
    upload.array("thumbnails", 12),
    validate,
    productController.createPost
);

router.patch(
    "/edit/:id",
    authorization("update-product"),
    upload.array("thumbnails", 12),
    validate,
    productController.editPost
);
router.patch(
    "/update-price",
    authorization("update-product"),
    productController.updatePricePatch
);
router.patch(
    "/update-status",
    authorization("update-product"),
    productController.updateStatusPatch
);
router.patch(
    "/update-featured",
    authorization("update-product"),
    productController.updateFeaturedPatch
);
router.patch(
    "/update-more",
    authorization("update-product"),
    productController.updateMore
);

router.delete(
    "/delete-product/:id",
    authorization("delete-product"),
    productController.delete
);
router.delete(
    "/delete-more",
    authorization("delete-product"),
    productController.deleteMore
);

module.exports = router;
