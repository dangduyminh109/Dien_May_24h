const express = require("express");
const router = express.Router();

const accountTrashController = require("../../controller/admin/Account-trash.controller");

router.get("/", accountTrashController.show);

router.patch("/restore-account/:id", accountTrashController.restore);
router.patch("/update-more", accountTrashController.updateMore);
router.patch("/update-status", accountTrashController.updateStatusPatch);
router.patch(
    "/restore-more",
    accountTrashController.restoreMore
);

router.delete("/destroy-account/:id", accountTrashController.destroy);
router.delete("/destroy-more", accountTrashController.destroyMore);
module.exports = router;
