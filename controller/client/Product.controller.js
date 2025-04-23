const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const getCategoryTree = require("../../helpers/get-category-tree.helper.js");
class ProductController {
    show(req, res) {
        res.render("./client/page/products/", {
            pageTitle: "products",
        });
    }
    async detail(req, res) {
        const categoryTree = await getCategoryTree();
        const product = await Product.findOne({ slug: req.params.slug });
        const relatedProducts = await Product.find({
            category: product.category,
        });
        const category = await ProductCategory.findOne({
            _id: product.category,
        });
        res.render("./client/page/products/detail", {
            pageTitle: "product detail",
            product,
            category,
            categoryTree,
            relatedProducts,
        });
    }
}

module.exports = new ProductController();
