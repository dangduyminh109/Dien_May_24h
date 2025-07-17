const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadController = require("../../controller/admin/Upload.controller");

router.post("/image", upload.single("file"), uploadController.uploadImage);

module.exports = router;
