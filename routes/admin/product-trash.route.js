const express = require("express");
const router = express.Router();

const productTrashController = require("../../controller/admin/Product-trash.controller");
const authorization = require("../../middlewares/authorization.middleware");

router.get("/", authorization("view-product"), productTrashController.show);
router.get(
    "/detail/:id",
    authorization("view-product"),
    productTrashController.detail
);

router.patch(
    "/restore-product/:id",
    authorization("update-product"),
    productTrashController.restore
);
router.patch(
    "/update-more",
    authorization("update-product"),
    productTrashController.updateMore
);
router.patch(
    "/update-price",
    authorization("update-product"),
    productTrashController.updatePricePatch
);
router.patch(
    "/update-status",
    authorization("update-product"),
    productTrashController.updateStatusPatch
);
router.patch(
    "/update-featured",
    authorization("update-product"),
    productTrashController.updateFeaturedPatch
);
router.patch(
    "/restore-more",
    authorization("update-product"),
    productTrashController.restoreMore
);

router.delete(
    "/destroy-product/:id",
    authorization("delete-product"),
    productTrashController.destroy
);
router.delete(
    "/destroy-more",
    authorization("delete-product"),
    productTrashController.destroyMore
);
module.exports = router;
