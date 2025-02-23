const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const getCategoryTree = require("../../helpers/get-category-tree.helper");
const { filterAndSort } = require("../../helpers/product-client.helper.js");
const paginationHelper = require("../../helpers/pagination.helper.js");
class homeController {
    async show(req, res) {
        const categoryTree = await getCategoryTree();
        const listProduct = await Product.find({});
        res.render("./client/page/home/", {
            pageTitle: "Điện Máy 24h",
            categoryTree,
            listProduct,
        });
    }

    async showProductByCategory(req, res) {
        const categoryTree = await getCategoryTree();
        const currentPath = paginationHelper(req);
        const category = await ProductCategory.findOne({
            slug: req.params.slug,
        });
        const { listProduct, pagination } = await filterAndSort(
            req.query,
            category
        );
        res.render("./client/page/products/", {
            pageTitle: `${req.params.slug}`,
            category,
            categoryTree,
            listProduct,
            pagination,
            currentPath,
            query: req.query,
        });
    }
}

module.exports = new homeController();
