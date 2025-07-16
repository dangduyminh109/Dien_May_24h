const express = require("express");
const router = express.Router();

const categoryTrashController = require("../../controller/admin/Post-category-trash.controller");
const authorization = require("../../middlewares/authorization.middleware");

router.get("/", authorization("view-category"), categoryTrashController.show);
router.get(
    "/detail/:id",
    authorization("view-category"),
    categoryTrashController.detail
);
router.patch(
    "/restore-category/:id",
    authorization("update-category"),
    categoryTrashController.restore
);
router.patch(
    "/update-more",
    authorization("update-category"),
    categoryTrashController.updateMore
);
router.patch(
    "/update-status",
    authorization("update-category"),
    categoryTrashController.updateStatusPatch
);
router.patch(
    "/restore-more",
    authorization("update-category"),
    categoryTrashController.restoreMore
);

router.delete(
    "/destroy-category/:id",
    authorization("delete-category"),
    categoryTrashController.destroy
);
router.delete(
    "/destroy-more",
    authorization("delete-category"),
    categoryTrashController.destroyMore
);
module.exports = router;
