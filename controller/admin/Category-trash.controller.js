const system = require("../../config/system.js");
const ProductCategory = require("../../models/product-category.model.js");
const {
    filterAndSort,
    generalHelper,
} = require("../../helpers/product-category.helper.js");
const getCategoryTree = require("../../helpers/get-category-tree.helper.js");
const paginationHelper = require("../../helpers/pagination.helper.js");
class categoryTrashController {
    // [GET] /admin/product-trash
    async show(req, res) {
        const currentPath = paginationHelper(req);
        const { listProductCategory, pagination } = await filterAndSort(
            req.query,
            true
        );
        const handle = req.session.backData || {};
        const categoryTree = await getCategoryTree();
        const general = await generalHelper(true);
        res.render("./admin/page/product-category/category-trash", {
            pageTitle: "Category trash",
            PATH_ADMIN: system.PATH_ADMIN,
            listDeletedCategory: listProductCategory,
            general,
            filter: req.query,
            handle,
            pagination,
            currentPath,
            categoryTree,
        });
    }

    // [PATCH] /admin/category-trash/restore-category
    async restore(req, res) {
        try {
            await ProductCategory.restore({ _id: req.params.id });
            req.flash("success", "Khôi phục danh mục thành công!");
            res.redirect("/admin/category-trash");
        } catch (error) {
            console.log(error);
            req.flash("error", "Khôi phục danh mục không thành công!");
            res.redirect("/admin/category-trash");
        }
    }

    // [PATCH] /admin/category-trash/update-more
    async updateMore(req, res) {
        try {
            const listIds = JSON.parse(req.body["list-id"]);
            delete req.body["list-id"];
            var dataUpdate = Object.entries(req.body).filter(([key, value]) => {
                if (value != "") return [key, value];
            });
            dataUpdate = Object.fromEntries(dataUpdate);
            await ProductCategory.updateManyDeleted(
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

    // [PATCH] /admin/category-trash/restore-more
    async restoreMore(req, res) {
        const listIds = JSON.parse(req.body["list-id"]);
        try {
            await ProductCategory.restore({ _id: { $in: listIds } });
            req.flash("success", "Khôi phục danh mục thành công!");
            res.redirect("/admin/category-trash");
        } catch (error) {
            console.log(error);
            req.flash("error", "Khôi phục danh mục không thành công!");
            res.redirect("/admin/category-trash");
        }
    }

    // [PATCH] /admin/category-trash/update-status
    async updateStatusPatch(req, res) {
        const statusUpdate = req.body;
        try {
            await ProductCategory.updateOneDeleted(
                { _id: statusUpdate._id },
                { status: statusUpdate.value }
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

    // [DELETE] /admin/category-trash/destroy-category/:id
    async destroy(req, res) {
        try {
            await ProductCategory.deleteOne({ _id: req.params.id });
            req.flash("success", "Xóa danh mục thành công!");
            res.redirect("/admin/category-trash");
        } catch (error) {
            console.log(error);
            req.flash("error", "Xóa danh mục không thành công!");
            res.redirect("/admin/category-trash");
        }
    }

    // [DELETE] /admin/category-trash/destroy-more
    async destroyMore(req, res) {
        try {
            const listIds = JSON.parse(req.body["list-id"]);
            await ProductCategory.deleteMany({ _id: { $in: listIds } });
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
