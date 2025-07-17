const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const postController = require("../../controller/admin/Post.controller");
const validate = require("../../validates/post.validate");
const authorization = require("../../middlewares/authorization.middleware");

router.get("/", authorization("view-post"), postController.show);
router.get("/create", authorization("add-post"), postController.create);
router.get("/edit/:id", authorization("update-post"), postController.edit);
router.get("/detail/:id", authorization("view-post"), postController.detail);

router.post(
    "/create",
    authorization("add-post"),
    upload.single("thumbnails"),
    validate.post,
    postController.createPost
);

router.patch(
    "/edit/:id",
    authorization("update-post"),
    upload.single("thumbnails"),
    validate.post,
    postController.editPatch
);

router.patch(
    "/update-more",
    authorization("update-post"),
    postController.updateMore
);

router.delete(
    "/delete-post/:id",
    authorization("delete-post"),
    postController.delete
);
router.delete(
    "/delete-more",
    authorization("delete-post"),
    postController.deleteMore
);

module.exports = router;
