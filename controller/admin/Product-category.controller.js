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
        console.log(req.query);
        const { listProductCategory, pagination } = await filterAndSort(
            req.query
        );
        const handle = req.session.backData || {};
        const general = await generalHelper();
        const categoryTree = await getCategoryTree();
        res.render("./admin/page/product-category", {
            pageTitle: "Product-category",
            PATH_ADMIN: system.PATH_ADMIN,
            listProductCategory,
            general,
            filter: req.query,
            handle,
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

    // [GET] /admin/products/edit
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

    // [POST] /admin/product-category/create
    async createPost(req, res) {
        try {
            const formData = await handleForm(req);
            const newProductCategory = new ProductCategory(formData);
            await newProductCategory.save();
            res.redirect("/admin/product-category");
        } catch (error) {
            console.error("Error saving product:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    // [PATCH] /admin/products/edit:id
    async editPatch(req, res) {
        try {
            const formData = await handleForm(req, true);
            console.log(formData);
            await ProductCategory.updateOne({ _id: req.params.id }, formData);
            res.redirect("/admin/product-category");
        } catch (error) {
            console.error("Error saving product:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    // [PATCH] /admin/product-category/update-status
    async updateStatusPatch(req, res) {
        const statusUpdate = req.body;
        await ProductCategory.updateOne(
            { _id: statusUpdate._id },
            { status: statusUpdate.value }
        );
        res.json({ message: "Cập nhật thành công" });
    }

    // [PATCH] /admin/product-category/update-more
    async updateMore(req, res) {
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
        res.redirect("back");
    }

    // [DELETE] /admin/product-category/delete-category/:id
    async delete(req, res) {
        await ProductCategory.delete({ _id: req.params.id });
        res.redirect("/admin/product-category");
    }

    // [DELETE] /admin/product-category/delete-more
    async deleteMore(req, res) {
        const listIds = JSON.parse(req.body["list-id"]);
        await ProductCategory.delete({ _id: { $in: listIds } });
        res.redirect("back");
    }
}

module.exports = new productCategoryController();
