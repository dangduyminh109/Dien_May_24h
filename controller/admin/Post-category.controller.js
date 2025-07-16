const system = require("../../config/system.js");
const PostCategory = require("../../models/post-category.model.js");
const {
    filterAndSort,
    generalHelper,
    handleForm,
} = require("../../helpers/post-category.helper.js");
const paginationHelper = require("../../helpers/pagination.helper.js");
const getCategoryTree = require("../../helpers/get-category-tree.helper.js");

class postCategoryController {
    // [GET] /admin/post-category
    async show(req, res) {
        const currentPath = paginationHelper(req);
        const { listPostCategory, pagination } = await filterAndSort(req);
        const handleData = req.session.backData || {};
        const general = await generalHelper();
        const categoryTree = await getCategoryTree(PostCategory);
        res.render("./admin/page/post-category", {
            pageTitle: "Post-category",
            PATH_ADMIN: system.PATH_ADMIN,
            listPostCategory,
            general,
            filter: req.query,
            handle: handleData.formData,
            pagination,
            currentPath,
            categoryTree,
        });
    }

    // [GET] /admin/post-category/create
    async create(req, res) {
        const categoryTree = await getCategoryTree(PostCategory);
        res.render("./admin/page/post-category/create", {
            pageTitle: "Create post-category",
            PATH_ADMIN: system.PATH_ADMIN,
            categoryTree,
        });
    }

    // [GET] /admin/posts/edit/:id
    async edit(req, res) {
        const postCategory = await PostCategory.findOne({
            _id: req.params.id,
        });
        const categoryTree = await getCategoryTree(PostCategory);
        res.render("./admin/page/post-category/edit", {
            pageTitle: "Edit Post Category",
            PATH_ADMIN: system.PATH_ADMIN,
            postCategory,
            categoryTree,
        });
    }

    // [GET] /admin/post-category/detail:id
    async detail(req, res) {
        const postCategory = await PostCategory.findOne({
            _id: req.params.id,
        });
        var parentCategory = "";
        if (postCategory.parentId != "") {
            parentCategory = await PostCategory.findOne({
                _id: postCategory.parentId,
            });
        }
        res.render("./admin/page/post-category/detail", {
            pageTitle: "Post category detail",
            PATH_ADMIN: system.PATH_ADMIN,
            postCategory,
            parentCategory:
                parentCategory != ""
                    ? parentCategory.name
                    : "Không có danh mục cha",
        });
    }

    // [POST] /admin/post-category/create
    async createPost(req, res) {
        try {
            const formData = await handleForm(req);
            const newPostCategory = new PostCategory(formData);
            await newPostCategory.save();
            req.flash("success", "Tạo danh mục thành công!");
            res.redirect("/admin/post-category");
        } catch (error) {
            req.flash("error", "Tạo danh mục không thành công!");
            console.error("Error saving post:", error);
            res.redirect("/admin/post-category");
        }
    }

    // [PATCH] /admin/posts/edit:id
    async editPatch(req, res) {
        try {
            const formData = await handleForm(req, true);
            await PostCategory.updateOne({ _id: req.params.id }, formData);
            req.flash("success", "Sửa danh mục thành công!");
            res.redirect("/admin/post-category");
        } catch (error) {
            console.error("Error saving post:", error);
            req.flash("error", "Sửa danh mục không thành công!");
            res.redirect("/admin/post-category");
        }
    }

    // [PATCH] /admin/post-category/update-status
    async updateStatusPatch(req, res) {
        const statusUpdate = req.body;
        try {
            await PostCategory.updateOne(
                { _id: statusUpdate._id },
                { status: statusUpdate.value == "on" ? true : false }
            );
            res.json({ success: true, message: "Cập nhật thành công!" });
        } catch (error) {
            res.json({
                error: true,
                message: "Cập nhật không thành công!",
                err: error,
            });
        }
    }

    // [PATCH] /admin/post-category/update-more
    async updateMore(req, res) {
        try {
            const listIds = JSON.parse(req.body["list-id"]);
            delete req.body["list-id"];
            var dataUpdate = Object.entries(req.body).filter(([key, value]) => {
                if (value != "") return [key, value];
            });
            dataUpdate = Object.fromEntries(dataUpdate);
            if (dataUpdate.status) {
                dataUpdate.status = dataUpdate.status == "on" ? true : false;
            }
            await PostCategory.updateMany(
                { _id: { $in: listIds } },
                { $set: dataUpdate }
            );
            req.flash("success", "Cập nhật danh mục thành công!");
            res.redirect("back");
        } catch (error) {
            console.log(error);
            req.flash("error", "Cập nhật danh mục không thành công!");
            res.redirect("back");
        }
    }

    // [DELETE] /admin/post-category/delete-category/:id
    async delete(req, res) {
        try {
            await PostCategory.delete({ _id: req.params.id });
            req.flash("success", "Xóa danh mục thành công!");
            res.redirect("/admin/post-category");
        } catch (error) {
            console.log(error);
            req.flash("error", "Xóa danh mục không thành công!");
            res.redirect("/admin/post-category");
        }
    }

    // [DELETE] /admin/post-category/delete-more
    async deleteMore(req, res) {
        const listIds = JSON.parse(req.body["list-id"]);
        try {
            await PostCategory.delete({ _id: { $in: listIds } });
            req.flash("success", "Xóa danh mục thành công!");
            res.redirect("back");
        } catch (error) {
            console.log(error);
            req.flash("error", "Xóa danh mục không thành công!");
            res.redirect("back");
        }
    }
}

module.exports = new postCategoryController();
