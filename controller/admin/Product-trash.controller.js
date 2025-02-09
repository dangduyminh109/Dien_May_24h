const system = require("../../config/system.js");
const Product = require("../../models/product.model.js");
const { filterAndSort, general } = require("../../helpers/product.helper.js");
class productController {
    // [GET] /admin/product-trash
    async show(req, res) {
        const listDeletedProduct = await filterAndSort(req.query, true);
        const handle = req.session.backData || {};
        console.log(handle);
        res.render("./admin/page/products/product-trash", {
            pageTitle: "Create products",
            PATH_ADMIN: system.PATH_ADMIN,
            listDeletedProduct,
            general: general(listDeletedProduct),
            filter: req.query,
            handle: handle,
        });
    }

    // [PATCH] /admin/product-trash/restore
    async restore(req, res) {
        await Product.restore({ _id: req.params.id });
        res.redirect("/admin/products-trash");
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
        console.log(listIds);
        await Product.restore({ _id: { $in: listIds } });
        res.redirect("back");
    }

    // [DELETE] /admin/product-trash/destroy-product/:id
    async destroy(req, res) {
        await Product.deleteOne({ _id: req.params.id });
        res.redirect("/admin/products-trash");
    }

    // [DELETE] /admin/product-trash/destroy-more
    async destroyMore(req, res) {
        const listIds = JSON.parse(req.body["list-id"]);
        await Product.deleteMany({ _id: { $in: listIds } });
        res.redirect("back");
    }
}

module.exports = new productController();
