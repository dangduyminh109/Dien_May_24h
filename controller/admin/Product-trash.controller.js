const system = require("../../config/system.js");
const Product = require("../../models/product.model.js");
const {
    filterAndSort,
    generalHelper,
} = require("../../helpers/product.helper.js");
const paginationHelper = require("../../helpers/pagination.helper.js");
const getCategoryTree = require("../../helpers/get-category-tree.helper.js");
class productTrashController {
    // [GET] /admin/product-trash
    async show(req, res) {
        const currentPath = paginationHelper(req);
        const { listProduct, pagination } = await filterAndSort(
            req.query,
            true
        );
        const handle = req.session.backData || {};
        const general = await generalHelper(true);
        const categoryTree = await getCategoryTree();
        res.render("./admin/page/products/product-trash", {
            pageTitle: "Create products",
            PATH_ADMIN: system.PATH_ADMIN,
            listDeletedProduct: listProduct,
            general,
            filter: req.query,
            handle,
            pagination,
            currentPath,
            categoryTree,
        });
    }

    // [PATCH] /admin/product-trash/restore
    async restore(req, res) {
        await Product.restore({ _id: req.params.id });
        res.redirect("/admin/product-trash");
    }

    // [PATCH] /admin/product-trash/update-more
    async updateMore(req, res) {
        const listIds = JSON.parse(req.body["list-id"]);
        delete req.body["list-id"];
        var dataUpdate = Object.entries(req.body).filter(([key, value]) => {
            if (value != "") return [key, value];
        });
        dataUpdate = Object.fromEntries(dataUpdate);
        await Product.updateManyDeleted(
            { _id: { $in: listIds } },
            { $set: dataUpdate }
        );
        req.session.backData = {
            formData: req.body,
        };
        res.redirect("back");
    }

    // [PATCH] /admin/product-trash/restore-more
    async restoreMore(req, res) {
        const listIds = JSON.parse(req.body["list-id"]);
        await Product.restore({ _id: { $in: listIds } });
        res.redirect("back");
    }

    // [DELETE] /admin/product-trash/destroy-product/:id
    async destroy(req, res) {
        await Product.deleteOne({ _id: req.params.id });
        res.redirect("/admin/product-trash");
    }

    // [DELETE] /admin/product-trash/destroy-more
    async destroyMore(req, res) {
        const listIds = JSON.parse(req.body["list-id"]);
        await Product.deleteMany({ _id: { $in: listIds } });
        res.redirect("back");
    }
}

module.exports = new productTrashController();
