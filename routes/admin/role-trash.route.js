const express = require("express");
const router = express.Router();

const rolesTrashController = require("../../controller/admin/Role-trash.controller");
const authorization = require("../../middlewares/authorization.middleware");

router.get("/", authorization("view-role"), rolesTrashController.show);
router.get(
    "/detail/:id",
    authorization("view-role"),
    rolesTrashController.detail
);

router.patch(
    "/restore-roles/:id",
    authorization("update-role"),
    rolesTrashController.restore
);
router.patch(
    "/restore-more",
    authorization("update-role"),
    rolesTrashController.restoreMore
);

router.delete(
    "/destroy-roles/:id",
    authorization("delete-role"),
    rolesTrashController.destroy
);
router.delete(
    "/destroy-more",
    authorization("delete-role"),
    rolesTrashController.destroyMore
);

module.exports = router;
