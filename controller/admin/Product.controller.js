const system = require("../../config/system.js");
const Product = require("../../models/product.model.js");
const {
    filterAndSort,
    generalHelper,
    handleForm,
} = require("../../helpers/product.helper.js");
const paginationHelper = require("../../helpers/pagination.helper.js");
const getCategoryTree = require("../../helpers/get-category-tree.helper.js");

class productController {
    // [GET] /admin/products
    async show(req, res) {
        const currentPath = paginationHelper(req);
        const { listProduct, pagination } = await filterAndSort(req.query);
        const handle = req.session.backData || {};
        const general = await generalHelper();
        const categoryTree = await getCategoryTree();
        res.render("./admin/page/products", {
            pageTitle: "Products",
            PATH_ADMIN: system.PATH_ADMIN,
            listProduct,
            general,
            filter: req.query,
            handle,
            pagination,
            currentPath,
            categoryTree,
        });
    }

    // [GET] /admin/products/create
    async create(req, res) {
        const categoryTree = await getCategoryTree();
        res.render("./admin/page/products/create", {
            pageTitle: "Create products",
            PATH_ADMIN: system.PATH_ADMIN,
            categoryTree,
        });
    }

    // [GET] /admin/products/edit
    async edit(req, res) {
        const product = await Product.findOne({ _id: req.params.id });
        const categoryTree = await getCategoryTree();
        res.render("./admin/page/products/edit", {
            pageTitle: "edit Products",
            PATH_ADMIN: system.PATH_ADMIN,
            product,
            categoryTree,
        });
    }

    // [POST] /admin/products/create
    async createPost(req, res) {
        try {
            const formData = await handleForm(req);
            const newProduct = new Product(formData);
            await newProduct.save();
            req.flash("success", "Tạo sản phẩm thành công!");
            res.redirect("/admin/product");
        } catch (error) {
            req.flash("error", "Tạo sản phẩm không thành công!");
            console.error("Error saving product:", error);
            res.redirect("/admin/product");
        }
    }

    // [POST] /admin/products/edit:id
    async editPost(req, res) {
        try {
            const formData = await handleForm(req, true);
            await Product.updateOne({ _id: req.params.id }, formData);
            req.flash("success", "Sửa sản phẩm thành công!");
            res.redirect("/admin/product");
        } catch (error) {
            console.error("Error saving product:", error);
            req.flash("error", "Sửa sản phẩm không thành công!");
            res.redirect("/admin/product");
        }
    }

    // [PATCH] /admin/products/update-price
    async updatePricePatch(req, res) {
        const priceUpdate = req.body;
        try {
            await Product.updateOne(
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

    // [PATCH] /admin/products/update-status
    async updateStatusPatch(req, res) {
        const statusUpdate = req.body;
        try {
            await Product.updateOne(
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

    // [PATCH] /admin/products/update-more
    async updateMore(req, res) {
        try {
            const listIds = JSON.parse(req.body["list-id"]);
            delete req.body["list-id"];
            var dataUpdate = Object.entries(req.body).filter(([key, value]) => {
                if (value != "") return [key, value];
            });
            dataUpdate = Object.fromEntries(dataUpdate);
            await Product.updateMany(
                { _id: { $in: listIds } },
                { $set: dataUpdate }
            );
            req.flash("success", "Cập nhật phẩm thành công!");
            res.redirect("back");
        } catch (error) {
            console.error("Error saving product:", error);
            req.flash("error", "Cập nhật phẩm không thành công!");
            res.redirect("back");
        }
    }

    // [DELETE] /admin/products/delete-product/:id
    async delete(req, res) {
        try {
            await Product.delete({ _id: req.params.id });
            req.flash("success", "Xóa sản phẩm thành công!");
            res.redirect("/admin/product");
        } catch (error) {
            console.error("Error saving product:", error);
            req.flash("error", "Xóa sản phẩm không thành công!");
            res.redirect("/admin/product");
        }
    }

    // [DELETE] /admin/products/delete-more
    async deleteMore(req, res) {
        try {
            const listIds = JSON.parse(req.body["list-id"]);
            await Product.delete({ _id: { $in: listIds } });
            req.flash("success", "Xóa sản phẩm thành công!");
            res.redirect("back");
        } catch (error) {
            console.error("Error saving product:", error);
            req.flash("error", "Xóa sản phẩm không thành công!");
            res.redirect("back");
        }
    }
}

module.exports = new productController();
