const express = require("express");
const router = express.Router();
const UserController = require("../../controller/client/User.controller");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/profile", UserController.show);

router.get("/edit-profile", UserController.edit);

router.get("/orders", UserController.orders);

router.post("/edit-profile", upload.single("avatar"), UserController.editPost);

module.exports = router;
