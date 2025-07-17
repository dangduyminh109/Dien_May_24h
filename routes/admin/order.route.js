const express = require("express");
const router = express.Router();
const orderController = require("../../controller/admin/Order.controller");
const validate = require("../../validates/order.validate");
const authorization = require("../../middlewares/authorization.middleware");

router.get("/", authorization("view-order"), orderController.show);
router.get("/edit/:id", authorization("update-order"), orderController.edit);
router.get("/detail/:id", authorization("view-order"), orderController.detail);

router.patch("/edit/:id", orderController.editPatch);
router.patch(
    "/update-status",
    authorization("update-order"),
    orderController.updateStatusPatch
);

router.patch(
    "/update-more",
    authorization("update-order"),
    orderController.updateMore
);

router.delete(
    "/delete-order/:id",
    authorization("delete-order"),
    orderController.delete
);
router.delete(
    "/delete-more",
    authorization("delete-order"),
    orderController.deleteMore
);

module.exports = router;
