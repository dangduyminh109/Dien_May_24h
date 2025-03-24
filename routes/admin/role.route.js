const express = require("express");
const router = express.Router();

const roleController = require("../../controller/admin/Role.controller");
const validate = require("../../validates/role.validate");
const authorization = require("../../middlewares/authorization.middleware");

router.get("/", authorization("view-role"), roleController.show);
router.get("/create", authorization("add-role"), roleController.create);
router.get("/edit/:id", authorization("update-role"), roleController.edit);
router.get(
    "/permissions",
    authorization("view-permission"),
    roleController.showPermissions
);
router.get("/detail/:id", authorization("view-role"), roleController.detail);

router.post(
    "/create",
    validate,
    authorization("add-role"),
    roleController.createPost
);

router.patch(
    "/edit/:id",
    validate,
    authorization("update-role"),
    roleController.editPatch
);
router.patch(
    "/permissions/update",
    authorization("update-permission"),
    roleController.permissionUpdate
);

router.delete(
    "/delete-roles/:id",
    authorization("delete-role"),
    roleController.delete
);
router.delete(
    "/delete-more",
    authorization("delete-role"),
    roleController.deleteMore
);

module.exports = router;
