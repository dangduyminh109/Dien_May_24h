const system = require("../../config/system.js");
const Product = require("../../models/product.model.js");
const {
    filterAndSort,
    generalHelper,
} = require("../../helpers/product.helper.js");
const paginationHelper = require("../../helpers/pagination.helper.js");
const getCategoryTree = require("../../helpers/get-category-tree.helper.js");
const ProductCategory = require("../../models/product-category.model.js");
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
            pageTitle: "Product Trash",
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
    
    // [GET] /admin/product-trash/detail:id
    async detail(req, res) {
        const product = await Product.findOneDeleted({
            _id: req.params.id,
        });
        const category = await ProductCategory.findOne({
            _id: product.category,
        });
        res.render("./admin/page/products/detail", {
            pageTitle: "Product detail",
            PATH_ADMIN: system.PATH_ADMIN,
            product,
            category,
            deleted: true,
        });
    }

    // [PATCH] /admin/product-trash/restore
    async restore(req, res) {
        try {
            await Product.restore({ _id: req.params.id });
            req.flash("success", "Khôi phục sản phẩm thành công!");
            res.redirect("/admin/product-trash");
        } catch (error) {
            console.error("Error saving product:", error);
            req.flash("error", "Khôi phục sản phẩm không thành công!");
            res.redirect("/admin/product-trash");
        }
    }

    // [PATCH] /admin/product-trash/update-price
    async updatePricePatch(req, res) {
        const priceUpdate = req.body;
        try {
            await Product.updateOneDeleted(
                { _id: priceUpdate._id },
                { [priceUpdate.field]: parseInt(priceUpdate.value) }
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

    // [PATCH] /admin/product-trash/update-status
    async updateStatusPatch(req, res) {
        const statusUpdate = req.body;
        try {
            await Product.updateOneDeleted(
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

    // [PATCH] /admin/product-trash/update-more
    async updateMore(req, res) {
        try {
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
            req.flash("success", "Câp nhật sản phẩm thành công!");
            res.redirect("back");
        } catch (error) {
            console.error("Error saving product:", error);
            req.flash("error", "Câp nhật sản phẩm không thành công!");
            res.redirect("back");
        }
    }

    // [PATCH] /admin/product-trash/restore-more
    async restoreMore(req, res) {
        try {
            const listIds = JSON.parse(req.body["list-id"]);
            await Product.restore({ _id: { $in: listIds } });
            req.flash("success", "Khôi phục sản phẩm thành công!");
            res.redirect("back");
        } catch (error) {
            console.error("Error saving product:", error);
            req.flash("error", "Khôi phục sản phẩm không thành công!");
            res.redirect("back");
        }
    }

    // [DELETE] /admin/product-trash/destroy-product/:id
    async destroy(req, res) {
        try {
            await Product.deleteOne({ _id: req.params.id });
            req.flash("success", "Xóa sản phẩm thành công!");
            res.redirect("/admin/product-trash");
        } catch (error) {
            console.error("Error saving product:", error);
            req.flash("error", "Xóa sản phẩm không thành công!");
            res.redirect("/admin/product-trash");
        }
    }

    // [DELETE] /admin/product-trash/destroy-more
    async destroyMore(req, res) {
        try {
            const listIds = JSON.parse(req.body["list-id"]);
            await Product.deleteMany({ _id: { $in: listIds } });
            req.flash("success", "Xóa sản phẩm thành công!");
            res.redirect("back");
        } catch (error) {
            console.error("Error saving product:", error);
            req.flash("error", "Xóa sản phẩm không thành công!");
            res.redirect("back");
        }
    }
}

module.exports = new productTrashController();
