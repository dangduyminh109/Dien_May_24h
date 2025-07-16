const express = require("express");
const router = express.Router();
const validate = require("../../validates/post-category.validate");

const postCategoryController = require("../../controller/admin/Post-category.controller");
const authorization = require("../../middlewares/authorization.middleware");

router.get(
    "/",
    authorization("view-post-category"),
    postCategoryController.show
);
router.get(
    "/create",
    authorization("add-post-category"),
    postCategoryController.create
);
router.get(
    "/edit/:id",
    authorization("update-post-category"),
    postCategoryController.edit
);
router.get(
    "/detail/:id",
    authorization("view-post-category"),
    postCategoryController.detail
);

router.post(
    "/create",
    authorization("add-post-category"),
    validate,
    postCategoryController.createPost
);

router.patch(
    "/edit/:id",
    authorization("update-post-category"),
    validate,
    postCategoryController.editPatch
);
router.patch(
    "/update-status",
    authorization("update-post-category"),
    postCategoryController.updateStatusPatch
);
router.patch(
    "/update-more",
    authorization("update-post-category"),
    postCategoryController.updateMore
);

router.delete(
    "/delete-post-category/:id",
    authorization("delete-post-category"),
    postCategoryController.delete
);
router.delete(
    "/delete-more",
    authorization("delete-post-category"),
    postCategoryController.deleteMore
);
module.exports = router;
