const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const accountController = require("../../controller/admin/Account.controller");
const validate = require("../../validates/account.validate");

router.get("/", accountController.show);
router.get("/create", accountController.create);
router.get("/edit/:id", accountController.edit);

router.post(
    "/create",
    upload.single("thumbnails"),
    validate,
    accountController.createPost
);

router.patch(
    "/edit/:id",
    upload.single("thumbnails"),
    validate,
    accountController.editPatch
);
router.patch("/update-status", accountController.updateStatusPatch);
router.patch("/update-more", accountController.updateMore);

router.delete("/delete-account/:id", accountController.delete);
router.delete("/delete-more", accountController.deleteMore);

module.exports = router;
