const express = require("express");
const router = express.Router();

const userTrashController = require("../../controller/admin/User-trash.controller");
const authorization = require("../../middlewares/authorization.middleware");

router.get("/", authorization("view-user"), userTrashController.show);
router.get(
    "/detail/:id",
    authorization("view-user"),
    userTrashController.detail
);

router.patch(
    "/restore-user/:id",
    authorization("update-user"),
    userTrashController.restore
);
router.patch(
    "/update-more",
    authorization("update-user"),
    userTrashController.updateMore
);
router.patch(
    "/update-status",
    authorization("update-user"),
    userTrashController.updateStatusPatch
);
router.patch(
    "/restore-more",

    authorization("update-user"),
    userTrashController.restoreMore
);

router.delete(
    "/destroy-user/:id",
    authorization("delete-user"),
    userTrashController.destroy
);
router.delete(
    "/destroy-more",
    authorization("delete-user"),
    userTrashController.destroyMore
);
module.exports = router;
