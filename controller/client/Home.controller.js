const Product = require("../../models/product.model.js");
const ProductCategory = require("../../models/product-category.model.js");
const getCategoryTree = require("../../helpers/get-category-tree.helper.js");

class homeController {
    async show(req, res) {
        const categoryTree = await getCategoryTree();
        res.render("./client/page/home/", {
            pageTitle: "Điện Máy 24h",
            categoryTree,
        });
    }
}

module.exports = new homeController();
