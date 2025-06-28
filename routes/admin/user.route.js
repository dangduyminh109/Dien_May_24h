const express = require("express");
const router = express.Router();
const userController = require("../../controller/admin/User.controller");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const validate = require("../../validates/userAdmin.validate");
const authorization = require("../../middlewares/authorization.middleware");

router.get("/", authorization("view-user"), userController.show);

router.get("/edit/:id", authorization("update-user"), userController.edit);

router.get("/detail/:id", authorization("view-user"), userController.detail);

router.patch(
    "/edit/:id",
    authorization("update-user"),
    upload.single("thumbnails"),
    validate,
    userController.editPatch
);
router.patch(
    "/update-status",
    authorization("update-user"),
    userController.updateStatusPatch
);
router.patch(
    "/update-more",
    authorization("update-user"),
    userController.updateMore
);

router.delete(
    "/delete-user/:id",
    authorization("delete-user"),
    userController.delete
);
router.delete(
    "/delete-more",
    authorization("delete-user"),
    userController.deleteMore
);

module.exports = router;
