const Product = require("../../models/product.model.js");
const getCategoryTree = require("../../helpers/get-category-tree.helper.js");

class homeController {
    async show(req, res) {
        const categoryTree = await getCategoryTree();
        const listProduct = await Product.find({});
        res.render("./client/page/home/", {
            pageTitle: "Điện Máy 24h",
            categoryTree,
            listProduct
        });
    }
}

module.exports = new homeController();
