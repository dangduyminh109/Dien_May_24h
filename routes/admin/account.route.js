const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const accountController = require("../../controller/admin/Account.controller");
const validate = require("../../validates/account.validate");
const authorization = require("../../middlewares/authorization.middleware");

router.get(
    "/",
    authorization("view-account"),
    accountController.show
);
router.get(
    "/create",
    authorization("add-account"),
    accountController.create
);
router.get(
    "/edit/:id",
    authorization("update-account"),
    accountController.edit
);

router.post(
    "/create",
    authorization("add-account"),
    upload.single("thumbnails"),
    validate,
    accountController.createPost
);

router.patch(
    "/edit/:id",
    authorization("update-account"),
    upload.single("thumbnails"),
    validate,
    accountController.editPatch
);
router.patch(
    "/update-status",
    authorization("update-account"),
    accountController.updateStatusPatch
);
router.patch(
    "/update-more",
    authorization("update-account"),
    accountController.updateMore
);

router.delete(
    "/delete-account/:id",
    authorization("delete-account"),
    accountController.delete
);
router.delete(
    "/delete-more",
    authorization("delete-account"),
    accountController.deleteMore
);

module.exports = router;
