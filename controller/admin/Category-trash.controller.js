const system = require("../../config/system.js");
const ProductCategory = require("../../models/product-category.model.js");
const {
    filterAndSort,
    generalHelper,
} = require("../../helpers/product-category.helper.js");
const getCategoryTree = require("../../helpers/get-category-tree.helper.js");
const paginationHelper = require("../../helpers/pagination.helper.js");
class productController {
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
            pageTitle: "product trash",
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
        await ProductCategory.restore({ _id: req.params.id });
        res.redirect("/admin/category-trash");
    }

    // // [PATCH] /admin/product-trash/update-more
    // async updateMore(req, res) {
    //     const listIds = JSON.parse(req.body["list-id"]);
    //     delete req.body["list-id"];
    //     var dataUpdate = Object.entries(req.body).filter(([key, value]) => {
    //         if (value != "") return [key, value];
    //     });
    //     dataUpdate = Object.fromEntries(dataUpdate);
    //     await Product.updateManyDeleted(
    //         { _id: { $in: listIds } },
    //         { $set: dataUpdate }
    //     );
    //     req.session.backData = {
    //         formData: req.body,
    //     };
    //     res.redirect("back");
    // }

    // // [PATCH] /admin/product-trash/restore-more
    // async restoreMore(req, res) {
    //     const listIds = JSON.parse(req.body["list-id"]);
    //     await Product.restore({ _id: { $in: listIds } });
    //     res.redirect("back");
    // }

    // [DELETE] /admin/category-trash/destroy-category/:id
    async destroy(req, res) {
        await ProductCategory.deleteOne({ _id: req.params.id });
        res.redirect("/admin/category-trash");
    }

    // // [DELETE] /admin/product-trash/destroy-more
    // async destroyMore(req, res) {
    //     const listIds = JSON.parse(req.body["list-id"]);
    //     await Product.deleteMany({ _id: { $in: listIds } });
    //     res.redirect("back");
    // }
}

module.exports = new productController();
