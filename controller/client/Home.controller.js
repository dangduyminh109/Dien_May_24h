const Product = require("../../models/product.model");
class homeController {
    async show(req, res) {
        const listProduct = await Product.find({}).sort({
            order: 1,
        });
       
        res.render("./client/page/home/", {
            pageTitle: "Điện Máy 24h",
            listProduct,
        });
    }
}

module.exports = new homeController();
