const express = require("express");
const router = express.Router();

const voucherTrashController = require("../../controller/admin/Voucher-trash.controller");
const authorization = require("../../middlewares/authorization.middleware");

router.get("/", authorization("view-voucher"), voucherTrashController.show);
router.get(
    "/detail/:id",
    authorization("view-voucher"),
    voucherTrashController.detail
);

router.patch(
    "/restore-voucher/:id",
    authorization("update-voucher"),
    voucherTrashController.restore
);

router.patch(
    "/update-more",
    authorization("update-voucher"),
    voucherTrashController.updateMore
);

router.patch(
    "/update-status",
    authorization("update-voucher"),
    voucherTrashController.updateStatusPatch
);

router.patch(
    "/restore-more",
    authorization("update-voucher"),
    voucherTrashController.restoreMore
);

router.delete(
    "/destroy-voucher/:id",
    authorization("delete-voucher"),
    voucherTrashController.destroy
);
router.delete(
    "/destroy-more",
    authorization("delete-voucher"),
    voucherTrashController.destroyMore
);
module.exports = router;
