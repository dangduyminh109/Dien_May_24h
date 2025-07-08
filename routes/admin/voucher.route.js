const express = require("express");
const router = express.Router();
const voucherController = require("../../controller/admin/Voucher.controller");
const validate = require("../../validates/voucher.validate");
const authorization = require("../../middlewares/authorization.middleware");

router.get("/", authorization("view-voucher"), voucherController.show);
router.get("/create", authorization("add-voucher"), voucherController.create);
router.get(
    "/edit/:id",
    authorization("update-voucher"),
    voucherController.edit
);
router.get(
    "/detail/:id",
    authorization("view-voucher"),
    voucherController.detail
);

router.post(
    "/create",
    authorization("add-voucher"),
    validate,
    voucherController.createPost
);

router.patch("/edit/:id", validate, voucherController.editPatch);

router.patch(
    "/quick-update",
    authorization("update-voucher"),
    voucherController.quickUpdate
);

router.patch(
    "/update-status",
    authorization("update-voucher"),
    voucherController.updateStatusPatch
);

router.patch(
    "/update-more",
    authorization("update-voucher"),
    voucherController.updateMore
);

router.delete(
    "/delete-voucher/:id",
    authorization("delete-voucher"),
    voucherController.delete
);
router.delete(
    "/delete-more",
    authorization("delete-voucher"),
    voucherController.deleteMore
);

module.exports = router;
