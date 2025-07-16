const system = require("../../config/system.js");
const PostCategory = require("../../models/post-category.model.js");
const {
    filterAndSort,
    generalHelper,
} = require("../../helpers/post-category.helper.js");
const getCategoryTree = require("../../helpers/get-category-tree.helper.js");
const paginationHelper = require("../../helpers/pagination.helper.js");
class categoryTrashController {
    // [GET] /admin/post-category-trash
    async show(req, res) {
        const currentPath = paginationHelper(req);
        const { listPostCategory, pagination } = await filterAndSort(req, true);
        const handleData = req.session.backData || {};
        const categoryTree = await getCategoryTree(PostCategory);
        const general = await generalHelper(true);
        res.render("./admin/page/post-category/post-category-trash", {
            pageTitle: "Category trash",
            PATH_ADMIN: system.PATH_ADMIN,
            listDeletedPostCategory: listPostCategory,
            general,
            filter: req.query,
            handle: handleData.formData,
            pagination,
            currentPath,
            categoryTree,
        });
    }
    // [GET] /admin/post-category-trash/detail:id
    async detail(req, res) {
        const postCategory = await PostCategory.findOneDeleted({
            _id: req.params.id,
        });
        var parentCategory = "";
        if (postCategory.parentId != "") {
            parentCategory = await PostCategory.findOne({
                _id: postCategory.parentId,
            });
        }
        res.render("./admin/page/post-category/detail", {
            pageTitle: "Product detail",
            PATH_ADMIN: system.PATH_ADMIN,
            postCategory,
            parentCategory:
                parentCategory != ""
                    ? parentCategory.name
                    : "Không có danh mục cha",
            deleted: true,
        });
    }

    // [PATCH] /admin/post-category-trash/restore-category
    async restore(req, res) {
        try {
            await PostCategory.restore({ _id: req.params.id });
            req.flash("success", "Khôi phục danh mục thành công!");
            res.redirect("/admin/post-category-trash");
        } catch (error) {
            console.log(error);
            req.flash("error", "Khôi phục danh mục không thành công!");
            res.redirect("/admin/post-category-trash");
        }
    }

    // [PATCH] /admin/post-category-trash/update-more
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
            await PostCategory.updateManyDeleted(
                { _id: { $in: listIds } },
                { $set: dataUpdate }
            );
            req.session.backData = {
                formData: req.body,
            };
            req.flash("success", "Cập nhật danh mục thành công!");
            res.redirect("back");
        } catch (error) {
            console.log(error);
            req.flash("error", "Cập nhật danh mục không thành công!");
            res.redirect("back");
        }
    }

    // [PATCH] /admin/post-category-trash/restore-more
    async restoreMore(req, res) {
        const listIds = JSON.parse(req.body["list-id"]);
        try {
            await PostCategory.restore({ _id: { $in: listIds } });
            req.flash("success", "Khôi phục danh mục thành công!");
            res.redirect("/admin/post-category-trash");
        } catch (error) {
            console.log(error);
            req.flash("error", "Khôi phục danh mục không thành công!");
            res.redirect("/admin/post-category-trash");
        }
    }

    // [PATCH] /admin/post-category-trash/update-status
    async updateStatusPatch(req, res) {
        const statusUpdate = req.body;
        try {
            await PostCategory.updateOneDeleted(
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

    // [DELETE] /admin/post-category-trash/destroy-category/:id
    async destroy(req, res) {
        try {
            await PostCategory.deleteOne({ _id: req.params.id });
            req.flash("success", "Xóa danh mục thành công!");
            res.redirect("/admin/post-category-trash");
        } catch (error) {
            console.log(error);
            req.flash("error", "Xóa danh mục không thành công!");
            res.redirect("/admin/post-category-trash");
        }
    }

    // [DELETE] /admin/post-category-trash/destroy-more
    async destroyMore(req, res) {
        try {
            const listIds = JSON.parse(req.body["list-id"]);
            await PostCategory.deleteMany({ _id: { $in: listIds } });
            req.flash("success", "Xóa danh mục thành công!");
            res.redirect("back");
        } catch (error) {
            console.log(error);
            req.flash("error", "Xóa danh mục không thành công!");
            res.redirect("back");
        }
    }
}

module.exports = new categoryTrashController();
