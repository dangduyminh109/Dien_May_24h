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
        res.render("./admin/page/products/edit", {
            pageTitle: "edit Products",
            PATH_ADMIN: system.PATH_ADMIN,
            product,
        });
    }

    // [POST] /admin/products/create
    async createPost(req, res) {
        try {
            const formData = await handleForm(req);
            const newProduct = new Product(formData);
            await newProduct.save();
            res.redirect("/admin/product");
        } catch (error) {
            console.error("Error saving product:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    // [POST] /admin/products/edit:id
    async editPost(req, res) {
        try {
            const formData = await handleForm(req,true);
            await Product.updateOne({ _id: req.params.id }, formData);
            res.redirect("/admin/product");
        } catch (error) {
            console.error("Error saving product:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    // [PATCH] /admin/products/update-price
    async updatePricePatch(req, res) {
        const priceUpdate = req.body;
        await Product.updateOne(
            { _id: priceUpdate._id },
            { [priceUpdate.field]: parseInt(priceUpdate.value) }
        );

        res.json({ message: "Cập nhật thành công" });
    }

    // [PATCH] /admin/products/update-status
    async updateStatusPatch(req, res) {
        const priceUpdate = req.body;
        await Product.updateOne(
            { _id: priceUpdate._id },
            { status: priceUpdate.value }
        );

        res.json({ message: "Cập nhật thành công" });
    }

    // [PATCH] /admin/products/update-more
    async updateMore(req, res) {
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
        res.redirect("back");
    }

    // [DELETE] /admin/products/delete-product/:id
    async delete(req, res) {
        await Product.delete({ _id: req.params.id });
        res.redirect("/admin/product");
    }

    // [DELETE] /admin/products/delete-more
    async deleteMore(req, res) {
        const listIds = JSON.parse(req.body["list-id"]);
        await Product.delete({ _id: { $in: listIds } });
        res.redirect("back");
    }
}

module.exports = new productController();
