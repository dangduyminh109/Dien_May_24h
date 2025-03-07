const express = require("express");
const router = express.Router();

const accountTrashController = require("../../controller/admin/Account-trash.controller");
const authorization = require("../../middlewares/authorization.middleware");

router.get("/", authorization("view-account"), accountTrashController.show);

router.patch(
    "/restore-account/:id",
    authorization("update-account"),
    accountTrashController.restore
);
router.patch(
    "/update-more",
    authorization("update-account"),
    accountTrashController.updateMore
);
router.patch(
    "/update-status",
    authorization("update-account"),
    accountTrashController.updateStatusPatch
);
router.patch(
    "/restore-more",

    authorization("update-account"),
    accountTrashController.restoreMore
);

router.delete(
    "/destroy-account/:id",
    authorization("delete-account"),
    accountTrashController.destroy
);
router.delete(
    "/destroy-more",
    authorization("delete-account"),
    accountTrashController.destroyMore
);
module.exports = router;
