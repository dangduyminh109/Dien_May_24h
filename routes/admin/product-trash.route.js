const express = require("express");
const router = express.Router();

const productTrashController = require("../../controller/admin/Product-trash.controller");

router.get("/", productTrashController.show);

router.patch("/restore-product/:id", productTrashController.restore);
router.patch("/update-more", productTrashController.updateMore);
router.patch(
    "/restore-more",
    productTrashController.restoreMore
);

router.delete("/destroy-product/:id", productTrashController.destroy);
router.delete("/destroy-more", productTrashController.destroyMore);
module.exports = router;
