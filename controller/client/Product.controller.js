const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const { filterAndSort } = require("../../helpers/product-client.helper.js");
const paginationHelper = require("../../helpers/pagination.helper.js");
class ProductController {
    async show(req, res) {
        const currentPath = paginationHelper(req);
        const { listProduct, category, pageTitle, pagination } =
            await filterAndSort(req);
        res.render("./client/page/products/", {
            pageTitle,
            category,
            listProduct,
            pagination,
            currentPath,
            searchKeyWord: req.query.keyword || "",
            currentHref: req.originalUrl,
            query: req.query,
        });
    }

    async detail(req, res) {
        try {
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
                relatedProducts,
            });
        } catch (error) {
            console.error("Error:", error);
            req.flash("error", "có lỗi xảy ra!");
            res.redirect("/");
        }
    }

    async suggest(req, res) {
        let keyword = req.query.keyword || "";
        const result = await Product.find({
            name: { $regex: keyword, $options: "i" },
        }).limit(5);
        res.json(result);
    }
}

module.exports = new ProductController();
