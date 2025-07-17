const express = require("express");
const router = express.Router();

const postTrashController = require("../../controller/admin/Post-trash.controller");
const authorization = require("../../middlewares/authorization.middleware");

router.get("/", authorization("view-post"), postTrashController.show);
router.get(
    "/detail/:id",
    authorization("view-post"),
    postTrashController.detail
);

router.patch(
    "/restore-post/:id",
    authorization("update-post"),
    postTrashController.restore
);
router.patch(
    "/update-more",
    authorization("update-post"),
    postTrashController.updateMore
);

router.patch(
    "/restore-more",

    authorization("update-post"),
    postTrashController.restoreMore
);

router.delete(
    "/destroy-post/:id",
    authorization("delete-post"),
    postTrashController.destroy
);
router.delete(
    "/destroy-more",
    authorization("delete-post"),
    postTrashController.destroyMore
);
module.exports = router;
