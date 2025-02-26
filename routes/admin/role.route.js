const express = require("express");
const router = express.Router();

const roleController = require("../../controller/admin/Role.controller");
const validate = require("../../validates/role.validate");

router.get("/", roleController.show);
router.get("/create", roleController.create);
router.get("/edit/:id", roleController.edit);
router.get("/permissions", roleController.showPermissions);

router.post("/create", validate, roleController.createPost);

router.patch("/edit/:id", validate, roleController.editPatch);

router.delete("/delete-roles/:id", roleController.delete);
router.delete("/delete-more", roleController.deleteMore);

module.exports = router;
