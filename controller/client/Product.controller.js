class ProductController {
    show(req, res) {
        res.render("./client/page/products/", {
            pageTitle: "products",
        });
    }
}

module.exports = new ProductController();
