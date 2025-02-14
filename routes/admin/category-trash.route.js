const express = require("express");
const router = express.Router();

const categoryTrashController = require("../../controller/admin/Category-trash.controller");

router.get("/", categoryTrashController.show);

router.patch("/restore-category/:id", categoryTrashController.restore);
router.patch("/update-more", categoryTrashController.updateMore);
router.patch("/update-status", categoryTrashController.updateStatusPatch);
router.patch(
    "/restore-more",
    categoryTrashController.restoreMore
);

router.delete("/destroy-category/:id", categoryTrashController.destroy);
router.delete("/destroy-more", categoryTrashController.destroyMore);
module.exports = router;
