const system = require("../../config/system.js");
const ProductCategory = require("../../models/product-category.model.js");
const {
    filterAndSort,
    generalHelper,
    handleForm,
} = require("../../helpers/product-category.helper.js");
const paginationHelper = require("../../helpers/pagination.helper.js");
const getCategoryTree = require("../../helpers/get-category-tree.helper.js");

class productCategoryController {
    // [GET] /admin/product-category
    async show(req, res) {
        const currentPath = paginationHelper(req);
        const { listProductCategory, pagination } = await filterAndSort(
            req.query
        );
        const handleData = req.session.backData || {};
        const general = await generalHelper();
        const categoryTree = await getCategoryTree();
        res.render("./admin/page/product-category", {
            pageTitle: "Product-category",
            PATH_ADMIN: system.PATH_ADMIN,
            listProductCategory,
            general,
            filter: req.query,
            handle: handleData.formData,
            pagination,
            currentPath,
            categoryTree,
        });
    }

    // [GET] /admin/product-category/create
    async create(req, res) {
        const categoryTree = await getCategoryTree();
        res.render("./admin/page/product-category/create", {
            pageTitle: "Create product-category",
            PATH_ADMIN: system.PATH_ADMIN,
            categoryTree,
        });
    }

    // [GET] /admin/products/edit/:id
    async edit(req, res) {
        const productCategory = await ProductCategory.findOne({
            _id: req.params.id,
        });
        const categoryTree = await getCategoryTree();
        res.render("./admin/page/product-category/edit", {
            pageTitle: "Edit Product Category",
            PATH_ADMIN: system.PATH_ADMIN,
            productCategory,
            categoryTree,
        });
    }

    // [GET] /admin/product-category/detail:id
    async detail(req, res) {
        const productCategory = await ProductCategory.findOne({
            _id: req.params.id,
        });
        var parentCategory = "";
        if (productCategory.parentId != "") {
            parentCategory = await ProductCategory.findOne({
                _id: productCategory.parentId,
            });
        }
        res.render("./admin/page/product-category/detail", {
            pageTitle: "Product category detail",
            PATH_ADMIN: system.PATH_ADMIN,
            productCategory,
            parentCategory:
                parentCategory != ""
                    ? parentCategory.name
                    : "Không có danh mục cha",
        });
    }

    // [POST] /admin/product-category/create
    async createPost(req, res) {
        try {
            const formData = await handleForm(req);
            const newProductCategory = new ProductCategory(formData);
            await newProductCategory.save();
            req.flash("success", "Tạo danh mục thành công!");
            res.redirect("/admin/product-category");
        } catch (error) {
            req.flash("error", "Tạo danh mục không thành công!");
            console.error("Error saving product:", error);
            res.redirect("/admin/product-category");
        }
    }

    // [PATCH] /admin/products/edit:id
    async editPatch(req, res) {
        try {
            const formData = await handleForm(req, true);
            await ProductCategory.updateOne({ _id: req.params.id }, formData);
            req.flash("success", "Sửa danh mục thành công!");
            res.redirect("/admin/product-category");
        } catch (error) {
            console.error("Error saving product:", error);
            req.flash("error", "Sửa danh mục không thành công!");
            res.redirect("/admin/product-category");
        }
    }

    // [PATCH] /admin/product-category/update-status
    async updateStatusPatch(req, res) {
        const statusUpdate = req.body;
        try {
            await ProductCategory.updateOne(
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

    // [PATCH] /admin/product-category/update-more
    async updateMore(req, res) {
        try {
            const listIds = JSON.parse(req.body["list-id"]);
            delete req.body["list-id"];
            var dataUpdate = Object.entries(req.body).filter(([key, value]) => {
                if (value != "") return [key, value];
            });
            dataUpdate = Object.fromEntries(dataUpdate);
            await ProductCategory.updateMany(
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

    // [DELETE] /admin/product-category/delete-category/:id
    async delete(req, res) {
        try {
            await ProductCategory.delete({ _id: req.params.id });
            req.flash("success", "Xóa danh mục thành công!");
            res.redirect("/admin/product-category");
        } catch (error) {
            console.log(error);
            req.flash("error", "Xóa danh mục không thành công!");
            res.redirect("/admin/product-category");
        }
    }

    // [DELETE] /admin/product-category/delete-more
    async deleteMore(req, res) {
        const listIds = JSON.parse(req.body["list-id"]);

        try {
            await ProductCategory.delete({ _id: { $in: listIds } });
            req.flash("success", "Xóa danh mục thành công!");
            res.redirect("back");
        } catch (error) {
            console.log(error);
            req.flash("error", "Xóa danh mục không thành công!");
            res.redirect("back");
        }
    }
}

module.exports = new productCategoryController();
