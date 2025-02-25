const express = require("express");
const router = express.Router();

const rolesTrashController = require("../../controller/admin/Role-trash.controller");

router.get("/", rolesTrashController.show);

router.patch("/restore-roles/:id", rolesTrashController.restore);
router.patch("/restore-more", rolesTrashController.restoreMore);

router.delete("/destroy-roles/:id", rolesTrashController.destroy);
router.delete("/destroy-more", rolesTrashController.destroyMore);

module.exports = router;
