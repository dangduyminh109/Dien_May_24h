const express = require("express");
const router = express.Router();

const orderTrashController = require("../../controller/admin/Order-trash.controller");
const authorization = require("../../middlewares/authorization.middleware");

router.get("/", authorization("view-order"), orderTrashController.show);
router.get(
    "/detail/:id",
    authorization("view-order"),
    orderTrashController.detail
);

router.patch(
    "/restore-order/:id",
    authorization("update-order"),
    orderTrashController.restore
);

router.patch(
    "/update-more",
    authorization("update-order"),
    orderTrashController.updateMore
);

router.patch(
    "/update-status",
    authorization("update-order"),
    orderTrashController.updateStatusPatch
);

router.patch(
    "/restore-more",
    authorization("update-order"),
    orderTrashController.restoreMore
);

router.delete(
    "/destroy-order/:id",
    authorization("delete-order"),
    orderTrashController.destroy
);
router.delete(
    "/destroy-more",
    authorization("delete-order"),
    orderTrashController.destroyMore
);
module.exports = router;
